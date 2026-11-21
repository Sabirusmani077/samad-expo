import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { readDb, writeDb } from "@/lib/db";
import { getProjectById } from "@/lib/hosting";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const project = getProjectById(id);
  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  if (project.userId !== user.id && user.role !== "admin") {
    return NextResponse.json({ error: "Permission denied." }, { status: 403 });
  }

  const db = readDb();
  const projIndex = (db.hostedProjects || []).findIndex((p) => p.id === id);
  if (projIndex === -1) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  const now = new Date().toISOString();
  const deploymentId = `dep_${crypto.randomUUID().slice(0, 10)}`;
  const deploymentUrl = `/sites/${project.slug}`;

  const deployment = {
    id: deploymentId,
    projectId: project.id,
    userId: user.id,
    deploymentStatus: "live" as const,
    deploymentUrl,
    storagePath: `data/hosted-sites/${project.userId}/${project.slug}`,
    fileCount: 1,
    totalSize: project.storageUsedBytes || 0,
    entryFile: "index.html",
    logs: [
      `[${now}] Redeployment triggered by ${user.name} (${user.email})`,
      `[${now}] Assets verified and activated at ${deploymentUrl}`,
    ],
    createdAt: now,
    publishedAt: now,
  };

  if (!Array.isArray(db.hostedProjects)) db.hostedProjects = [];
  if (!Array.isArray(db.hostedDeployments)) db.hostedDeployments = [];
  db.hostedDeployments.unshift(deployment);

  db.hostedProjects[projIndex].activeDeploymentId = deploymentId;
  db.hostedProjects[projIndex].deploymentUrl = deploymentUrl;
  db.hostedProjects[projIndex].deploymentStatus = "live";
  db.hostedProjects[projIndex].totalDeployments = (db.hostedProjects[projIndex].totalDeployments || 0) + 1;
  db.hostedProjects[projIndex].updatedAt = now;

  writeDb(db);

  return NextResponse.json({
    success: true,
    message: "Deployment activated successfully.",
    project: db.hostedProjects[projIndex],
    deployment,
  });
}
