import { NextRequest, NextResponse } from "next/server";
import { getProjectBySlug } from "@/lib/hosting";
import { getDeployedAssetPath } from "@/lib/storage";
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
      "Cache-Control": "public, max-age=3600, immutable",
    },
  });
}
