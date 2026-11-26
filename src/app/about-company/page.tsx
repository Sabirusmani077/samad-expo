import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";
import {
  ShieldCheck,
  Award,
  Target,
  Compass,
  Building2,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The Maison · About Samad Expo",
  description:
    "Discover Samad Expo from Bodla, Agra — architectural heritage, guiding principles, corporate roadmap, and digital ecosystem.",
};

export default function AboutCompanyPage() {
  const db = readDb();
  const profile = db.companyProfile;

  return (
    <div className="bg-white min-h-screen text-[#1D1C1C]">
      {/* Cartier Nocturnal Top Header */}
      <section className="samad-hero-grid border-b border-[#C8A464]/25 pt-14 pb-16 sm:pt-20 sm:pb-24 relative overflow-hidden text-white">
        <ThreeHeroCanvas variant="dark" className="opacity-80" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0A0C] via-[#0B0A0C]/40 to-transparent z-[1]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <nav
            aria-label="Breadcrumb"
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2"
          >
            <Link href="/" className="hover:text-[#C8A464] transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#C8A464]">The Maison</span>
          </nav>

          <div className="space-y-4 max-w-3xl">
            <div className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#C8A464]">
              Heritage &amp; Philosophy
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-[0.14em] leading-tight text-white">
              About <span className="samad-highlight !text-[#E5C78E]">{profile.businessName}</span>
            </h1>

            <p className="font-editorial-serif italic text-base sm:text-xl text-zinc-300 leading-relaxed">
              {profile.about}
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-5">
              <Link
                href="/corporate-services"
                className="btn-maison-light px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.22em]"
              >
                Explore Services
              </Link>

              <Link
                href="/websites"
                className="font-editorial-serif italic text-base text-[#E5C78E] border-b border-[#C8A464]/50 hover:border-white hover:text-white pb-0.5 transition"
              >
                Explore Digital Creations
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Crisp Gallery Content */}
      <div className="bg-[#FAF7F2] py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Heritage & Architecture */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            <Card3D intensity={5}>
              <div className="samad-card p-8 sm:p-10 space-y-5 flex flex-col justify-between h-full border-t-2 border-t-[#C10016]">
                <div className="space-y-4">
                  <div className="w-11 h-11 border border-[#C8A464] bg-white text-[#1D1C1C] flex items-center justify-center">
                    <Compass className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <h2 className="text-lg font-bold uppercase tracking-[0.16em] text-[#1D1C1C]">
                    Our Story &amp; Origins
                  </h2>
                  <p className="font-editorial-serif text-base text-[#595959] leading-relaxed whitespace-pre-line">
                    {profile.story}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E5DFD7] flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#C10016]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    Established {profile.founded || "2024"} &middot;{" "}
                    {profile.headquarters || "Bodla, Agra, India"}
                  </span>
                </div>
              </div>
            </Card3D>

            <Card3D intensity={5}>
              <div className="samad-card-dark p-8 sm:p-10 space-y-5 flex flex-col justify-between h-full border-t-2 border-t-[#C8A464]">
                <div className="space-y-4">
                  <div className="w-11 h-11 border border-[#C8A464]/60 bg-[#151215] text-[#C8A464] flex items-center justify-center">
                    <Building2 className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <h2 className="text-lg font-bold uppercase tracking-[0.16em] text-white">
                    Cloud Architecture
                  </h2>
                  <p className="font-editorial-serif text-base text-zinc-300 leading-relaxed">
                    Samad Expo is engineered as an agile digital ecosystem. Each web utility and deployed project operates inside isolated preview containers unified by hardened cloud routing and security verification.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#C8A464]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Hardened Hosting &amp; Edge Tooling</span>
                </div>
              </div>
            </Card3D>
          </section>

          {/* Vision & Mission */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card3D intensity={5}>
              <div className="samad-card p-8 sm:p-10 space-y-4 h-full">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 border border-[#C8A464] bg-white text-[#C10016] flex items-center justify-center">
                    <Target className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <span className="font-editorial-serif italic text-3xl text-[#D5CEC5]">
                    01
                  </span>
                </div>
                <h3 className="text-base font-bold uppercase tracking-[0.18em] text-[#1D1C1C]">
                  Our Vision
                </h3>
                <p className="font-editorial-serif text-base text-[#595959] leading-relaxed whitespace-pre-line">
                  {profile.vision}
                </p>
              </div>
            </Card3D>

            <Card3D intensity={5}>
              <div className="samad-card p-8 sm:p-10 space-y-4 h-full">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 border border-[#1D1C1C] bg-[#1D1C1C] text-[#C8A464] flex items-center justify-center">
                    <Award className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <span className="font-editorial-serif italic text-3xl text-[#D5CEC5]">
                    02
                  </span>
                </div>
                <h3 className="text-base font-bold uppercase tracking-[0.18em] text-[#1D1C1C]">
                  Our Mission
                </h3>
                <p className="font-editorial-serif text-base text-[#595959] leading-relaxed whitespace-pre-line">
                  {profile.mission}
                </p>
              </div>
            </Card3D>
          </section>

          {/* Core Values */}
          <section className="space-y-8">
            <div className="text-center space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C10016]">
                Foundations
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-[0.18em] text-[#1D1C1C]">
                Guiding Principles
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(profile.coreValues || []).map((val, idx) => (
                <Card3D key={idx} intensity={5}>
                  <div className="samad-card p-6 space-y-3 h-full border-t-2 border-t-[#C10016]">
                    <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C8A464]">
                      0{idx + 1}
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#1D1C1C]">
                      {val.title}
                    </h3>
                    <p className="font-editorial-serif text-sm text-[#595959] leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                </Card3D>
              ))}
            </div>
          </section>

          {/* Roadmap */}
          {profile.futureRoadmap && (
            <Card3D intensity={4}>
              <section className="samad-card p-8 sm:p-10 space-y-4 border-t-2 border-t-[#C10016]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1D1C1C] text-[#C8A464] flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <h2 className="text-lg font-bold uppercase tracking-[0.18em] text-[#1D1C1C]">
                    Strategic Roadmap
                  </h2>
                </div>
                <p className="font-editorial-serif text-base text-[#595959] leading-relaxed whitespace-pre-line">
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
