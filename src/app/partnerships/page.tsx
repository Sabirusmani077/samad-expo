import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";
import { ExternalLink, Globe, Layers, Award } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Partnerships & Alliances | Samad Expo",
  description:
    "Collaborate with Samad Expo on web engineering, digital platforms, and strategic alliances.",
};

export default function PartnershipsPage() {
  const db = readDb();
  const partners = (db.partnerships || []).filter((p) => p.status === "active");

  return (
    <div className="bg-white min-h-screen text-[#1D1C1C]">
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
            <span className="text-[#C8A464]">Partnerships</span>
          </nav>

          <div className="space-y-4 max-w-3xl">
            <div className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#C8A464]">
              Strategic Alliances
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-[0.14em] leading-tight text-white">
              Partner With <span className="samad-highlight !text-[#E5C78E]">Samad Expo</span>
            </h1>

            <p className="font-editorial-serif italic text-base sm:text-xl text-zinc-300 leading-relaxed">
              We collaborate with developers, digital creators, and institutions to launch, host, and refine enduring web platforms.
            </p>

            <div className="pt-2">
              <Link
                href="/contact?inquiryType=partnership"
                className="btn-maison-light inline-block px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.22em]"
              >
                Propose Collaboration
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-[#FAF7F2] py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Technology Alliances",
                desc: "Integrate web tools, cloud hosting, or MCP endpoints into modern workflows.",
                icon: Globe,
              },
              {
                title: "Platform Incubation",
                desc: "Publish static portals and web utilities backed by Samad Expo infrastructure.",
                icon: Layers,
              },
              {
                title: "Digital Co-Creation",
                desc: "Collaborate with our engineering studio to craft enduring web products.",
                icon: Award,
              },
            ].map((model, idx) => (
              <Card3D key={idx} intensity={5}>
                <div className="samad-card p-8 space-y-4 h-full border-t-2 border-t-[#C10016]">
                  <div className="w-11 h-11 border border-[#C8A464] bg-white text-[#1D1C1C] flex items-center justify-center">
                    <model.icon className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-[#1D1C1C]">
                    {model.title}
                  </h3>
                  <p className="font-editorial-serif text-base text-[#595959] leading-relaxed">
                    {model.desc}
                  </p>
                </div>
              </Card3D>
            ))}
          </section>

          <section className="space-y-8">
            <div className="border-b border-[#E5DFD7] pb-3">
              <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-[#1D1C1C]">
                Active Strategic Partners
              </h2>
            </div>

            {partners.length === 0 ? (
              <Card3D intensity={4}>
                <div className="samad-card p-12 text-center space-y-4">
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#1D1C1C]">
                    Open to Strategic Ecosystem Collaborations
                  </p>
                  <p className="font-editorial-serif italic text-sm text-[#595959] max-w-md mx-auto">
                    Connect with our Agra desk to explore integration or platform incubation opportunities.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/contact"
                      className="btn-3d-yellow inline-block px-7 py-3 text-[11px] font-bold uppercase tracking-[0.2em]"
                    >
                      Contact Headquarters
                    </Link>
                  </div>
                </div>
              </Card3D>
            ) : (
              <div
                className={`grid ${
                  partners.length <= 1
                    ? "grid-cols-1 max-w-xl"
                    : partners.length === 2 || partners.length === 4
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                } gap-6`}
              >
                {partners.map((partner) => (
                  <Card3D key={partner.id} intensity={5}>
                    <div className="samad-card p-7 flex flex-col justify-between space-y-4 h-full">
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold text-[#C10016] uppercase tracking-[0.24em]">
                          {partner.partnerType} Partner
                        </span>
                        <h3 className="text-base font-bold uppercase tracking-[0.14em] text-[#1D1C1C]">
                          {partner.partnerName}
                        </h3>
                        <p className="font-editorial-serif text-sm text-[#595959] leading-relaxed">
                          {partner.description}
                        </p>
                      </div>

                      {partner.url && (
                        <div className="pt-4 border-t border-[#E5DFD7]">
                          <a
                            href={partner.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-editorial-serif italic text-sm text-[#1D1C1C] border-b border-[#1D1C1C] hover:text-[#C10016] hover:border-[#C10016] pb-0.5 inline-flex items-center gap-1 transition"
                          >
                            <span>Visit Partner</span>
                            <ExternalLink className="w-3 h-3" />
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
