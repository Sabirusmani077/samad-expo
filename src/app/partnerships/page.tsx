import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { Handshake, ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";

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
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-slate-900 font-medium">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">Partnerships</span>
        </nav>

        {/* Hero */}
        <section className="rounded-3xl border-2 border-slate-900 bg-white p-8 sm:p-12 shadow-[8px_8px_0px_#FFF33D] space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FFF33D] text-black font-extrabold font-extrabold text-xs uppercase tracking-wider border border-slate-900/20">
            <Handshake className="w-3.5 h-3.5" />
            Strategic Alliances
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 leading-tight max-w-3xl">
            Partner With Samad Expo
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            We actively collaborate with technology providers, business networks, brand manufacturers, and
            distributors to create win-win digital growth.
          </p>
          <div className="pt-2">
            <Link
              href="/contact?inquiryType=partnership"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider transition-colors"
            >
              <span>Propose a Partnership</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Partners Showcase */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-950">Active Strategic Partners</h2>

          {partners.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 p-12 text-center text-slate-500 bg-slate-50 space-y-3">
              <p>We are establishing initial ecosystem partnerships.</p>
              <p className="text-xs text-slate-400">
                Are you interested in collaborating with Samad Expo? Reach out through our business inquiry desk.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="rounded-2xl border-2 border-slate-200 p-6 bg-white hover:border-slate-900 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider capitalize">
                      {partner.partnerType} Partner
                    </span>
                    <h3 className="text-lg font-black text-slate-950">{partner.partnerName}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {partner.description}
                    </p>
                  </div>

                  {partner.url && (
                    <div className="pt-4 mt-4 border-t border-slate-100">
                      <a
                        href={partner.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-slate-800 hover:text-black hover:underline inline-flex items-center gap-1"
                      >
                        <span>Visit Partner</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
