import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { extractAndStoreProjectZip, getMimeType, HOSTED_SITES_ROOT, FORBIDDEN_EXTENSIONS } from "@/lib/storage";
import { createHostedProject, getUniqueSlug, generateSlug, recordDeployment } from "@/lib/hosting";
import { readDb, writeDb } from "@/lib/db";
import { sanitizeInputText } from "@/lib/security";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required. Please log in to upload projects." },
        { status: 401 }
      );
    }

    const ip = getClientIp(request.headers);
    const limiter = rateLimit(`upload:${user.id}:${ip}`, 15, 15 * 60);
    if (!limiter.success) {
      return NextResponse.json(
        { error: `Upload rate limit reached. Please wait ${limiter.resetInSeconds} seconds before uploading another website.` },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const rawProjectName = String(formData.get("projectName") || "");
    const projectName = sanitizeInputText(rawProjectName);
    const description = sanitizeInputText(String(formData.get("description") || ""));
    const visibility = (formData.get("visibility") as "public" | "private") || "public";
    const customSlugInput = sanitizeInputText(String(formData.get("slug") || ""));

    if (!projectName || projectName.length < 2) {
      return NextResponse.json(
        { error: "Project name is required (at least 2 characters)." },
        { status: 400 }
      );
    }

    const singleZip = formData.get("file") as File | null;
    const allFiles = formData.getAll("files") as File[];

    if (!singleZip && allFiles.length === 0) {
      return NextResponse.json(
        { error: "Please upload a ZIP file or folder containing your website assets." },
        { status: 400 }
      );
    }

    // Initialize or retrieve project
    const slug = getUniqueSlug(customSlugInput ? generateSlug(customSlugInput) : generateSlug(projectName));
    const project = createHostedProject({
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      projectName,
      description,
      visibility,
      customSlug: slug,
    });

    // Case 1: Uploading a ZIP file
    if (singleZip && (singleZip.name.toLowerCase().endsWith(".zip") || singleZip.type.includes("zip"))) {
      const buffer = Buffer.from(await singleZip.arrayBuffer());
      const extraction = await extractAndStoreProjectZip(user.id, project.slug, buffer);

      if (!extraction.success) {
        // Rollback project from DB
        const db = readDb();
        db.hostedProjects = (db.hostedProjects || []).filter((p) => p.id !== project.id);
        writeDb(db);

        return NextResponse.json(
          { error: extraction.error || "Failed to process ZIP archive." },
          { status: 400 }
        );
      }

      const { project: deployedProj, deployment } = recordDeployment({
        projectId: project.id,
        userId: user.id,
        fileCount: extraction.fileCount,
        totalSize: extraction.totalSize,
        entryFile: extraction.entryFile,
        storagePath: extraction.storagePath,
        files: extraction.files,
      });

      return NextResponse.json({
        success: true,
        project: deployedProj,
        deployment,
        url: deployedProj.deploymentUrl,
        message: "Website uploaded and deployed successfully!",
      });
    }

    // Case 2: Multi-file / Folder upload
    const filesToProcess = allFiles.length > 0 ? allFiles : singleZip ? [singleZip] : [];
    const targetDir = path.resolve(HOSTED_SITES_ROOT, user.id, project.slug);
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
    }
    fs.mkdirSync(targetDir, { recursive: true });

    let totalSize = 0;
    const extractedFiles: { fileName: string; filePath: string; fileSize: number; contentType: string }[] = [];
    let entryFile = "";

    for (const file of filesToProcess) {
      const rawPath = file.name || "index.html";
      const ext = path.extname(rawPath).toLowerCase();

      if (FORBIDDEN_EXTENSIONS.has(ext)) {
        fs.rmSync(targetDir, { recursive: true, force: true });
        const db = readDb();
        db.hostedProjects = (db.hostedProjects || []).filter((p) => p.id !== project.id);
        writeDb(db);

        return NextResponse.json(
          { error: `Security check: Forbidden file extension "${ext}" in "${rawPath}". Only static assets are allowed.` },
          { status: 400 }
        );
      }

      const normalized = path.normalize(rawPath).replace(/^(\.\.[\/\\])+/, "");
      const fullPath = path.resolve(targetDir, normalized);
      if (!fullPath.startsWith(targetDir)) continue;

      const parentDir = path.dirname(fullPath);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }

      const buf = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(fullPath, buf);
      totalSize += buf.length;

      const relativePath = path.relative(targetDir, fullPath).replace(/\\/g, "/");
      const cType = getMimeType(fullPath);

      extractedFiles.push({
        fileName: path.basename(fullPath),
        filePath: relativePath,
        fileSize: buf.length,
        contentType: cType,
      });

      if (relativePath.toLowerCase() === "index.html" || (!entryFile && path.basename(fullPath).toLowerCase() === "index.html")) {
        entryFile = relativePath;
      }
    }

    if (!entryFile && extractedFiles.length > 0) {
      entryFile = extractedFiles[0].filePath;
    }

    const { project: deployedProj, deployment } = recordDeployment({
      projectId: project.id,
      userId: user.id,
      fileCount: extractedFiles.length,
      totalSize,
      entryFile: entryFile || "index.html",
      storagePath: targetDir,
      files: extractedFiles,
    });

    return NextResponse.json({
      success: true,
      project: deployedProj,
      deployment,
      url: deployedProj.deploymentUrl,
      message: "Website files uploaded and deployed successfully!",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Upload error";
    return NextResponse.json(
      { error: `Upload processing failed: ${msg}` },
      { status: 500 }
    );
  }
}
