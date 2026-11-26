import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";
import { MapPin, Clock, Award, Zap, ShieldCheck, Globe } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Careers & Talent | Samad Expo",
  description:
    "Explore opportunities to collaborate and build digital systems with Samad Expo.",
};

export default function CareersPage() {
  const db = readDb();
  const jobs = (db.jobListings || []).filter((j) => j.status === "open");

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
            <span className="text-[#C8A464]">Careers</span>
          </nav>

          <div className="space-y-4 max-w-3xl">
            <div className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#C8A464]">
              Opportunities &amp; Talent
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-[0.14em] leading-tight text-white">
              Join <span className="samad-highlight !text-[#E5C78E]">Samad Expo</span>
            </h1>

            <p className="font-editorial-serif italic text-base sm:text-xl text-zinc-300 leading-relaxed">
              Collaborate with builders, engineers, and craftspeople dedicated to clean web architecture and enduring digital utility.
            </p>

            <div className="pt-2">
              <Link
                href="/contact"
                className="btn-maison-light inline-block px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.22em]"
              >
                Share Your Portfolio
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-[#FAF7F2] py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Modern Stack",
                desc: "Next.js 15, React 19, TypeScript, and WebGL craft.",
                icon: Zap,
              },
              {
                title: "Remote Culture",
                desc: "Focused engineering discipline from anywhere.",
                icon: MapPin,
              },
              {
                title: "High Autonomy",
                desc: "Build public utilities deployed directly to live users.",
                icon: Award,
              },
              {
                title: "Security Ethos",
                desc: "Hardened engineering and verified access safety.",
                icon: ShieldCheck,
              },
            ].map((perk, idx) => (
              <Card3D key={idx} intensity={5}>
                <div className="samad-card p-6 space-y-3 h-full border-t-2 border-t-[#C10016]">
                  <div className="w-10 h-10 border border-[#C8A464] bg-white text-[#1D1C1C] flex items-center justify-center">
                    <perk.icon className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#1D1C1C]">
                    {perk.title}
                  </h3>
                  <p className="font-editorial-serif text-sm text-[#595959] leading-relaxed">
                    {perk.desc}
                  </p>
                </div>
              </Card3D>
            ))}
          </section>

          <section className="space-y-8">
            <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-3">
              <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-[#1D1C1C]">
                Current Openings
              </h2>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#C10016]">
                {jobs.length} Position{jobs.length === 1 ? "" : "s"}
              </span>
            </div>

            {jobs.length === 0 ? (
              <Card3D intensity={4}>
                <div className="samad-card p-12 text-center space-y-4">
                  <Globe className="w-6 h-6 mx-auto text-[#C8A464] stroke-[1.4]" />
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#1D1C1C]">
                    No active openings published at this moment
                  </p>
                  <p className="font-editorial-serif italic text-sm text-[#595959] max-w-md mx-auto">
                    Introduce yourself and share recent web engineering work via our advisory contact desk.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/contact"
                      className="btn-3d-yellow inline-block px-7 py-3 text-[11px] font-bold uppercase tracking-[0.2em]"
                    >
                      Send General Inquiry
                    </Link>
                  </div>
                </div>
              </Card3D>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <Card3D key={job.id} intensity={4}>
                    <div className="samad-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#C10016]">
                          {job.department}
                        </span>
                        <h3 className="text-lg font-bold uppercase tracking-[0.12em] text-[#1D1C1C]">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-[#595959]">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#C8A464]" />
                            {job.location} {job.isRemote && "(Remote)"}
                          </span>
                          <span className="flex items-center gap-1.5 capitalize">
                            <Clock className="w-3.5 h-3.5 text-[#C8A464]" />
                            {job.type.replace("_", " ")}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/contact?inquiryType=careers&subject=Application%20for%20${encodeURIComponent(
                          job.title
                        )}`}
                        className="btn-3d-yellow px-7 py-3 text-[11px] font-bold uppercase tracking-[0.2em] shrink-0 text-center"
                      >
                        Apply Now
                      </Link>
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
