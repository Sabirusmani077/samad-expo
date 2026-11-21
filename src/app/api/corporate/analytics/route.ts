import { NextResponse } from "next/server";
import { requireCorporateAdmin } from "@/lib/corporate-admin-api";
import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireCorporateAdmin();
  if (denied) return denied;
  const db = readDb();
  const events = db.pageViewEvents || [];
  const last30Days = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const parentEvents = events.filter((event) => event.kind === "parent");
  const connectedEvents = events.filter((event) => event.kind === "connected_website");
  const recentParentEvents = parentEvents.filter((event) => new Date(event.createdAt).getTime() >= last30Days);
  const countBy = (items: typeof events, key: (event: (typeof events)[number]) => string) => {
    const counts = new Map<string, number>();
    for (const event of items) {
      const value = key(event);
      counts.set(value, (counts.get(value) || 0) + 1);
    }
    return [...counts.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
  };

  return NextResponse.json({
    totalWebsites: db.websiteListings?.length || 0,
    activeWebsites: db.websiteListings?.filter(w => w.status === "live").length || 0,
    upcomingWebsites: db.websiteListings?.filter(w => w.status === "coming_soon").length || 0,
    totalBusinessDivisions: db.businessDivisions?.length || 0,
    totalServices: db.corporateServices?.length || 0,
    totalPortfolioEntries: db.portfolioEntries?.length || 0,
    totalBlogPosts: db.blogPosts?.filter(b => b.status === "published").length || 0,
    totalJobListings: db.jobListings?.filter(j => j.status === "open").length || 0,
    totalPartnerships: db.partnerships?.filter(p => p.status === "active").length || 0,
    totalCorporateInquiries: db.corporateInquiries?.length || 0,
    newCorporateInquiries: db.corporateInquiries?.filter(i => i.status === "new").length || 0,
    // Store analytics
    totalProducts: db.products?.length || 0,
    totalOrders: db.orders?.length || 0,
    totalVendors: db.vendors?.length || 0,
    totalStoreInquiries: db.inquiries?.length || 0,
    mainWebsiteAnalytics: {
      status: parentEvents.length ? "available" : "awaiting_data",
      totalPageViews: parentEvents.length,
      pageViewsLast30Days: recentParentEvents.length,
      popularPages: countBy(parentEvents, (event) => event.pagePath).slice(0, 10),
      trafficSourcesLast30Days: countBy(recentParentEvents, (event) => event.source),
      popularWebsiteProfiles: countBy(
        parentEvents.filter((event) => event.websiteId),
        (event) => event.websiteId || ""
      ).slice(0, 10).map((row) => ({
        ...row,
        name: db.websiteListings?.find((site) => site.id === row.label)?.name || "Unknown website",
      })),
      uniqueVisitors: { status: "not_collected", reason: "No visitor identifiers are stored." },
    },
    connectedWebsiteAnalytics: {
      ingestionConfigured: Boolean(process.env.MD_ANALYTICS_INGEST_TOKEN),
      properties: (db.websiteListings || [])
        .filter((site) => site.analyticsEnabled === true)
        .map((site) => {
          const views = connectedEvents.filter((event) => event.websiteId === site.id);
          return {
            websiteId: site.id,
            name: site.name,
            status: views.length ? "available" : process.env.MD_ANALYTICS_INGEST_TOKEN ? "awaiting_data" : "not_configured",
            totalPageViews: views.length,
            popularPages: countBy(views, (event) => event.pagePath).slice(0, 5),
            trafficSources: countBy(views, (event) => event.source),
          };
        }),
    },
  });
}
