import { readDb } from "@/lib/db";
import { AdminPieCharts } from "@/components/admin/AdminPieCharts";

export const dynamic = "force-dynamic";
export const metadata = { title: "Analytics & Reports — Samad Expo" };

function Metric({ label, value, note }: { label: string; value: string | number; note?: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-2xl font-black">{value}</div><div className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-600">{label}</div>{note && <p className="mt-2 text-xs text-slate-500">{note}</p>}</div>;
}

export default function CorporateAnalyticsPage() {
  const db = readDb();
  const events = db.pageViewEvents || [];
  const parent = events.filter((event) => event.kind === "parent");
  const external = events.filter((event) => event.kind === "connected_website");
  const recent = parent.filter((event) => Date.now() - new Date(event.createdAt).getTime() <= 30 * 24 * 60 * 60 * 1000);
  const viewsByPath = parent.reduce<Record<string, number>>((counts, event) => {
    counts[event.pagePath] = (counts[event.pagePath] || 0) + 1;
    return counts;
  }, {});
  const sources = recent.reduce<Record<string, number>>((counts, event) => {
    counts[event.source] = (counts[event.source] || 0) + 1;
    return counts;
  }, {});
  const connected = (db.websiteListings || []).filter((site) => site.analyticsEnabled === true);
  const popularWebsites = parent.reduce<Record<string, number>>((counts, event) => {
    if (event.websiteId) counts[event.websiteId] = (counts[event.websiteId] || 0) + 1;
    return counts;
  }, {});
  const popularBlog = parent.reduce<Record<string, number>>((counts, event) => {
    const slug = event.pagePath.match(/^\/blog\/([^/]+)$/)?.[1];
    if (slug) counts[slug] = (counts[slug] || 0) + 1;
    return counts;
  }, {});

  return (
    <main className="min-h-screen p-5 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <header><p className="text-xs font-bold uppercase tracking-widest text-emerald-800">Central reporting</p><h1 className="mt-1 text-3xl font-black">Analytics & reports</h1><p className="mt-2 max-w-3xl text-sm text-slate-600">Parent-site page views are collected without visitor IDs or full referrer URLs. Connected website data appears only after a site sends events through the integration endpoint.</p></header>

        <section aria-label="Analytics summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Registered websites" value={db.websiteListings.length} />
          <Metric label="Live websites" value={db.websiteListings.filter((site) => site.status === "live").length} />
          <Metric label="Upcoming websites" value={db.websiteListings.filter((site) => site.status === "coming_soon").length} />
          <Metric label="Business divisions" value={db.businessDivisions.length} />
          <Metric label="Published articles" value={db.blogPosts.length} />
          <Metric label="Active services" value={db.corporateServices.filter((service) => service.status === "active").length} />
          <Metric label="Corporate inquiries" value={db.corporateInquiries.length} />
          <Metric label="Parent website page views" value={parent.length} note={parent.length ? "Recorded by this site" : "Awaiting real traffic"} />
          <Metric label="Parent views, last 30 days" value={recent.length} note="Page views; unique visitors are not collected" />
          <Metric label="Connected websites" value={connected.length} note={process.env.MD_ANALYTICS_INGEST_TOKEN ? "Ingestion endpoint configured" : "Set MD_ANALYTICS_INGEST_TOKEN to accept external events"} />
          <Metric label="Connected website views" value={external.length} note={external.length ? "Received through the integration endpoint" : "No connected events received"} />
        </section>

        {/* Visual Pie Charts Section */}
        <AdminPieCharts
          userStats={{
            developers: (db.users || []).filter((u) => u.role !== "admin" && u.role !== "vendor").length,
            vendors: (db.users || []).filter((u) => u.role === "vendor").length,
            admins: (db.users || []).filter((u) => u.role === "admin").length,
            total: (db.users || []).length,
          }}
          hostingStats={{
            live: (db.hostedProjects || []).filter((p) => p.deploymentStatus === "live").length,
            building: (db.hostedProjects || []).filter((p) => p.deploymentStatus === "building").length,
            draft: (db.hostedProjects || []).filter((p) => p.deploymentStatus === "pending" || p.deploymentStatus === "failed").length,
            total: (db.hostedProjects || []).length,
          }}
          divisionStats={{
            items: (db.businessDivisions || []).map((d, idx) => ({
              name: d.name,
              count: (db.websiteListings || []).filter((w) => w.businessDivisionId === d.id).length || 1,
              color: ["#EAB308", "#06B6D4", "#10B981", "#EC4899", "#8B5CF6", "#F97316"][idx % 6],
            })),
            total: (db.businessDivisions || []).length,
          }}
          inquiryStats={{
            newCount: (db.corporateInquiries || []).filter((i) => i.status === "new").length,
            inProgress: (db.corporateInquiries || []).filter((i) => i.status === "in_progress").length,
            resolved: (db.corporateInquiries || []).filter((i) => i.status === "resolved").length,
            total: (db.corporateInquiries || []).length,
          }}
        />

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-black">Popular parent-site pages</h2>
            {Object.keys(viewsByPath).length ? <ol className="mt-4 space-y-3">{Object.entries(viewsByPath).sort((a,b) => b[1]-a[1]).slice(0,10).map(([path,count]) => <li key={path} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-2 text-sm"><code className="truncate text-slate-600">{path}</code><strong>{count}</strong></li>)}</ol> : <p className="mt-4 text-sm text-slate-500">Page-view data will appear after visitors browse the site.</p>}
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-black">Traffic sources, last 30 days</h2>
            {Object.keys(sources).length ? <ul className="mt-4 space-y-3">{Object.entries(sources).sort((a,b) => b[1]-a[1]).map(([source,count]) => <li key={source} className="flex items-center justify-between border-b border-slate-100 pb-2 text-sm"><span className="capitalize text-slate-600">{source}</span><strong>{count}</strong></li>)}</ul> : <p className="mt-4 text-sm text-slate-500">No traffic-source data recorded yet.</p>}
            <p className="mt-4 text-xs text-slate-500">Unique visitors and demographic details are not tracked.</p>
          </section>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-black">Popular website profiles</h2>
            {Object.keys(popularWebsites).length ? <ol className="mt-4 space-y-3">{Object.entries(popularWebsites).sort((a,b) => b[1]-a[1]).slice(0,10).map(([id,count]) => <li key={id} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-2 text-sm"><span className="truncate text-slate-600">{db.websiteListings.find((site) => site.id === id)?.name || "Website listing"}</span><strong>{count}</strong></li>)}</ol> : <p className="mt-4 text-sm text-slate-500">Profile visits will appear as visitors browse website profile pages.</p>}
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-black">Popular articles & publications</h2>
            {Object.keys(popularBlog).length ? <ol className="mt-4 space-y-3">{Object.entries(popularBlog).sort((a,b) => b[1]-a[1]).slice(0,10).map(([slug,count]) => <li key={slug} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-2 text-sm"><span className="truncate text-slate-600">{db.blogPosts.find((b) => b.slug === slug)?.title || slug}</span><strong>{count}</strong></li>)}</ol> : <p className="mt-4 text-sm text-slate-500">Article views will appear as visitors read news & publications.</p>}
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-black">Service interest</h2>
            <p className="mt-4 text-sm text-slate-500">Service-level view counts are not collected yet. This area does not estimate demand from page visits.</p>
          </section>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-black">Individual website analytics</h2>
          <p className="mt-1 text-xs text-slate-500">Profile-page interest and an independent website’s own traffic are separate metrics.</p>
          {connected.length ? <div className="mt-4 divide-y divide-slate-100">{connected.map((site) => { const count = external.filter((event) => event.websiteId === site.id).length; return <div key={site.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"><span className="font-semibold">{site.name}</span><span className="text-slate-500">{process.env.MD_ANALYTICS_INGEST_TOKEN ? count ? `${count} received page views` : "Configured; awaiting data" : "Not configured"}</span></div>; })}</div> : <p className="mt-4 text-sm text-slate-500">No independent websites have analytics integration enabled.</p>}
        </section>
      </div>
    </main>
  );
}
