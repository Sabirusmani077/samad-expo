import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";
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
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About Samad Expo — Company Profile & Vision",
  description:
    "Discover Samad Expo, our story from Bodla, Agra, founding vision, core values, corporate roadmap, and digital ecosystem.",
};

export default function AboutCompanyPage() {
  const db = readDb();
  const profile = db.companyProfile;

  return (
    <div className="bg-[#060608] min-h-screen text-white">
      {/* 3D Yellow & Black Editorial Hero */}
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
            <span className="text-[#FFF33D] font-bold">About Samad Expo</span>
          </nav>

          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF33D]/10 border border-[#FFF33D]/30 text-xs font-bold text-[#FFF33D]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Corporate Profile &amp; Vision</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              About <span className="samad-highlight">{profile.businessName}</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              {profile.about}
            </p>

            <div className="pt-2 flex flex-wrap gap-3.5">
              <Link
                href="/corporate-services"
                className="btn-3d-yellow inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-wider"
              >
                <span>Our Services</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/websites"
                className="btn-3d-black inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-wider"
              >
                <Globe className="w-4 h-4 text-[#FFF33D]" />
                <span>Explore Live Tools</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-[#0B0B0F] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {/* Heritage & Architecture */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            <Card3D intensity={8}>
              <div className="samad-card p-8 space-y-4 flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF33D] text-black flex items-center justify-center mb-5 shadow-md shadow-[#FFF33D]/20">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight mb-3">
                    Our Story &amp; Heritage
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                    {profile.story}
                  </p>
                </div>
                <div className="pt-4 border-t border-zinc-800 flex items-center gap-2 text-xs font-bold text-[#FFF33D]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    Founded {profile.founded || "2024"} &middot;{" "}
                    {profile.headquarters || "Agra, India"}
                  </span>
                </div>
              </div>
            </Card3D>

            <Card3D intensity={8}>
              <div className="samad-card p-8 space-y-4 flex flex-col justify-between h-full border-[#FFF33D]/30">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF33D] text-black flex items-center justify-center mb-5 shadow-md shadow-[#FFF33D]/20">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight mb-3">
                    Platform Architecture
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    Samad Expo is built as an agile digital hub. Each utility tool and hosted project runs cleanly with isolated preview environments while benefiting from shared cloud routing, security headers, and unified management.
                  </p>
                </div>
                <div className="pt-4 border-t border-zinc-800 flex items-center gap-2 text-xs font-bold text-[#FFF33D]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Unified Cloud Hosting &amp; Tooling</span>
                </div>
              </div>
            </Card3D>
          </section>

          {/* Vision & Mission */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card3D intensity={8}>
              <div className="samad-card p-8 space-y-4 relative overflow-hidden h-full">
                <div className="absolute top-4 right-5 text-5xl font-black text-white/5 select-none pointer-events-none">
                  01
                </div>
                <div className="w-11 h-11 rounded-2xl bg-[#FFF33D] text-black flex items-center justify-center shadow-md shadow-[#FFF33D]/20">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-black text-white">Our Vision</h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                  {profile.vision}
                </p>
              </div>
            </Card3D>

            <Card3D intensity={8}>
              <div className="samad-card p-8 space-y-4 relative overflow-hidden h-full">
                <div className="absolute top-4 right-5 text-5xl font-black text-white/5 select-none pointer-events-none">
                  02
                </div>
                <div className="w-11 h-11 rounded-2xl bg-[#18181F] border border-[#FFF33D]/40 text-[#FFF33D] flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-black text-white">Our Mission</h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                  {profile.mission}
                </p>
              </div>
            </Card3D>
          </section>

          {/* Core Values */}
          <section className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-white tracking-tight">
                Our Core <span className="samad-highlight">Values</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                The principles guiding our platform engineering and user experience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(profile.coreValues || []).map((val, idx) => (
                <Card3D key={idx} intensity={10}>
                  <div className="samad-card p-6 space-y-3 h-full">
                    <div className="w-9 h-9 rounded-xl bg-[#FFF33D] text-black font-black text-xs flex items-center justify-center shadow-sm shadow-[#FFF33D]/20">
                      0{idx + 1}
                    </div>
                    <h3 className="text-base font-extrabold text-white">{val.title}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">{val.description}</p>
                  </div>
                </Card3D>
              ))}
            </div>
          </section>

          {/* Roadmap */}
          {profile.futureRoadmap && (
            <Card3D intensity={5}>
              <section className="samad-card p-8 sm:p-10 space-y-4 border-t-4 border-t-[#FFF33D]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF33D] text-black flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    Future Strategic Roadmap
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                  {profile.futureRoadmap}
                </p>
              </section>
            </Card3D>
          )}
        </div>
      </div>
    </div>
  );
}
