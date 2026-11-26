import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { WebsitesFilter } from "./WebsitesFilter";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";
import { Globe, ShieldCheck, Zap, LayoutDashboard, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Public Directory & Live Tools | Samad Expo",
  description:
    "Explore the complete public directory of Samad Expo — live web applications, practical utility tools, and user-hosted websites.",
};

export default function WebsitesPage() {
  const db = readDb();
  const websites = (db.websiteListings || []).filter(
    (w) => w.isPublic !== false
  );
  const hostedProjects = (db.hostedProjects || []).filter(
    (p) =>
      p.visibility === "public" &&
      p.deploymentStatus === "live" &&
      !p.projectName.toLowerCase().includes("automated test platform")
  );

  return (
    <div className="bg-[#060608] min-h-screen text-white">
      {/* 3D Obsidian & Yellow Hero */}
      <section className="samad-hero-grid border-b border-zinc-800/80 pt-10 pb-12 sm:pt-14 sm:pb-16 relative overflow-hidden">
        <ThreeHeroCanvas
          variant="dark"
          className="absolute inset-0 w-full h-full z-0 opacity-75"
        />
        <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-[#FFF33D]/15 blur-[120px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <nav
            aria-label="Breadcrumb"
            className="text-xs text-zinc-400 flex items-center gap-2"
          >
            <Link href="/" className="hover:text-[#FFF33D] font-semibold transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#FFF33D] font-bold">Public Directory</span>
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF33D]/10 border border-[#FFF33D]/30 text-[#FFF33D] font-bold text-xs uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5" />
              <span>Public Directory &amp; Tools</span>
            </span>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/dashboard"
                className="btn-3d-black inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#FFF33D]" />
                <span>Hosting Console</span>
              </Link>
              <Link
                href="/dashboard?action=upload"
                className="btn-3d-yellow inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-extrabold text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Deploy Website</span>
              </Link>
            </div>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              Public Websites &amp;{" "}
              <span className="samad-highlight">Live Tools</span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Browse practical web utilities engineered by Samad Expo and live static websites hosted on our cloud engine.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-4">
            <Card3D intensity={5} className="samad-card p-4">
              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Hosted Sites
              </p>
              <p className="text-xl font-black text-[#FFF33D] mt-0.5">
                {hostedProjects.length} Live
              </p>
            </Card3D>
            <Card3D intensity={5} className="samad-card p-4">
              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Web Platforms
              </p>
              <p className="text-xl font-black text-white mt-0.5">
                {websites.length} Active
              </p>
            </Card3D>
            <Card3D intensity={5} className="samad-card p-4">
              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Routing Speed
              </p>
              <p className="text-xl font-black text-[#FFF33D] mt-0.5 flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                <span>Instant</span>
              </p>
            </Card3D>
            <Card3D intensity={5} className="samad-card p-4">
              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Security
              </p>
              <p className="text-xl font-black text-emerald-400 mt-0.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified</span>
              </p>
            </Card3D>
          </div>
        </div>
      </section>

      <div className="bg-[#0B0B0F] py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <WebsitesFilter websites={websites} hostedProjects={hostedProjects} />
        </div>
      </div>
    </div>
  );
}
