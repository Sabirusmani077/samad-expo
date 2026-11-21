import Link from "next/link";
import { Search, ArrowUpRight, Globe, Building2, Briefcase, Rocket, LayoutDashboard } from "lucide-react";
import { EcosystemSearchItem, searchCorporateEcosystem } from "@/lib/corporate-search";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Search the Samad Expo Ecosystem",
  description: "Search Samad Expo websites, business divisions, and services.",
};

interface Props {
  searchParams: Promise<{ q?: string }>;
}

const icons = {
  Website: Globe,
  "Business division": Building2,
  Service: Briefcase,
  "Deployed website": Rocket,
} as const;

function ResultCard({ item }: { item: EcosystemSearchItem }) {
  const Icon = icons[item.type];
  return (
    <Link
      href={item.href}
      className="group rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5 backdrop-blur-md transition-all hover:border-[#FFF33D]/40 hover:bg-zinc-900/90 hover:shadow-2xl flex flex-col justify-between"
    >
      <div>
        <div className="mb-3.5 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
            <Icon className="h-4 w-4 text-[#FFF33D]" /> {item.type}
          </span>
          {item.status && (
            <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase">
              ● {item.status.replace(/_/g, " ")}
            </span>
          )}
        </div>

        <h2 className="text-lg font-extrabold text-white group-hover:text-[#FFF33D] transition-colors">
          {item.title}
        </h2>

        {item.developerName && (
          <p className="mt-1 text-xs font-semibold text-zinc-400">
            Developer: <span className="text-zinc-200">{item.developerName}</span>
          </p>
        )}

        <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-zinc-400">
          {item.description}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between text-xs font-bold text-zinc-500 pt-3 border-t border-zinc-800/80">
        <span className="text-zinc-400">{item.category}</span>
        <span className="inline-flex items-center gap-1 text-[#FFF33D]">
          <span>View</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

export default async function EcosystemSearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim().slice(0, 100);
  const results = searchCorporateEcosystem(query);

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col lg:flex-row">
      <DashboardSidebar currentTab="search" />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-500">
            <Link href="/" className="hover:text-zinc-300 font-medium transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/dashboard" className="hover:text-zinc-300 font-medium transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="font-bold text-[#FFF33D]">Ecosystem Search</span>
          </nav>

          {/* Hero Search Section */}
          <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/90 via-zinc-900/50 to-zinc-950 p-8 sm:p-12 shadow-2xl backdrop-blur-xl space-y-6">
            <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#FFF33D]/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-24 -bottom-24 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl" />

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF33D]/10 text-[#FFF33D] font-extrabold text-xs uppercase tracking-wider border border-[#FFF33D]/20 shadow-sm">
                <Search className="h-3.5 w-3.5" />
                Unified Ecosystem Index
              </span>

              <div className="flex items-center gap-2.5">
                <Link
                  href="/websites"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 font-bold text-xs transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Public Directory</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 font-bold text-xs transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Hosting Dashboard</span>
                </Link>
              </div>
            </div>

            <div className="relative z-10 max-w-3xl space-y-3">
              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                Search the Corporate Ecosystem
              </h1>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                Find live deployed web applications, corporate subsidiaries, commercial brands, and enterprise services
                powered by Samad Expo infrastructure.
              </p>
            </div>

            <form action="/ecosystem-search" method="get" className="relative z-10 flex flex-col sm:flex-row gap-3 max-w-3xl pt-2">
              <label className="sr-only" htmlFor="ecosystem-query">
                Search websites, businesses, and services
              </label>
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="ecosystem-query"
                  name="q"
                  type="search"
                  minLength={2}
                  maxLength={100}
                  defaultValue={query}
                  placeholder="Try: solar, developer, logistics, ecommerce, corporate..."
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/95 pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#FFF33D] focus:ring-1 focus:ring-[#FFF33D] transition-colors"
                />
              </div>
              <button
                className="rounded-xl bg-[#FFF33D] px-7 py-3 text-sm font-extrabold text-black hover:bg-black hover:text-[#FFF33D] border border-black/20 transition-all shadow-md active:scale-95 cursor-pointer"
                type="submit"
              >
                Search
              </button>
            </form>
          </section>

          {/* Search Results Display */}
          {query.length < 2 ? (
            <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/40 p-12 text-center text-zinc-400 shadow-xl">
              <p className="text-3xl mb-2">⚡</p>
              <p className="text-sm font-semibold text-zinc-300">Enter at least 2 characters to search the entire ecosystem.</p>
              <p className="text-xs text-zinc-500 mt-1">Try keywords like &quot;developer&quot;, &quot;solar&quot;, &quot;tech&quot;, or &quot;services&quot;.</p>
            </div>
          ) : results.length === 0 ? (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-12 text-center text-white shadow-xl space-y-3">
              <p className="text-4xl">🔍</p>
              <h2 className="text-xl font-extrabold text-white">No matching listings found</h2>
              <p className="text-sm text-zinc-400 max-w-md mx-auto">
                We couldn&apos;t find any ecosystem assets matching &quot;{query}&quot;. Try broader terms or browse the{" "}
                <Link className="font-bold text-[#FFF33D] underline" href="/websites">
                  Public Directory
                </Link>
                .
              </p>
            </div>
          ) : (
            <section aria-live="polite" className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <h2 className="text-sm font-bold text-zinc-400">
                  Found <span className="text-[#FFF33D]">{results.length}</span> listing{results.length === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((item) => (
                  <ResultCard key={`${item.type}-${item.id}`} item={item} />
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
