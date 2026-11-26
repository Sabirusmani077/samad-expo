import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";
import { FolderGit2, ArrowRight, ExternalLink, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Portfolio & Projects | Samad Expo",
  description:
    "Explore projects, web tools, and deployments built and hosted under Samad Expo.",
};

export default function PortfolioPage() {
  const db = readDb();
  const projects = (db.portfolioEntries || []).filter(
    (p) => p.status !== "archived"
  );

  return (
    <div className="bg-[#060608] min-h-screen text-white">
      <section className="samad-hero-grid border-b border-zinc-800/80 pt-10 pb-14 sm:pt-16 sm:pb-20 relative overflow-hidden">
        <ThreeHeroCanvas variant="dark" />
        <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-[#FFF33D]/15 blur-[120px]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <nav
            aria-label="Breadcrumb"
            className="text-xs text-zinc-400 flex items-center gap-2"
          >
            <Link href="/" className="hover:text-[#FFF33D] font-semibold transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#FFF33D] font-bold">Portfolio</span>
          </nav>

          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF33D]/10 border border-[#FFF33D]/30 text-xs font-bold text-[#FFF33D]">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Projects &amp; Case Studies</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              Selected Work &amp;{" "}
              <span className="samad-highlight">Deployments</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Explore web utilities, digital platforms, and hosted applications built under Samad Expo.
            </p>

            <div className="pt-2">
              <Link
                href="/websites"
                className="btn-3d-yellow inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-wider"
              >
                <span>Open Public Websites Directory</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-[#0B0B0F] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {projects.length === 0 ? (
            <Card3D intensity={5}>
              <div className="samad-card p-12 text-center space-y-4">
                <p className="text-sm font-bold text-white">
                  Detailed project write-ups are being updated.
                </p>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  You can launch and preview all live apps directly in the Public Directory.
                </p>
                <div>
                  <Link
                    href="/websites"
                    className="btn-3d-yellow inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-wider"
                  >
                    <span>Browse Live Directory</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </Card3D>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p) => (
                <Card3D key={p.id} intensity={9}>
                  <div className="samad-card overflow-hidden flex flex-col justify-between group h-full">
                    <div>
                      {p.images && p.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-full h-48 object-cover border-b border-zinc-800"
                        />
                      ) : (
                        <div className="w-full h-48 bg-[#FFF33D]/10 border-b border-zinc-800 flex items-center justify-center text-[#FFF33D] text-xs font-extrabold uppercase tracking-wider">
                          Samad Expo Project
                        </div>
                      )}

                      <div className="p-6 space-y-3">
                        <span className="text-[10px] font-extrabold text-[#FFF33D] uppercase tracking-wider block">
                          {p.category}
                        </span>
                        <h3 className="text-lg font-extrabold text-white">
                          {p.title}
                        </h3>
                        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                          {p.shortDescription || p.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                      <Link
                        href={`/portfolio/${p.slug}`}
                        className="inline-flex items-center gap-1 font-extrabold text-[#FFF33D] hover:text-white transition"
                      >
                        <span>Case Study</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>

                      {p.url && (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-zinc-300 hover:text-[#FFF33D] inline-flex items-center gap-1 transition"
                        >
                          <span>Live</span>
                          <ExternalLink className="w-3 h-3 text-[#FFF33D]" />
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
