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
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-slate-900 font-medium">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">About Samad Expo</span>
        </nav>

        {/* Hero Section */}
        <section className="rounded-3xl border-2 border-slate-900 bg-white p-8 sm:p-12 shadow-[8px_8px_0px_#FFF33D] space-y-6">
          <span className="inline-block px-3 py-1 rounded-md bg-[#FFF33D] text-black font-extrabold font-extrabold text-xs uppercase tracking-wider border border-slate-900/20">
            Corporate Profile
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 leading-tight max-w-3xl">
            {profile.businessName} — {profile.tagline}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            {profile.about}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/corporate-services"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider transition-colors"
            >
              <span>Our Services &amp; Capabilities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/websites"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs uppercase tracking-wider border border-slate-300"
            >
              <Globe className="w-4 h-4" />
              <span>Explore Digital Ecosystem</span>
            </Link>
          </div>
        </section>

        {/* Company Background & Story */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="rounded-3xl border border-slate-200 p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFF33D] border border-slate-900/20 flex items-center justify-center text-slate-950">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-950">Our Story & Heritage</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {profile.story}
            </p>
          </div>

          <div className="rounded-3xl border-2 border-slate-900 p-8 space-y-4 bg-slate-50">
            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-950">Corporate Architecture</h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Samad Expo is structured as an agile parent enterprise. Each individual website,
              application, or brand under our umbrella retains its independent branding, design language,
              and dedicated operations, while benefiting from centralized corporate governance, shared
              technological infrastructure, and strategic direction.
            </p>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-3xl border-2 border-slate-900 p-8 shadow-[6px_6px_0px_#FFF33D] space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFF33D] flex items-center justify-center text-slate-950">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-950">Our Vision</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {profile.vision}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-950">Our Mission</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {profile.mission}
            </p>
          </div>
        </section>

        {/* Core Values Grid */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
              Our Core Corporate Values
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              The enduring pillars that govern our decisions across every division and digital venture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(profile.coreValues || []).map((val) => (
              <div
                key={val.title}
                className="rounded-2xl border border-slate-200 p-6 bg-white hover:border-slate-900/40 transition-colors space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FFF33D] border border-slate-900/20 flex items-center justify-center text-slate-950">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-950">{val.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Future Roadmap */}
        {profile.futureRoadmap && (
          <section className="rounded-3xl bg-[#FFF33D]/30 border-2 border-slate-900 p-8 sm:p-12 space-y-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-slate-950" />
              <h2 className="text-2xl font-black text-slate-950">Future Strategic Roadmap</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
              {profile.futureRoadmap}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
