import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";
import { ExternalLink, Globe } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Portfolio & Creations | Samad Expo",
  description:
    "Explore selected work, live digital utilities, and hosted deployments across the Samad Expo ecosystem.",
};

export default function PortfolioPage() {
  const db = readDb();
  const projects = (db.portfolioEntries || []).filter(
    (p) => p.status !== "archived"
  );

  return (
    <div className="bg-white min-h-screen text-[#1D1C1C]">
      <section className="samad-hero-grid border-b border-[#C8A464]/25 pt-14 pb-16 sm:pt-20 sm:pb-24 relative overflow-hidden text-white">
        <ThreeHeroCanvas variant="dark" className="opacity-80" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0A0C] via-[#0B0A0C]/40 to-transparent z-[1]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <nav
            aria-label="Breadcrumb"
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2"
          >
            <Link href="/" className="hover:text-[#C8A464] transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#C8A464]">Portfolio</span>
          </nav>

          <div className="space-y-4 max-w-3xl">
            <div className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#C8A464]">
              Selected Architecture &amp; Case Studies
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-[0.14em] leading-tight text-white">
              Maison <span className="samad-highlight !text-[#E5C78E]">Portfolio</span>
            </h1>

            <p className="font-editorial-serif italic text-base sm:text-xl text-zinc-300 leading-relaxed">
              Curated platforms, static cloud applications, and architectural builds hosted under Samad Expo.
            </p>

            <div className="pt-2">
              <Link
                href="/websites"
                className="btn-maison-light inline-block px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.22em]"
              >
                Explore Public Catalogue
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-[#FAF7F2] py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {projects.length === 0 ? (
            <Card3D intensity={4}>
              <div className="samad-card p-12 text-center space-y-4">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#1D1C1C]">
                  Portfolio case studies are being curated
                </p>
                <p className="font-editorial-serif italic text-sm text-[#595959] max-w-md mx-auto">
                  Inspect and launch live production web tools directly from our public catalogue.
                </p>
                <div>
                  <Link
                    href="/websites"
                    className="btn-3d-yellow inline-block px-7 py-3 text-[11px] font-bold uppercase tracking-[0.2em]"
                  >
                    Open Public Directory
                  </Link>
                </div>
              </div>
            </Card3D>
          ) : (
            <div
              className={`grid ${
                projects.length === 1
                  ? "grid-cols-1 max-w-xl mx-auto"
                  : projects.length === 2 || projects.length === 4
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              } gap-8`}
            >
              {projects.map((p) => (
                <Card3D key={p.id} intensity={5}>
                  <div className="samad-card overflow-hidden flex flex-col justify-between group h-full">
                    <div>
                      {p.images && p.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-full h-52 object-cover border-b border-[#E5DFD7]"
                        />
                      ) : (
                        <div className="w-full h-52 bg-gradient-to-b from-[#F2EAE0] to-[#E6DACB] border-b border-[#E5DFD7] flex flex-col items-center justify-center p-6">
                          <div className="w-16 h-16 bg-[#181518] border border-[#C8A464] flex items-center justify-center">
                            <Globe className="w-6 h-6 text-[#C8A464] stroke-[1.4]" />
                          </div>
                          <span className="mt-3 text-[9px] font-bold uppercase tracking-[0.26em] text-[#595959]">
                            {p.category}
                          </span>
                        </div>
                      )}

                      <div className="p-7 space-y-3 text-center">
                        <span className="text-[10px] font-bold text-[#C10016] uppercase tracking-[0.24em] block">
                          {p.category}
                        </span>
                        <h3 className="text-base font-bold uppercase tracking-[0.14em] text-[#1D1C1C]">
                          {p.title}
                        </h3>
                        <p className="font-editorial-serif text-sm text-[#595959] leading-relaxed">
                          {p.shortDescription || p.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-4 border-t border-[#E5DFD7] flex items-center justify-center gap-6">
                      <Link
                        href={`/portfolio/${p.slug}`}
                        className="font-editorial-serif italic text-sm text-[#1D1C1C] border-b border-[#1D1C1C] hover:text-[#C10016] hover:border-[#C10016] pb-0.5 transition"
                      >
                        Case Study
                      </Link>

                      {p.url && (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-editorial-serif italic text-sm text-[#1D1C1C] border-b border-[#1D1C1C] hover:text-[#C10016] hover:border-[#C10016] pb-0.5 inline-flex items-center gap-1 transition"
                        >
                          <span>Launch</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </Card3D>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
