import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Activity history — Samad Expo" };

export default function CorporateActivityPage() {
  const entries = (readDb().auditLogs || []).slice(0, 100);
  return (
    <main className="min-h-screen p-5 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header><p className="text-xs font-bold uppercase tracking-widest text-emerald-800">Security & audit</p><h1 className="mt-1 text-3xl font-black">Activity history</h1><p className="mt-2 text-sm text-slate-600">Recent administrator actions recorded by the application.</p></header>
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {entries.length ? <ol className="divide-y divide-slate-100">{entries.map((entry) => <li key={entry.id} className="grid gap-2 p-4 sm:grid-cols-[180px_1fr_170px] sm:items-center"><div><p className="text-sm font-bold">{entry.userName}</p><p className="text-xs capitalize text-slate-500">{entry.userRole}</p></div><div><p className="text-sm font-semibold">{entry.action}</p><p className="text-xs text-slate-500">{entry.details}</p></div><time className="text-xs text-slate-500" dateTime={entry.timestamp}>{new Date(entry.timestamp).toLocaleString("en-IN")}</time></li>)}</ol> : <p className="p-8 text-sm text-slate-500">No administrator activity has been recorded yet.</p>}
        </section>
      </div>
    </main>
  );
}
