import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";

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
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-slate-900 font-medium">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">Careers</span>
        </nav>

        {/* Hero */}
        <section className="rounded-3xl border-2 border-slate-900 bg-white p-8 sm:p-12 shadow-[8px_8px_0px_#FFF33D] space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FFF33D] text-black font-extrabold font-extrabold text-xs uppercase tracking-wider border border-slate-900/20">
            <Briefcase className="w-3.5 h-3.5" />
            Join Our Team
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 leading-tight max-w-3xl">
            Build Digital Excellence With Us
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            We are always seeking passionate engineers, creative builders, and operational leaders who want
            to make an impact across our growing digital business ecosystem.
          </p>
        </section>

        {/* Listings */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-950">Current Openings</h2>

          {jobs.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 p-12 text-center text-slate-500 bg-slate-50 space-y-4">
              <p>We do not have open roles listed at this exact moment.</p>
              <p className="text-xs text-slate-400">
                You are always welcome to send a spontaneous portfolio or CV to our careers desk.
              </p>
              <Link
                href="/contact"
                className="inline-block px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
              >
                Send General Application
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-2xl border-2 border-slate-200 hover:border-slate-900 transition-all p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">{job.department}</span>
                    <h3 className="text-lg font-black text-slate-950">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location} {job.isRemote && "(Remote)"}
                      </span>
                      <span className="flex items-center gap-1 capitalize">
                        <Clock className="w-3.5 h-3.5" />
                        {job.type.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/contact?inquiryType=careers&subject=Application%20for%20${encodeURIComponent(job.title)}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#FFF33D] hover:bg-black hover:text-[#FFF33D] text-slate-950 font-extrabold text-xs uppercase tracking-wider border border-slate-900 transition-colors"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
