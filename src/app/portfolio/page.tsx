import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { FolderGit2, ArrowRight, ExternalLink, Globe, Sparkles, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Portfolio & Projects | Samad Expo",
  description:
    "Explore key projects, digital ventures, and case studies developed and launched under Samad Expo.",
};

export default function PortfolioPage() {
  const db = readDb();
  const projects = (db.portfolioEntries || []).filter((p) => p.status !== "archived");

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-900">
      
      {/* Athenura Obsidian Hero */}
      <section className="bg-[#040D12] text-white pt-14 pb-20 sm:pt-20 sm:pb-24 border-b border-teal-900/30 relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-teal-500/10 blur-[140px]" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <nav aria-label="Breadcrumb" className="text-xs text-zinc-400 flex items-center gap-2">
            <Link href="/" className="hover:text-teal-400 transition">Home</Link>
            <span>/</span>
            <span className="text-white font-bold">Portfolio &amp; Projects</span>
          </nav>

          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-teal-500/30 bg-teal-950/50 text-xs font-bold text-teal-300">
              <FolderGit2 className="w-3.5 h-3.5 text-teal-400" />
              <span>Selected Work &amp; Case Studies</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-tight">
              Real Projects. <span className="text-gradient-teal">Real Results.</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
              A curated portfolio of digital platforms, web applications, and developer utilities engineered and hosted on Samad Expo edge infrastructure.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/websites"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-slate-950 hover:bg-teal-50 font-bold text-xs uppercase tracking-wider transition shadow-lg hover:scale-105 active:scale-95"
              >
                <span>Browse All Live Directory Sites</span>
                <ArrowRight className="w-4 h-4 text-teal-700" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-12">
        {projects.length === 0 ? (
          <div className="athenura-card p-12 text-center text-slate-500 space-y-4">
            <p className="text-sm font-semibold text-slate-700">Detailed case studies are currently being published.</p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              You can explore our active platforms directly in the Public Websites Directory.
            </p>
            <div>
              <Link
                href="/websites"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-950 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider transition"
              >
                <span>Open Websites Directory</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((p) => (
              <div
                key={p.id}
                className="athenura-card overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {p.images && p.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0]} alt={p.title} className="w-full h-48 object-cover border-b border-slate-100" />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-tr from-slate-900 to-teal-950 flex items-center justify-center text-teal-300 text-xs font-bold uppercase tracking-wider">
                      Samad Expo Project
                    </div>
                  )}

                  <div className="p-6 space-y-3">
                    <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider block">
                      {p.category}
                    </span>
                    <h3 className="text-lg font-bold text-slate-950 group-hover:text-teal-700 transition leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {p.shortDescription || p.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                  <Link
                    href={`/portfolio/${p.slug}`}
                    className="inline-flex items-center gap-1 font-bold text-teal-700 hover:text-teal-900 transition"
                  >
                    <span>Read Case Study</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1"
                    >
                      <span>Live Site</span>
                      <ExternalLink className="w-3 h-3 text-teal-600" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
