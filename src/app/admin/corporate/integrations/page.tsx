import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Integrations — Samad Expo" };

export default function CorporateIntegrationsPage() {
  const db = readDb();
  const enabledSites = db.websiteListings.filter((site) => site.analyticsEnabled === true);
  const tokenConfigured = Boolean(process.env.MD_ANALYTICS_INGEST_TOKEN);

  return (
    <main className="min-h-screen p-5 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-800">Connected platforms</p>
          <h1 className="mt-1 text-3xl font-black">Integrations</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">Each connected website keeps its own design and analytics account. This endpoint accepts page-view events from websites you explicitly enable.</p>
        </header>
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Server token</p>
            <p className="mt-2 text-lg font-black">{tokenConfigured ? "Configured" : "Not configured"}</p>
            <p className="mt-2 text-xs text-slate-500">The token value is never shown here. Set it as a server-only environment variable.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Endpoint</p>
            <code className="mt-2 block break-all text-sm font-bold">POST /api/corporate/analytics/ingest</code>
            <p className="mt-2 text-xs text-slate-500">Requires a Bearer token and a website listing with analytics enabled.</p>
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-black">Enabled websites</h2>
          {enabledSites.length ? <ul className="mt-4 divide-y divide-slate-100">{enabledSites.map((site) => <li key={site.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"><span className="font-semibold">{site.name}</span><code className="text-xs text-slate-500">{site.slug}</code></li>)}</ul> : <p className="mt-3 text-sm text-slate-500">No website listings have connected analytics enabled.</p>}
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-black">Server-side request example</h2>
          <p className="mt-2 text-sm text-slate-600">Send the request from your website’s server so the bearer token stays private. Use the website ID shown above.</p>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100"><code>{`await fetch("https://your-parent-domain/api/corporate/analytics/ingest", {
  method: "POST",
  headers: {
    "Authorization": "Bearer " + process.env.MD_ANALYTICS_INGEST_TOKEN,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    websiteSlug: "YOUR_ENABLED_WEBSITE_SLUG",
    path: "/",
    referrerHost: ""
  })
});`}</code></pre>
          <p className="mt-3 text-xs text-slate-500">Only a normalized page path and referrer hostname are stored. Visitor IDs, cookies, and full referrer URLs are not collected.</p>
        </section>
      </div>
    </main>
  );
}
