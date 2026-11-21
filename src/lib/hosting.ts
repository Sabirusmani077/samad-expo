import { readDb, writeDb } from "./db";
import { HostedProject, HostedDeployment, HostedProjectFile, ProjectVisibility } from "./types";
import { deleteProjectFiles, HOSTED_SITES_ROOT } from "./storage";
import fs from "fs";
import path from "path";

/**
 * Generates URL-friendly slug from string
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "project";
}

/**
 * Ensures unique slug among hosted projects
 */
export function getUniqueSlug(baseSlug: string, currentProjectId?: string): string {
  const db = readDb();
  const existing = (db.hostedProjects || []).filter((p) => p.id !== currentProjectId);
  let candidate = baseSlug;
  let counter = 1;

  while (existing.some((p) => p.slug === candidate)) {
    candidate = `${baseSlug}-${counter}`;
    counter++;
  }
  return candidate;
}

/**
 * Get all public live projects for discovery and search
 */
export function getPublicProjects(): HostedProject[] {
  const db = readDb();
  return (db.hostedProjects || []).filter(
    (p) => p.visibility === "public" && p.deploymentStatus === "live"
  );
}

/**
 * Get projects owned by a specific user
 */
export function getUserProjects(userId: string): HostedProject[] {
  const db = readDb();
  return (db.hostedProjects || []).filter((p) => p.userId === userId);
}

/**
 * Find project by ID
 */
export function getProjectById(id: string): HostedProject | undefined {
  const db = readDb();
  return (db.hostedProjects || []).find((p) => p.id === id);
}

/**
 * Find project by slug
 */
export function getProjectBySlug(slug: string): HostedProject | undefined {
  const db = readDb();
  return (db.hostedProjects || []).find((p) => p.slug === slug);
}

/**
 * Create a new hosted project entry
 */
