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
    <div className="bg-[#060608] samad-hero-grid min-h-screen py-12 text-white relative overflow-hidden">
      <ThreeHeroCanvas variant="dark" />
      <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-[#FFF33D]/15 blur-[120px]" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-zinc-400 flex items-center gap-2"
        >
          <Link href="/" className="hover:text-[#FFF33D] font-medium transition">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/portfolio"
            className="hover:text-[#FFF33D] font-medium transition"
          >
            Portfolio
          </Link>
          <span>/</span>
          <span className="text-[#FFF33D] font-bold">{project.title}</span>
        </nav>

        <section className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-[#FFF33D] text-black font-extrabold text-xs uppercase tracking-wider">
            {project.category}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            {project.title}
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            {project.shortDescription}
          </p>

          {project.url && (
            <div>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-3d-yellow inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs uppercase tracking-wider"
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
              <Card3D key={idx} intensity={5}>
                <div className="samad-card overflow-hidden border-[#FFF33D]/35">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`${project.title} screenshot ${idx + 1}`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </Card3D>
            ))}
          </div>
        )}

        <Card3D intensity={4}>
          <div className="samad-card p-8 space-y-4 border-t-4 border-t-[#FFF33D]">
            <h2 className="text-xl font-black text-[#FFF33D]">
              Project Architecture &amp; Overview
            </h2>
            <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
              {project.description || project.shortDescription}
            </div>
          </div>
        </Card3D>

        {project.tags && project.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-2">
            <span className="text-xs font-bold text-zinc-400">
              Technologies &amp; Tags:
            </span>
            {project.tags.map((tag, i) => (
              <span
                key={i}
                className="text-xs bg-[#18181F] border border-zinc-800 px-2.5 py-1 rounded-lg text-[#FFF33D] font-semibold"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-zinc-800">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#FFF33D] hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portfolio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
