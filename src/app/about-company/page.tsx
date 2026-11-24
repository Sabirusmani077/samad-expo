import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Award,
  Target,
  Compass,
  Building2,
  Globe,
  TrendingUp,
  Zap,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About Samad Expo — Parent Company Profile & Vision",
  description:
    "Discover Samad Expo, our background, founding vision, core values, corporate roadmap, and the digital ecosystem we operate.",
};

export default function AboutCompanyPage() {
  const db = readDb();
  const profile = db.companyProfile;

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-900">
      
      {/* Athenura Obsidian Hero */}
      <section className="bg-[#040D12] text-white pt-14 pb-20 sm:pt-20 sm:pb-24 border-b border-teal-900/30 relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-teal-500/10 blur-[140px]" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <nav aria-label="Breadcrumb" className="text-xs text-zinc-400 flex items-center gap-2">
            <Link href="/" className="hover:text-teal-400 transition">Home</Link>
            <span>/</span>
            <span className="text-white font-bold">About Samad Expo</span>
          </nav>

          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-teal-500/30 bg-teal-950/50 text-xs font-bold text-teal-300">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Corporate Heritage &amp; Vision</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-tight">
              The Architecture Of <span className="text-gradient-teal">Samad Expo.</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
              {profile.about || "Serving as the central digital headquarters and parent corporate brand for software applications, developer utilities, and modern web infrastructure."}
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/corporate-services"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-slate-950 hover:bg-teal-50 font-bold text-xs uppercase tracking-wider transition shadow-lg hover:scale-105 active:scale-95"
              >
                <span>Services &amp; Capabilities</span>
                <ArrowRight className="w-4 h-4 text-teal-700" />
              </Link>

              <Link
                href="/websites"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition"
              >
                <Globe className="w-4 h-4 text-teal-400" />
                <span>Explore Ecosystem</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
        
        {/* Heritage & Corporate Architecture Split */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="athenura-card p-8 sm:p-10 space-y-4 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-6 border border-teal-100">
                <Compass className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-950 tracking-tight mb-3">
                Our Story &amp; Heritage
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {profile.story || "Founded with an ambitious vision to unite software development, developer tooling, and instant web hosting under one cohesive umbrella, Samad Expo continues to pioneer modern web solutions."}
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-teal-700">
              <CheckCircle2 className="w-4 h-4" />
              <span>Independent Corporate Governance</span>
            </div>
          </div>

          <div className="athenura-card p-8 sm:p-10 space-y-4 flex flex-col justify-between bg-gradient-to-br from-slate-900 to-teal-950 text-white border-none shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-teal-300 flex items-center justify-center mb-6 border border-white/10">
                <Building2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight mb-3">
                Corporate Architecture
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Samad Expo is structured as an agile parent enterprise. Each individual website,
                application, or venture under our umbrella retains dedicated operations while benefiting
                from centralized corporate governance, shared edge technological infrastructure, and
                strategic engineering direction.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-bold text-teal-300">
              <ShieldCheck className="w-4 h-4" />
              <span>Unified Edge Deployment Network</span>
            </div>
          </div>
        </section>

        {/* Vision & Mission (Athenura Numbered Cards 01 & 02) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="athenura-card p-8 sm:p-10 space-y-4 relative overflow-hidden">
            <div className="absolute top-4 right-5 text-4xl sm:text-5xl font-black text-slate-100 select-none pointer-events-none">
              01
            </div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-teal-700 flex items-center justify-center mb-6 border border-cyan-100">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-950 tracking-tight">Our Vision</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {profile.vision || "To establish a world-class, globally accessible digital ecosystem where businesses and developers can launch, host, and scale modern web applications effortlessly."}
            </p>
          </div>

          <div className="athenura-card p-8 sm:p-10 space-y-4 relative overflow-hidden">
            <div className="absolute top-4 right-5 text-4xl sm:text-5xl font-black text-slate-100 select-none pointer-events-none">
              02
            </div>
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-6 border border-teal-100">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-950 tracking-tight">Our Mission</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {profile.mission || "To deliver high-speed hosting, robust digital products, and verified security architecture that empowers entrepreneurs and organizations to thrive in the digital economy."}
            </p>
          </div>
        </section>

        {/* Core Corporate Values */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-black text-slate-950 tracking-tight">
              Our Core <span className="text-gradient-teal">Values</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              The enduring pillars that govern our decisions across every division and digital platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(profile.coreValues && profile.coreValues.length > 0
              ? profile.coreValues
              : [
                  { title: "Innovation", description: "Pioneering zero-config deployment and automated cloud pipelines." },
                  { title: "Speed & Velocity", description: "From code to live edge distribution in under three seconds." },
                  { title: "Security First", description: "Military-grade hardening, rate limiting, and audit verification." },
                  { title: "Transparency", description: "Clear communication, dependable SLAs, and client stewardship." },
                ]
            ).map((val, idx) => (
              <div
                key={idx}
                className="athenura-card p-6 space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100/60">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-950">{val.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Future Strategic Roadmap */}
        {profile.futureRoadmap && (
          <section className="athenura-card p-8 sm:p-12 space-y-4 bg-gradient-to-b from-white to-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black text-slate-950 tracking-tight">
                Future Strategic Roadmap
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {profile.futureRoadmap}
            </p>
          </section>
        )}

      </div>
    </div>
  );
}