export function createHostedProject(data: {
  userId: string;
  userEmail?: string;
  userName?: string;
  projectName: string;
  description?: string;
  visibility?: ProjectVisibility;
  customSlug?: string;
}): HostedProject {
  const db = readDb();
  if (!Array.isArray(db.hostedProjects)) db.hostedProjects = [];

  const baseSlug = data.customSlug ? generateSlug(data.customSlug) : generateSlug(data.projectName);
  const slug = getUniqueSlug(baseSlug);
  const now = new Date().toISOString();
  const id = `proj_${crypto.randomUUID().slice(0, 10)}`;

  const project: HostedProject = {
    id,
    userId: data.userId,
    userEmail: data.userEmail || "",
    userName: data.userName || "",
    projectName: data.projectName.trim(),
    slug,
    description: data.description?.trim() || "",
    visibility: data.visibility || "public",
    deploymentStatus: "pending",
    storageUsedBytes: 0,
    totalDeployments: 0,
    viewCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  db.hostedProjects.unshift(project);
  writeDb(db);
  return project;
}

/**
 * Record a deployment and update project status
 */
export function recordDeployment(data: {
  projectId: string;
  userId: string;
  fileCount: number;
  totalSize: number;
  entryFile: string;
  storagePath: string;
  files: { fileName: string; filePath: string; fileSize: number; contentType: string }[];
}): { project: HostedProject; deployment: HostedDeployment } {
  const db = readDb();
  if (!Array.isArray(db.hostedProjects)) db.hostedProjects = [];
  if (!Array.isArray(db.hostedDeployments)) db.hostedDeployments = [];
  if (!Array.isArray(db.hostedProjectFiles)) db.hostedProjectFiles = [];

  const projectIndex = db.hostedProjects.findIndex((p) => p.id === data.projectId);
  if (projectIndex === -1) {
    throw new Error("Project not found.");
  }

  const project = db.hostedProjects[projectIndex];
  const now = new Date().toISOString();
  const deploymentId = `dep_${crypto.randomUUID().slice(0, 10)}`;
  const deploymentUrl = `/sites/${project.slug}`;

  const deployment: HostedDeployment = {
    id: deploymentId,
    projectId: project.id,
    userId: data.userId,
    deploymentStatus: "live",
    deploymentUrl,
    storagePath: data.storagePath,
    fileCount: data.fileCount,
    totalSize: data.totalSize,
    entryFile: data.entryFile,
    logs: [
      `[${now}] Archive verified: ${data.fileCount} files, ${(data.totalSize / 1024).toFixed(1)} KB`,
      `[${now}] Entry file detected: ${data.entryFile}`,
      `[${now}] Deployed successfully to ${deploymentUrl}`,
    ],
    createdAt: now,
    publishedAt: now,
  };

  db.hostedDeployments.unshift(deployment);

  // Store file records
  for (const f of data.files) {
    const fileId = `file_${crypto.randomUUID().slice(0, 10)}`;
    const fileRecord: HostedProjectFile = {
      id: fileId,
      projectId: project.id,
      deploymentId,
      fileName: f.fileName,
      filePath: f.filePath,
      fileSize: f.fileSize,
      contentType: f.contentType,
      createdAt: now,
    };
    db.hostedProjectFiles.push(fileRecord);
  }

  // Update project
  project.activeDeploymentId = deploymentId;
  project.deploymentUrl = deploymentUrl;
  project.deploymentStatus = "live";
  project.storageUsedBytes = data.totalSize;
  project.totalDeployments = (project.totalDeployments || 0) + 1;
  project.updatedAt = now;

  db.hostedProjects[projectIndex] = project;
  writeDb(db);

  return { project, deployment };
}

/**
 * Increment view count for a deployed project
 */
export function incrementProjectViews(projectId: string): void {
  const db = readDb();
  const project = (db.hostedProjects || []).find((p) => p.id === projectId);
  if (project) {
    project.viewCount = (project.viewCount || 0) + 1;
    writeDb(db);
  }
}

/**
 * Delete a hosted project, its deployments, files, and physical disk storage
 */
export function deleteHostedProject(projectId: string, requesterUserId: string, isAdmin = false): boolean {
  const db = readDb();
  if (!Array.isArray(db.hostedProjects)) return false;

  const project = db.hostedProjects.find((p) => p.id === projectId);
  if (!project) return false;

  if (!isAdmin && project.userId !== requesterUserId) {
    throw new Error("Unauthorized to delete this project.");
  }

  // Remove disk files
  deleteProjectFiles(project.userId, project.slug);

  // Remove DB entries
  db.hostedProjects = db.hostedProjects.filter((p) => p.id !== projectId);
  if (Array.isArray(db.hostedDeployments)) {
    db.hostedDeployments = db.hostedDeployments.filter((d) => d.projectId !== projectId);
  }
  if (Array.isArray(db.hostedProjectFiles)) {
    db.hostedProjectFiles = db.hostedProjectFiles.filter((f) => f.projectId !== projectId);
  }

  writeDb(db);
  return true;
}

/**
 * Ensure the default 3 preserved projects exist on disk with an HTML redirect or mirror
 */
export function ensureDefaultProjectsOnDisk(): void {
  const adminId = "usr_admin_01";
  const defaults = [
    {
      slug: "mdk-chrono-age-calculator",
      title: "MDK Chrono Age Calculator",
      targetUrl: "https://sabirusmani077.github.io/Age-calculator/",
    },
    {
      slug: "mdk-convertor",
      title: "MDK Unit & Media Convertor",
      targetUrl: "https://sabirusmani077.github.io/MDK-Convertor/",
    },
    {
      slug: "sabir-usmani-portfolio",
      title: "Sabir Usmani Portfolio",
      targetUrl: "https://sabirusmani077.github.io/Self-Portfolio-/",
    },
  ];

  for (const item of defaults) {
    const dir = path.join(HOSTED_SITES_ROOT, adminId, item.slug);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const indexPath = path.join(dir, "index.html");
    if (!fs.existsSync(indexPath)) {
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${item.title} - Samad Expo Hosted</title>
  <style>
    body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; background: #000; font-family: sans-serif; }
    iframe { width: 100%; height: 100%; border: none; }
  </style>
</head>
<body>
  <iframe src="${item.targetUrl}" title="${item.title}" sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe>
</body>
</html>`;
      fs.writeFileSync(indexPath, html, "utf8");
    }
  }
}
