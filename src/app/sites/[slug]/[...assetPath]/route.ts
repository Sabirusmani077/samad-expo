import { NextRequest, NextResponse } from "next/server";
import { getProjectBySlug } from "@/lib/hosting";
import { getDeployedAssetPath } from "@/lib/storage";
import { getCurrentUser } from "@/lib/auth";
import fs from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; assetPath: string[] }> }
) {
  const { slug, assetPath } = await params;
  const project = getProjectBySlug(slug);
  if (!project) {
    return new NextResponse("Project not found", { status: 404 });
  }

  // Enforce access control for private project assets
  if (project.visibility === "private") {
    const user = await getCurrentUser();
    if (!user || (user.id !== project.userId && user.role !== "admin")) {
      return new NextResponse("Access Restricted: Private deployment asset.", {
        status: 403,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }
  }

  const relativeAsset = assetPath.join("/");
  const assetInfo = getDeployedAssetPath(project.userId, project.slug, relativeAsset);

  if (!assetInfo.exists) {
    return new NextResponse(`Asset not found: ${relativeAsset}`, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(assetInfo.fullPath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": assetInfo.mimeType,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": project.visibility === "private" ? "private, no-cache" : "public, max-age=3600, immutable",
    },
  });
}
