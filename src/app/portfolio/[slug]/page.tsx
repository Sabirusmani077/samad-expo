import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readDb } from "@/lib/db";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";
import { ArrowLeft, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const db = readDb();
  const project = db.portfolioEntries?.find(
    (p) => p.slug === slug || p.id === slug
  );
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} — Samad Expo Portfolio`,
    description: project.shortDescription || project.description,
  };
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { slug } = await params;
  const db = readDb();
  const project = db.portfolioEntries?.find(
    (p) => p.slug === slug || p.id === slug
  );

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#1D1C1C]">
      <section className="samad-hero-grid border-b border-[#C8A464]/25 pt-14 pb-16 relative overflow-hidden text-white">
        <ThreeHeroCanvas variant="dark" className="opacity-75" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-5">
          <nav
            aria-label="Breadcrumb"
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2"
          >
            <Link href="/" className="hover:text-[#C8A464] transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/portfolio" className="hover:text-[#C8A464] transition">
              Portfolio
            </Link>
            <span>/</span>
            <span className="text-[#C8A464]">{project.title}</span>
          </nav>

          <span className="inline-block px-3.5 py-1 bg-[#C10016] text-white font-bold text-[10px] uppercase tracking-[0.22em]">
            {project.category}
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-[0.12em] text-white leading-tight">
            {project.title}
          </h1>
          <p className="font-editorial-serif italic text-base sm:text-xl text-zinc-300 leading-relaxed">
            {project.shortDescription}
          </p>

          {project.url && (
            <div className="pt-2">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-maison-light inline-flex items-center gap-2 px-7 py-3 text-[11px] font-bold uppercase tracking-[0.22em]"
              >
                <span>Open Creation Live</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
        {project.images && project.images.length > 0 && (
          <div className="space-y-4">
            {project.images.map((img, idx) => (
              <Card3D key={idx} intensity={4}>
                <div className="samad-card overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`${project.title} visual ${idx + 1}`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </Card3D>
            ))}
          </div>
        )}

        <Card3D intensity={3}>
          <div className="samad-card p-8 sm:p-10 space-y-4 border-t-2 border-t-[#C10016]">
            <h2 className="text-base font-bold uppercase tracking-[0.18em] text-[#1D1C1C]">
              Architecture &amp; Overview
            </h2>
            <div className="font-editorial-serif text-base text-[#595959] leading-relaxed whitespace-pre-line">
              {project.description || project.shortDescription}
            </div>
          </div>
        </Card3D>

        {project.tags && project.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#767676]">
              Technologies:
            </span>
            {project.tags.map((tag, i) => (
              <span
                key={i}
                className="text-[10px] font-bold uppercase tracking-wider border border-[#E5DFD7] bg-white px-3 py-1 text-[#1D1C1C]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-[#E5DFD7]">
          <Link
            href="/portfolio"
            className="font-editorial-serif italic text-base text-[#C10016] inline-flex items-center gap-2 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portfolio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
