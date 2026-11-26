import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { WebsitesFilter } from "./WebsitesFilter";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";
import { Globe, ShieldCheck, Zap, LayoutDashboard, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Digital Catalogue & Live Creations | Samad Expo",
  description:
    "Explore the curated digital catalogue of Samad Expo — browser-native web utilities and live static deployments.",
};

export default function WebsitesPage() {
  const db = readDb();
  const websites = (db.websiteListings || []).filter(
    (w) =>
      w.isPublic !== false &&
      !w.slug.includes("sabir") &&
      !w.name.toLowerCase().includes("sabir")
  );
  const hostedProjects = (db.hostedProjects || []).filter(
    (p) =>
      p.visibility === "public" &&
      p.deploymentStatus === "live" &&
      !p.projectName.toLowerCase().includes("automated test platform") &&
      !p.projectName.toLowerCase().includes("sabir") &&
      !p.slug.includes("sabir")
  );

  return (
    <div className="bg-white min-h-screen text-[#1D1C1C]">
      <section className="samad-hero-grid border-b border-[#C8A464]/25 pt-14 pb-16 relative overflow-hidden text-white">
        <ThreeHeroCanvas variant="dark" className="opacity-80" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0A0C] via-[#0B0A0C]/40 to-transparent z-[1]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <nav
            aria-label="Breadcrumb"
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2"
          >
            <Link href="/" className="hover:text-[#C8A464] transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#C8A464]">Digital Catalogue</span>
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8A464]">
              <Globe className="w-3.5 h-3.5" />
              <span>Public Catalogue &amp; Live Tools</span>
            </span>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard"
                className="btn-maison-light inline-flex items-center gap-1.5 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em]"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Hosting Console</span>
              </Link>
              <Link
                href="/dashboard?action=upload"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#C10016] hover:bg-[#9E0012] text-white text-[10px] font-bold uppercase tracking-[0.2em] transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Deploy Website</span>
              </Link>
            </div>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-[0.14em] text-white leading-tight">
              Public Websites &amp;{" "}
              <span className="samad-highlight !text-[#E5C78E]">Creations</span>
            </h1>
            <p className="font-editorial-serif italic text-base sm:text-lg text-zinc-300 leading-relaxed">
              Curated utility software engineered by Samad Expo alongside live static builds deployed on our cloud network.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <Card3D intensity={4}>
              <div className="samad-card-dark p-5 h-full">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                  Hosted Sites
                </p>
                <p className="font-editorial-serif italic text-2xl text-[#C8A464] mt-1">
                  {hostedProjects.length} Live
                </p>
              </div>
            </Card3D>
            <Card3D intensity={4}>
              <div className="samad-card-dark p-5 h-full">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                  Web Platforms
                </p>
                <p className="font-editorial-serif italic text-2xl text-white mt-1">
                  {websites.length} Active
                </p>
              </div>
            </Card3D>
            <Card3D intensity={4}>
              <div className="samad-card-dark p-5 h-full">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                  Routing Speed
                </p>
                <p className="font-editorial-serif italic text-2xl text-[#C8A464] mt-1 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  <span>Instant</span>
                </p>
              </div>
            </Card3D>
            <Card3D intensity={4}>
              <div className="samad-card-dark p-5 h-full">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                  Security
                </p>
                <p className="font-editorial-serif italic text-2xl text-white mt-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#C10016]" />
                  <span>Verified</span>
                </p>
              </div>
            </Card3D>
          </div>
        </div>
      </section>

      <div className="bg-[#FAF7F2] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <WebsitesFilter websites={websites} hostedProjects={hostedProjects} />
        </div>
      </div>
    </div>
  );
}
