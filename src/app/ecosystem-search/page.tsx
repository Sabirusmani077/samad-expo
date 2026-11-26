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
  title: "Ecosystem Index & Search | Samad Expo",
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
    <Card3D intensity={5}>
      <div className="samad-card p-6 h-full flex flex-col justify-between group border-t-2 border-t-[#C10016]">
        <Link href={item.href} className="flex flex-col justify-between h-full">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#595959]">
                <span className="w-7 h-7 bg-[#1D1C1C] text-[#C8A464] flex items-center justify-center">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                {item.type}
              </span>
              {item.status && (
                <span className="border border-[#C8A464]/50 bg-white text-[#C10016] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                  {item.status.replace(/_/g, " ")}
                </span>
              )}
            </div>

            <h2 className="text-base font-bold uppercase tracking-[0.12em] text-[#1D1C1C] group-hover:text-[#C10016] transition-colors">
              {item.title}
            </h2>

            <p className="mt-2.5 font-editorial-serif text-sm leading-relaxed text-[#595959]">
              {item.description}
            </p>
          </div>

          <div className="mt-5 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-[#767676] pt-3 border-t border-[#E5DFD7]">
            <span>{item.category}</span>
            <span className="inline-flex items-center gap-1 text-[#C10016]">
              <span>Explore</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </Link>
      </div>
    </Card3D>
  );
}

export default async function EcosystemSearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim().slice(0, 100);
  const results = searchCorporateEcosystem(query).filter(
    (item) =>
      !item.title.toLowerCase().includes("sabir") &&
      !item.href.toLowerCase().includes("sabir")
  );

  return (
    <div className="bg-white min-h-screen text-[#1D1C1C]">
      <section className="samad-hero-grid border-b border-[#C8A464]/25 pt-14 pb-16 relative overflow-hidden text-white">
        <ThreeHeroCanvas variant="dark" className="opacity-80" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0A0C] via-[#0B0A0C]/40 to-transparent z-[1]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400"
          >
            <Link href="/" className="hover:text-[#C8A464] transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#C8A464]">Ecosystem Index</span>
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8A464]">
              <Search className="h-3.5 w-3.5" />
              <span>Unified Ecosystem Search</span>
            </span>

            <div className="flex items-center gap-3">
              <Link
                href="/websites"
                className="btn-maison-light inline-flex items-center gap-1.5 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em]"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Public Catalogue</span>
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#C10016] hover:bg-[#9E0012] text-white text-[10px] font-bold uppercase tracking-[0.2em] transition"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Hosting Console</span>
              </Link>
            </div>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-[0.14em] text-white leading-tight">
              Search <span className="samad-highlight !text-[#E5C78E]">Samad Expo</span>
            </h1>
            <p className="font-editorial-serif italic text-base sm:text-lg text-zinc-300 leading-relaxed">
              Locate live utilities, calculators, converters, static cloud builds, and engineering capabilities.
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
              <Search className="w-4 h-4 text-[#C8A464] absolute left-1 top-1/2 -translate-y-1/2" />
              <input
                id="ecosystem-query"
                name="q"
                type="search"
                minLength={2}
                maxLength={100}
                defaultValue={query}
                placeholder="Try: calculator, convertor, hosting, solar..."
                className="w-full border-b border-white/40 bg-transparent pl-7 pr-4 py-2.5 font-editorial-serif italic text-base text-white placeholder:text-zinc-500 outline-none focus:border-[#C8A464] transition"
              />
            </div>
            <button
              className="px-7 py-3 bg-[#C10016] hover:bg-white hover:text-[#1D1C1C] text-white text-[11px] font-bold uppercase tracking-[0.2em] cursor-pointer transition"
              type="submit"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <div className="bg-[#FAF7F2] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {query.length < 2 ? (
            <div className="samad-card p-12 text-center space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1D1C1C]">
                Enter at least 2 characters to search the directory
              </p>
              <p className="font-editorial-serif italic text-sm text-[#595959]">
                Keywords: &ldquo;calculator&rdquo;, &ldquo;convertor&rdquo;, &ldquo;solar&rdquo;, or &ldquo;hosting&rdquo;.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="samad-card p-12 text-center space-y-3">
              <h2 className="text-base font-bold uppercase tracking-[0.18em] text-[#1D1C1C]">
                No matching records
              </h2>
              <p className="font-editorial-serif italic text-sm text-[#595959] max-w-md mx-auto">
                No creations matched &ldquo;{query}&rdquo;. Browse our complete{" "}
                <Link
                  className="text-[#C10016] border-b border-[#C10016]"
                  href="/websites"
                >
                  Public Catalogue
                </Link>
                .
              </p>
            </div>
          ) : (
            <section aria-live="polite" className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-3">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#595959]">
                  Found{" "}
                  <span className="px-2 py-0.5 bg-[#1D1C1C] text-white font-bold">
                    {results.length}
                  </span>{" "}
                  matching record{results.length === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
                </h2>
              </div>
              <div
                className={`grid gap-6 ${
                  results.length === 1
                    ? "grid-cols-1 max-w-xl"
                    : results.length === 2 || results.length === 4
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                }`}
              >
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
