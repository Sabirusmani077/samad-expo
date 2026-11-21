import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { WebsitesFilter } from "./WebsitesFilter";
import { Globe, ShieldCheck, Zap, LayoutDashboard, Plus } from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Public Directory & Digital Ecosystem | Samad Expo",
  description:
    "Explore the complete public website directory of Samad Expo — including deployed web applications, corporate portals, and developer platforms.",
};

export default function WebsitesPage() {
  const db = readDb();
  const websites = (db.websiteListings || []).filter((w) => w.isPublic !== false);
  const hostedProjects = (db.hostedProjects || []).filter(
    (p) => p.visibility === "public" && p.deploymentStatus === "live"
  );

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col lg:flex-row">
      <DashboardSidebar currentTab="websites" />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="text-xs text-zinc-500 flex items-center gap-2">
            <Link href="/" className="hover:text-zinc-300 font-medium transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/dashboard" className="hover:text-zinc-300 font-medium transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-[#FFF33D] font-bold">Public Directory</span>
          </nav>

          {/* Hero Section with Dashboard Aesthetic */}
          <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/90 via-zinc-900/50 to-zinc-950 p-8 sm:p-12 shadow-2xl backdrop-blur-xl space-y-6">
            <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#FFF33D]/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-24 -bottom-24 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl" />

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF33D]/10 text-[#FFF33D] font-extrabold text-xs uppercase tracking-wider border border-[#FFF33D]/20 shadow-sm">
                <Globe className="w-3.5 h-3.5" />
                Public Ecosystem Directory
              </span>

              <div className="flex items-center gap-2.5">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 font-bold text-xs transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Hosting Dashboard</span>
                </Link>
                <Link
                  href="/dashboard?action=upload"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFF33D] text-black font-extrabold text-xs border border-black/20 hover:bg-black hover:text-[#FFF33D] transition-all shadow-md active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Deploy New Website</span>
                </Link>
              </div>
            </div>

            <div className="relative z-10 max-w-3xl space-y-3">
              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                Public Websites &amp; Apps Directory
              </h1>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                Explore the verified digital gateway for Samad Expo portfolio websites, commercial portals,
                and live developer deployments. Every project runs with high-performance routing, isolated preview
                environments, and instant global access.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-zinc-800/80">
              <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Live Deployments</p>
                <p className="text-xl font-extrabold text-white mt-0.5">{hostedProjects.length} Active</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Corporate Portals</p>
                <p className="text-xl font-extrabold text-white mt-0.5">{websites.length} Platforms</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Hosting Speed</p>
                <p className="text-xl font-extrabold text-emerald-400 mt-0.5 flex items-center gap-1">
                  <Zap className="w-4 h-4" /> Global CDN
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Platform Security</p>
                <p className="text-xl font-extrabold text-amber-300 mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> SSL Encrypted
                </p>
              </div>
            </div>
          </section>

          {/* Directory Listing with Filters */}
          <section className="space-y-6">
            <WebsitesFilter websites={websites} hostedProjects={hostedProjects} />
          </section>
        </main>
      </div>
    </div>
  );
}
