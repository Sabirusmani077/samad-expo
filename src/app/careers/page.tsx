import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { Briefcase, MapPin, Clock, ArrowRight, Sparkles, Award, Zap, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Careers & Opportunities | Samad Expo",
  description:
    "Join the team at Samad Expo. Explore open roles across technology, digital operations, design, and business management.",
};

export default function CareersPage() {
  const db = readDb();
  const jobs = (db.jobListings || []).filter((j) => j.status === "open");

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-900">
      
      {/* Athenura Obsidian Hero */}
      <section className="bg-[#040D12] text-white pt-14 pb-20 sm:pt-20 sm:pb-24 border-b border-teal-900/30 relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-teal-500/10 blur-[140px]" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <nav aria-label="Breadcrumb" className="text-xs text-zinc-400 flex items-center gap-2">
            <Link href="/" className="hover:text-teal-400 transition">Home</Link>
            <span>/</span>
            <span className="text-white font-bold">Careers &amp; Opportunities</span>
          </nav>

          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-teal-500/30 bg-teal-950/50 text-xs font-bold text-teal-300">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Talent &amp; Innovation</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-tight">
              Build Digital Excellence <span className="text-gradient-teal">With Us.</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
              We are seeking passionate full-stack engineers, UI/UX creators, and operational leaders who want to build the future of instant web hosting and developer platforms.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-slate-950 hover:bg-teal-50 font-bold text-xs uppercase tracking-wider transition shadow-lg hover:scale-105 active:scale-95"
              >
                <span>Send Spontaneous Portfolio</span>
                <ArrowRight className="w-4 h-4 text-teal-700" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
        
        {/* Culture & Perks Grid */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-black text-slate-950 tracking-tight">
              Why Build at <span className="text-gradient-teal">Samad Expo</span>?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              We empower team members with cutting-edge tools, autonomy, and high-impact digital ventures.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Next-Gen Tech",
                desc: "Work daily with Next.js 15, React 19, Model Context Protocol APIs, and Edge deployment.",
                icon: Zap,
              },
              {
                title: "Remote Flexibility",
                desc: "Collaborate flexibly across distributed nodes with focus on output and code excellence.",
                icon: MapPin,
              },
              {
                title: "Real Ownership",
                desc: "Direct responsibility over tools that handle live global user traffic and instant deployments.",
                icon: Award,
              },
              {
                title: "Continuous Growth",
                desc: "Work directly alongside executive leadership on venture scaling and modern cloud systems.",
                icon: ShieldCheck,
              },
            ].map((perk, idx) => (
              <div key={idx} className="athenura-card p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <perk.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-950">{perk.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{perk.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Listings */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <h2 className="text-2xl font-black text-slate-950 tracking-tight">Current Openings</h2>
            <span className="text-xs font-bold text-teal-700">{jobs.length} Active Positions</span>
          </div>

          {jobs.length === 0 ? (
            <div className="athenura-card p-12 text-center text-slate-500 space-y-4">
              <p className="text-sm font-semibold text-slate-700">We do not have open roles listed at this exact moment.</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Passionate about web engineering, edge architecture, or design? We welcome spontaneous portfolios.
              </p>
              <div>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-950 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider transition"
                >
                  <span>Submit General Application</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="athenura-card p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">
                      {job.department}
                    </span>
                    <h3 className="text-xl font-bold text-slate-950">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-teal-600" />
                        {job.location} {job.isRemote && "(Remote Eligible)"}
                      </span>
                      <span className="flex items-center gap-1.5 capitalize">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        {job.type.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/contact?inquiryType=careers&subject=Application%20for%20${encodeURIComponent(job.title)}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-slate-950 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider transition shrink-0 shadow-sm"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
