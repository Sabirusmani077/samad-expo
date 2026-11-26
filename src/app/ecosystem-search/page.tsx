import Link from "next/link";
import {
  Search,
  ArrowUpRight,
  Globe,
  Building2,
  Briefcase,
  Rocket,
  LayoutDashboard,
} from "lucide-react";
import {
  EcosystemSearchItem,
  searchCorporateEcosystem,
} from "@/lib/corporate-search";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Search the Samad Expo Ecosystem",
  description: "Search Samad Expo websites, live web tools, and services.",
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
    <Card3D intensity={6} className="samad-card p-6 flex flex-col justify-between group">
      <Link href={item.href} className="flex flex-col justify-between h-full">
        <div>
          <div className="mb-3.5 flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-zinc-300">
              <span className="w-7 h-7 rounded-lg bg-[#FFF33D] text-zinc-950 flex items-center justify-center">
                <Icon className="h-3.5 w-3.5" />
              </span>
              {item.type}
            </span>
            {item.status && (
              <span className="rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                ● {item.status.replace(/_/g, " ")}
              </span>
            )}
          </div>

          <h2 className="text-lg font-extrabold text-white group-hover:text-[#FFF33D] transition-colors">
            {item.title}
          </h2>

          {item.developerName && (
            <p className="mt-1 text-xs font-semibold text-zinc-400">
              Developer:{" "}
              <span className="text-zinc-200">{item.developerName}</span>
            </p>
          )}

          <p className="mt-2.5 line-clamp-3 text-xs sm:text-sm leading-relaxed text-zinc-400">
            {item.description}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between text-xs font-bold text-zinc-500 pt-3 border-t border-zinc-800/80">
          <span>{item.category}</span>
          <span className="inline-flex items-center gap-1 text-[#FFF33D] font-extrabold">
            <span>Open</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    </Card3D>
  );
}

export default async function EcosystemSearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim().slice(0, 100);
  const results = searchCorporateEcosystem(query);

  return (
    <div className="bg-[#060608] min-h-screen text-white">
      <section className="samad-hero-grid border-b border-zinc-800/80 pt-10 pb-12 sm:pt-14 sm:pb-16 relative overflow-hidden">
        <ThreeHeroCanvas
          variant="dark"
          className="absolute inset-0 w-full h-full z-0 opacity-75"
        />
        <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-[#FFF33D]/15 blur-[120px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-zinc-400"
          >
            <Link href="/" className="hover:text-[#FFF33D] font-semibold transition">
              Home
            </Link>
            <span>/</span>
            <span className="font-bold text-[#FFF33D]">Ecosystem Search</span>
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF33D]/10 border border-[#FFF33D]/30 text-[#FFF33D] font-bold text-xs uppercase tracking-wider">
              <Search className="h-3.5 w-3.5" />
              <span>Unified Ecosystem Index</span>
            </span>

            <div className="flex items-center gap-2.5">
              <Link
                href="/websites"
                className="btn-3d-black inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs"
              >
                <Globe className="w-3.5 h-3.5 text-[#FFF33D]" />
                <span>Public Directory</span>
              </Link>
              <Link
                href="/dashboard"
                className="btn-3d-yellow inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-extrabold text-xs"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Hosting Console</span>
              </Link>
            </div>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              Search <span className="samad-highlight">Samad Expo</span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Find live web applications, practical calculators &amp; convertors, hosted static sites, and engineering services.
            </p>
          </div>

          <form
            action="/ecosystem-search"
            method="get"
            className="flex flex-col sm:flex-row gap-3 max-w-2xl pt-2"
          >
            <label className="sr-only" htmlFor="ecosystem-query">
              Search websites, tools, and services
            </label>
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#FFF33D] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                id="ecosystem-query"
                name="q"
                type="search"
                minLength={2}
                maxLength={100}
                defaultValue={query}
                placeholder="Try: calculator, convertor, hosting, solar..."
                className="w-full rounded-full border border-zinc-800 bg-zinc-900/90 pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#FFF33D] focus:ring-2 focus:ring-[#FFF33D]/25 transition"
              />
            </div>
            <button
              className="btn-3d-yellow rounded-full px-7 py-3 text-xs font-extrabold uppercase tracking-wider cursor-pointer"
              type="submit"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <div className="bg-[#0B0B0F] py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {query.length < 2 ? (
            <div className="samad-card p-12 text-center space-y-2">
              <p className="text-sm font-bold text-white">
                Enter at least 2 characters to search across all platforms.
              </p>
              <p className="text-xs text-zinc-400">
                Try keywords like &ldquo;calculator&rdquo;, &ldquo;convertor&rdquo;, &ldquo;solar&rdquo;, or &ldquo;hosting&rdquo;.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="samad-card p-12 text-center space-y-3">
              <h2 className="text-xl font-extrabold text-white">
                No matching listings found
              </h2>
              <p className="text-sm text-zinc-400 max-w-md mx-auto">
                We couldn&apos;t find assets matching &ldquo;{query}&rdquo;. Browse the full{" "}
                <Link
                  className="font-bold text-[#FFF33D] underline"
                  href="/websites"
                >
                  Public Directory
                </Link>
                .
              </p>
            </div>
          ) : (
            <section aria-live="polite" className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-zinc-300">
                  Found{" "}
                  <span className="px-2 py-0.5 rounded-full bg-[#FFF33D] text-zinc-950 font-extrabold">
                    {results.length}
                  </span>{" "}
                  result{results.length === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
                </h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((item) => (
                  <ResultCard key={`${item.type}-${item.id}`} item={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
