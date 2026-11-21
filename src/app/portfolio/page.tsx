import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { FolderGit2, ArrowRight, ExternalLink } from "lucide-react";

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
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-slate-900 font-medium">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">Portfolio & Projects</span>
        </nav>

        {/* Hero */}
        <section className="rounded-3xl border-2 border-slate-900 bg-white p-8 sm:p-12 shadow-[8px_8px_0px_#FFF33D] space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FFF33D] text-black font-extrabold font-extrabold text-xs uppercase tracking-wider border border-slate-900/20">
            <FolderGit2 className="w-3.5 h-3.5" />
            Venture Showcase
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 leading-tight max-w-3xl">
            Selected Work & Strategic Projects
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            A curated portfolio of digital platforms, web applications, and technology systems designed,
            built, and maintained by Samad Expo.
          </p>
        </section>

        {projects.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 p-12 text-center text-slate-500 bg-slate-50">
            Portfolio projects and case studies are being published. Check back soon for detailed project breakdowns.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border-2 border-slate-200 hover:border-slate-900 transition-all overflow-hidden bg-white flex flex-col justify-between"
              >
                <div>
                  {p.images && p.images[0] ? (
                    <img src={p.images[0]} alt={p.title} className="w-full h-48 object-cover border-b" />
                  ) : (
                    <div className="w-full h-48 bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                      Project Showcase
                    </div>
                  )}
                  <div className="p-6 space-y-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {p.category}
                    </span>
                    <h3 className="text-lg font-black text-slate-950">{p.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {p.shortDescription || p.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                  <Link
                    href={`/portfolio/${p.slug}`}
                    className="text-xs font-bold text-slate-900 hover:text-black hover:underline flex items-center gap-1"
                  >
                    <span>Read Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 hover:text-slate-800"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
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
