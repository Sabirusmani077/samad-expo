import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";
import {
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  Award,
  Zap,
  ShieldCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Careers & Opportunities | Samad Expo",
  description:
    "Explore opportunities to collaborate and build digital products with Samad Expo.",
};

export default function CareersPage() {
  const db = readDb();
  const jobs = (db.jobListings || []).filter((j) => j.status === "open");

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
            <span className="text-[#FFF33D] font-bold">Careers</span>
          </nav>

          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF33D]/10 border border-[#FFF33D]/30 text-xs font-bold text-[#FFF33D]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Opportunities &amp; Talent</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              Build With <span className="samad-highlight">Samad Expo</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              We collaborate with dedicated developers, UI/UX builders, and digital operators who care about practical utility and clean engineering.
            </p>

            <div className="pt-2">
              <Link
                href="/contact"
                className="btn-3d-yellow inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-wider"
              >
                <span>Share Your Portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-[#0B0B0F] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Modern Stack",
                desc: "Build with Next.js 15, React 19, TypeScript, and static edge tooling.",
                icon: Zap,
              },
              {
                title: "Flexible Work",
                desc: "Remote-friendly engineering culture focused on shipped product quality.",
                icon: MapPin,
              },
              {
                title: "Direct Ownership",
                desc: "Build tools and hosting features used immediately on the live web.",
                icon: Award,
              },
              {
                title: "Security Discipline",
                desc: "Clean coding practices, audit verification, and user data protection.",
                icon: ShieldCheck,
              },
            ].map((perk, idx) => (
              <Card3D key={idx} intensity={10}>
                <div className="samad-card p-6 space-y-3 h-full">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF33D] text-black flex items-center justify-center shadow-sm shadow-[#FFF33D]/20">
                    <perk.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-extrabold text-white">
                    {perk.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{perk.desc}</p>
                </div>
              </Card3D>
            ))}
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-2xl font-black text-white tracking-tight">
                Current Openings
              </h2>
              <span className="text-xs font-extrabold text-[#FFF33D]">
                {jobs.length} Open Position{jobs.length === 1 ? "" : "s"}
              </span>
            </div>

            {jobs.length === 0 ? (
              <Card3D intensity={5}>
                <div className="samad-card p-12 text-center space-y-4">
                  <p className="text-sm font-bold text-white">
                    No active openings listed right now.
                  </p>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    Interested in working with Samad Expo? Feel free to introduce yourself via our contact page.
                  </p>
                  <div>
                    <Link
                      href="/contact"
                      className="btn-3d-yellow inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-wider"
                    >
                      <span>Send General Inquiry</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </Card3D>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <Card3D key={job.id} intensity={6}>
                    <div className="samad-card p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FFF33D]">
                          {job.department}
                        </span>
                        <h3 className="text-xl font-extrabold text-white">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#FFF33D]" />
                            {job.location} {job.isRemote && "(Remote)"}
                          </span>
                          <span className="flex items-center gap-1.5 capitalize">
                            <Clock className="w-3.5 h-3.5 text-[#FFF33D]" />
                            {job.type.replace("_", " ")}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/contact?inquiryType=careers&subject=Application%20for%20${encodeURIComponent(
                          job.title
                        )}`}
                        className="btn-3d-yellow inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-wider shrink-0"
                      >
                        <span>Apply Now</span>
                        <ArrowRight className="w-4 h-4" />
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
