import { NextRequest, NextResponse } from "next/server";
import { readDb, recordPageView } from "@/lib/db";
import { classifyTrafficSource, normalizeAnalyticsPath, normalizeReferrerHost } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const token = process.env.MD_ANALYTICS_INGEST_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "External analytics ingestion is not configured." }, { status: 503 });
  }
  if (request.headers.get("authorization") !== `Bearer ${token}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const slug = typeof body?.websiteSlug === "string" ? body.websiteSlug.trim().slice(0, 100) : "";
    const pagePath = normalizeAnalyticsPath(body?.path);
    if (!slug || !pagePath) return NextResponse.json({ error: "Website and page path are required." }, { status: 400 });

    const website = (readDb().websiteListings || []).find(
      (item) => item.slug === slug && item.isPublic !== false && item.analyticsEnabled === true
    );
    if (!website) return NextResponse.json({ error: "Analytics is not enabled for this website." }, { status: 404 });

    const referrerHost = normalizeReferrerHost(body?.referrerHost);
    recordPageView({
      kind: "connected_website",
      pagePath,
      websiteId: website.id,
      source: classifyTrafficSource(referrerHost, website.url ? new URL(website.url).host : undefined),
      referrerHost,
    });
    return NextResponse.json({ recorded: true }, { status: 202 });
  } catch {
    return NextResponse.json({ error: "Unable to record analytics event." }, { status: 400 });
  }
}
