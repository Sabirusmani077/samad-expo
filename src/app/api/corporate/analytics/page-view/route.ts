import { NextRequest, NextResponse } from "next/server";
import { recordPageView, readDb } from "@/lib/db";
import { classifyTrafficSource, normalizeAnalyticsPath, normalizeReferrerHost } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const pagePath = normalizeAnalyticsPath(body?.path);
    if (!pagePath) return NextResponse.json({ error: "Invalid page path." }, { status: 400 });

    const referrerHost = normalizeReferrerHost(body?.referrerHost);
    const websiteSlug = pagePath.match(/^\/websites\/([^/]+)$/)?.[1];
    const website = websiteSlug
      ? (readDb().websiteListings || []).find((item) => item.slug === websiteSlug && item.isPublic !== false)
      : null;

    recordPageView({
      kind: "parent",
      pagePath,
      websiteId: website?.id || null,
      source: classifyTrafficSource(referrerHost, request.nextUrl.host),
      referrerHost: referrerHost === request.nextUrl.host ? null : referrerHost,
    });
    return NextResponse.json({ recorded: true }, { status: 202 });
  } catch {
    return NextResponse.json({ error: "Unable to record page view." }, { status: 400 });
  }
}
