import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { readDb, writeDb } from "@/lib/db";
import { deleteHostedProject, getProjectById } from "@/lib/hosting";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = getProjectById(id);
  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  const user = await getCurrentUser();
  if (project.visibility === "private" && (!user || (user.id !== project.userId && user.role !== "admin"))) {
    return NextResponse.json({ error: "Access denied. Private project." }, { status: 403 });
  }

  const db = readDb();
  const deployments = (db.hostedDeployments || []).filter((d) => d.projectId === project.id);
  const files = (db.hostedProjectFiles || []).filter((f) => f.projectId === project.id);

  return NextResponse.json({ project, deployments, files });
}

export async function PUT(
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

  try {
    const body = await request.json();
    const db = readDb();
    if (!Array.isArray(db.hostedProjects)) db.hostedProjects = [];
    const index = db.hostedProjects.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const current = db.hostedProjects[index];
    if (typeof body.projectName === "string" && body.projectName.trim()) {
      current.projectName = body.projectName.trim();
    }
    if (typeof body.description === "string") {
      current.description = body.description.trim();
    }
    if (body.visibility === "public" || body.visibility === "private") {
      current.visibility = body.visibility;
    }
    if (typeof body.thumbnail === "string") {
      current.thumbnail = body.thumbnail.trim();
    }
    current.updatedAt = new Date().toISOString();

    db.hostedProjects[index] = current;
    writeDb(db);

    return NextResponse.json({ success: true, project: current });
  } catch {
    return NextResponse.json({ error: "Unable to update project." }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const deleted = deleteHostedProject(id, user.id, user.role === "admin");
    if (!deleted) {
      return NextResponse.json({ error: "Project not found or could not be removed." }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Project deleted successfully." });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Deletion failed";
    return NextResponse.json({ error: msg }, { status: 403 });
  }
}
