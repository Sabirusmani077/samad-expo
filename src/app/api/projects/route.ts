import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { getPublicProjects, getUserProjects } from "@/lib/hosting";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const scope = searchParams.get("scope");
  const query = (searchParams.get("q") || "").trim().toLowerCase();

  const user = await getCurrentUser();

  // Public directory or search scope
  if (scope === "public" || !user) {
    let projects = getPublicProjects();
    if (query) {
      projects = projects.filter((p) =>
        p.projectName.toLowerCase().includes(query) ||
        p.slug.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query)) ||
        (p.userName && p.userName.toLowerCase().includes(query))
      );
    }
    return NextResponse.json({ projects, count: projects.length });
  }

  // Logged-in user scope
  const db = readDb();
  let userProjects = getUserProjects(user.id);
  const allPublic = getPublicProjects();

  // If user is admin, allow viewing all
  if (user.role === "admin" && searchParams.get("all") === "true") {
    userProjects = db.hostedProjects || [];
  }

  if (query) {
    userProjects = userProjects.filter((p) =>
      p.projectName.toLowerCase().includes(query) ||
      p.slug.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query))
    );
  }

  return NextResponse.json({
    userProjects,
    publicCount: allPublic.length,
    userProjectCount: userProjects.length,
  });
}
