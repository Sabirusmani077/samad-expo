import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { Handshake, ArrowRight, ExternalLink, ShieldCheck, Sparkles, Globe, Layers, Award } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Partnerships & Alliances | Samad Expo",
  description:
    "Collaborate with Samad Expo. We build strategic relationships with technology partners, vendors, distributors, and creators.",
};

export default function PartnershipsPage() {
  const db = readDb();
  const partners = (db.partnerships || []).filter((p) => p.status === "active");

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-900">
      
      {/* Athenura Obsidian Hero */}
      <section className="bg-[#040D12] text-white pt-14 pb-20 sm:pt-20 sm:pb-24 border-b border-teal-900/30 relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-teal-500/10 blur-[140px]" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <nav aria-label="Breadcrumb" className="text-xs text-zinc-400 flex items-center gap-2">
            <Link href="/" className="hover:text-teal-400 transition">Home</Link>
            <span>/</span>
            <span className="text-white font-bold">Partnerships &amp; Alliances</span>
          </nav>

          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-teal-500/30 bg-teal-950/50 text-xs font-bold text-teal-300">
              <Handshake className="w-3.5 h-3.5 text-teal-400" />
              <span>Venture &amp; Ecosystem Alliances</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-tight">
              Partner With <span className="text-gradient-teal">Samad Expo.</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
              We actively collaborate with technology providers, business networks, brand manufacturers, and digital creators to accelerate shared growth on our edge platform.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/contact?inquiryType=partnership"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-slate-950 hover:bg-teal-50 font-bold text-xs uppercase tracking-wider transition shadow-lg hover:scale-105 active:scale-95"
              >
                <span>Propose a Collaboration</span>
                <ArrowRight className="w-4 h-4 text-teal-700" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
        
        {/* 3 Partnership Models */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-black text-slate-950 tracking-tight">
              Collaboration <span className="text-gradient-teal">Models</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Flexible structures designed to align incentives and foster long-term technological and commercial success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Technology Alliances",
                desc: "Integrate developer APIs, cloud edge hosting, or Model Context Protocol tooling into your existing product ecosystem.",
                icon: Globe,
              },
              {
                title: "Venture Incubation",
                desc: "Launch new digital products backed by Samad Expo's centralized engineering, cloud hosting, and corporate governance.",
                icon: Layers,
              },
              {
                title: "Commercial Syndication",
                desc: "Distribute and co-market software tools and web applications to broader regional and enterprise audiences.",
                icon: Award,
              },
            ].map((model, idx) => (
              <div key={idx} className="athenura-card p-7 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
                  <model.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-950">{model.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{model.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Active Strategic Partners */}
        <section className="space-y-6">
          <div className="border-b border-slate-200/80 pb-3">
            <h2 className="text-2xl font-black text-slate-950 tracking-tight">Active Strategic Partners</h2>
          </div>

          {partners.length === 0 ? (
            <div className="athenura-card p-12 text-center text-slate-500 space-y-3">
              <p className="text-sm font-semibold text-slate-700">We are currently establishing initial ecosystem partnerships.</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Interested in collaborating or integrating with Samad Expo? Our executive desk reviews all partnership inquiries directly.
              </p>
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-950 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider transition"
                >
                  <span>Inquire with Headquarters</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="athenura-card p-6 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">
                      {partner.partnerType} Partner
                    </span>
                    <h3 className="text-lg font-bold text-slate-950">{partner.partnerName}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {partner.description}
                    </p>
                  </div>

                  {partner.url && (
                    <div className="pt-4 border-t border-slate-100">
                      <a
                        href={partner.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 transition"
                      >
                        <span>Visit Partner Platform</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
