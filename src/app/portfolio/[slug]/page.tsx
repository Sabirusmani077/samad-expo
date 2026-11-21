import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readDb } from "@/lib/db";
import { ArrowLeft, ExternalLink, Calendar, Tag } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const db = readDb();
  const project = db.portfolioEntries?.find((p) => p.slug === slug || p.id === slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} — Samad Expo Portfolio`,
    description: project.shortDescription || project.description,
  };
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { slug } = await params;
  const db = readDb();
  const project = db.portfolioEntries?.find((p) => p.slug === slug || p.id === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-slate-900 font-medium">
            Home
          </Link>
          <span>/</span>
          <Link href="/portfolio" className="hover:text-slate-900 font-medium">
            Portfolio
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">{project.title}</span>
        </nav>

        <section className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-md bg-[#FFF33D] text-black font-extrabold font-extrabold text-xs uppercase tracking-wider border border-slate-900/20">
            {project.category}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 leading-tight">
            {project.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {project.shortDescription}
          </p>

          {project.url && (
            <div>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                <span>Visit Project Live</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </section>

        {project.images && project.images.length > 0 && (
          <div className="space-y-4">
            {project.images.map((img, idx) => (
              <div key={idx} className="rounded-2xl border-2 border-slate-900 overflow-hidden shadow-[6px_6px_0px_#FFF33D]">
                <img src={img} alt={`${project.title} screenshot ${idx + 1}`} className="w-full h-auto object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="rounded-3xl border border-slate-200 p-8 space-y-4">
          <h2 className="text-xl font-black text-slate-950">Project Architecture & Overview</h2>
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {project.description || project.shortDescription}
          </div>
        </div>

        {project.tags && project.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-2">
            <span className="text-xs font-bold text-slate-400">Technologies & Tags:</span>
            {project.tags.map((tag, i) => (
              <span key={i} className="text-xs bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
