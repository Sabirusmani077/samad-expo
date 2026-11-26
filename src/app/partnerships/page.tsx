import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";
import {
  Handshake,
  ArrowRight,
  ExternalLink,
  Globe,
  Layers,
  Award,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Partnerships & Alliances | Samad Expo",
  description:
    "Collaborate with Samad Expo on web engineering, digital platforms, and ecosystem partnerships.",
};

export default function PartnershipsPage() {
  const db = readDb();
  const partners = (db.partnerships || []).filter((p) => p.status === "active");

  return (
    <div className="bg-[#060608] min-h-screen text-white">
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
            <span className="text-[#FFF33D] font-bold">Partnerships</span>
          </nav>

          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF33D]/10 border border-[#FFF33D]/30 text-xs font-bold text-[#FFF33D]">
              <Handshake className="w-3.5 h-3.5" />
              <span>Strategic Alliances</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              Partner With <span className="samad-highlight">Samad Expo</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              We collaborate with developers, digital creators, and organizations to host, launch, and scale useful web platforms.
            </p>

            <div className="pt-2">
              <Link
                href="/contact?inquiryType=partnership"
                className="btn-3d-yellow inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-wider"
              >
                <span>Propose a Collaboration</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-[#0B0B0F] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Technology Alliances",
                desc: "Integrate web tools, cloud hosting, or MCP endpoints into your workflows.",
                icon: Globe,
              },
              {
                title: "Platform Incubation",
                desc: "Host and publish static portals and web utilities backed by Samad Expo infrastructure.",
                icon: Layers,
              },
              {
                title: "Digital Co-Creation",
                desc: "Partner with our engineering desk to launch practical user-facing products.",
                icon: Award,
              },
            ].map((model, idx) => (
              <Card3D key={idx} intensity={9}>
                <div className="samad-card p-7 space-y-4 h-full">
                  <div className="w-11 h-11 rounded-2xl bg-[#FFF33D] text-black flex items-center justify-center shadow-md shadow-[#FFF33D]/20">
                    <model.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-extrabold text-white">
                    {model.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{model.desc}</p>
                </div>
              </Card3D>
            ))}
          </section>

          <section className="space-y-6">
            <div className="border-b border-zinc-800 pb-3">
              <h2 className="text-2xl font-black text-white tracking-tight">
                Active Strategic Partners
              </h2>
            </div>

            {partners.length === 0 ? (
              <Card3D intensity={5}>
                <div className="samad-card p-12 text-center space-y-4">
                  <p className="text-sm font-bold text-white">
                    Open to new ecosystem partnerships.
                  </p>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    Interested in collaborating with Samad Expo? Reach out directly through our contact desk.
                  </p>
                  <div>
                    <Link
                      href="/contact"
                      className="btn-3d-yellow inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-wider"
                    >
                      <span>Contact Headquarters</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </Card3D>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {partners.map((partner) => (
                  <Card3D key={partner.id} intensity={9}>
                    <div className="samad-card p-6 flex flex-col justify-between space-y-4 h-full">
                      <div className="space-y-3">
                        <span className="text-[10px] font-extrabold text-[#FFF33D] uppercase tracking-wider">
                          {partner.partnerType} Partner
                        </span>
                        <h3 className="text-lg font-extrabold text-white">
                          {partner.partnerName}
                        </h3>
                        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                          {partner.description}
                        </p>
                      </div>

                      {partner.url && (
                        <div className="pt-4 border-t border-zinc-800">
                          <a
                            href={partner.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-extrabold text-[#FFF33D] hover:text-white inline-flex items-center gap-1 transition"
                          >
                            <span>Visit Partner</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  </Card3D>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
