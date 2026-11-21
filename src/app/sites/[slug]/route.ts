import { NextRequest, NextResponse } from "next/server";
import { getProjectBySlug, incrementProjectViews, ensureDefaultProjectsOnDisk } from "@/lib/hosting";
import { getDeployedAssetPath } from "@/lib/storage";
import { getCurrentUser } from "@/lib/auth";
import fs from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  ensureDefaultProjectsOnDisk();

  const project = getProjectBySlug(slug);
  if (!project) {
    return new NextResponse(
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Website Not Found - Samad Expo Hosting</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #000; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
    .box { border: 1px solid #333; padding: 40px; border-radius: 16px; background: #111; max-width: 500px; }
    h1 { color: #FFF33D; margin: 0 0 10px; font-size: 28px; }
    p { color: #888; font-size: 15px; line-height: 1.5; }
    a { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #FFF33D; color: #000; font-weight: bold; border-radius: 8px; text-decoration: none; }
  </style>
</head>
<body>
  <div class="box">
    <h1>404 &bull; Site Not Found</h1>
    <p>The deployed website "<strong>${slug}</strong>" does not exist or has been removed from Samad Expo Hosting.</p>
    <a href="/">Return to Samad Expo</a>
  </div>
</body>
</html>`,
      {
        status: 404,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }

  // Check access permissions for private projects
  if (project.visibility === "private") {
    const user = await getCurrentUser();
    if (!user || (user.id !== project.userId && user.role !== "admin")) {
      return new NextResponse(
        `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Access Restricted - Samad Expo</title>
  <style>
    body { font-family: sans-serif; background: #000; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
    .box { border: 1px solid #333; padding: 40px; border-radius: 16px; background: #111; max-width: 500px; }
    h1 { color: #ff5555; }
    a { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #FFF33D; color: #000; font-weight: bold; border-radius: 8px; text-decoration: none; }
  </style>
</head>
<body>
  <div class="box">
    <h1>Private Project</h1>
    <p>This deployment is private and only accessible to its owner.</p>
    <a href="/dashboard">Go to Dashboard</a>
  </div>
</body>
</html>`,
        {
          status: 403,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }
      );
    }
  }

  // Locate index.html
  const assetInfo = getDeployedAssetPath(project.userId, project.slug, "index.html");

  if (assetInfo.exists) {
    incrementProjectViews(project.id);
    let htmlContent = fs.readFileSync(assetInfo.fullPath, "utf8");

    // Inject base tag to correctly resolve all relative assets (CSS, JS, images)
    const baseTag = `<base href="/sites/${project.slug}/">`;
    if (!htmlContent.includes("<base ")) {
      if (htmlContent.includes("<head>")) {
        htmlContent = htmlContent.replace("<head>", `<head>\n  ${baseTag}`);
      } else if (/<head[^>]*>/i.test(htmlContent)) {
        htmlContent = htmlContent.replace(/<head[^>]*>/i, (match) => `${match}\n  ${baseTag}`);
      }
    }

    return new NextResponse(htmlContent, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=60",
      },
    });
  }

  // Fallback for preserved projects with external target URL if disk mirror is pending
  if (project.deploymentUrl && project.deploymentUrl.startsWith("http")) {
    return NextResponse.redirect(project.deploymentUrl);
  }

  return new NextResponse(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Deploying Site - Samad Expo</title>
  <style>
    body { font-family: sans-serif; background: #000; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
    .box { border: 1px solid #333; padding: 40px; border-radius: 16px; background: #111; max-width: 500px; }
    h1 { color: #FFF33D; }
  </style>
</head>
<body>
  <div class="box">
    <h1>Site Build in Progress</h1>
    <p>Files for <strong>${project.projectName}</strong> are still preparing or waiting for upload.</p>
    <p><a href="/dashboard" style="color:#FFF33D;">Manage in Dashboard &rarr;</a></p>
  </div>
</body>
</html>`,
    {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    }
  );
}
