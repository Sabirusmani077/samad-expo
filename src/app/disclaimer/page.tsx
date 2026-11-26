import React from "react";
import Link from "next/link";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";

export const metadata = {
  title: "Corporate Disclaimer | Samad Expo",
  description: "Legal disclaimer and disclosures for Samad Expo.",
};

export default function DisclaimerPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#1D1C1C]">
      <section className="samad-hero-grid border-b border-[#C8A464]/25 pt-14 pb-14 relative overflow-hidden text-white">
        <ThreeHeroCanvas variant="dark" className="opacity-75" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <nav
            aria-label="Breadcrumb"
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2"
          >
            <Link href="/" className="hover:text-[#C8A464] transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#C8A464]">Disclaimer</span>
          </nav>

          <div className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#C8A464]">
            Legal Area &middot; Disclosures
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-[0.14em] text-white">
            Disclaimer
          </h1>
          <p className="font-editorial-serif italic text-sm text-zinc-300">
            Effective Date: November 2026 &bull; Samad Expo
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <Card3D intensity={3}>
          <div className="samad-card p-8 sm:p-12 space-y-8 font-editorial-serif text-base text-[#595959] leading-relaxed border-t-2 border-t-[#C10016]">
            <section className="space-y-3">
              <h2 className="font-sans text-sm font-bold uppercase tracking-[0.18em] text-[#1D1C1C]">
                1. Ecosystem Responsibility
              </h2>
              <p>
                Samad Expo administers the central hosting infrastructure, web tools, and cloud directory. Community-uploaded static pages published under static paths reflect the content provided by their respective uploaders.
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-[#E5DFD7]">
              <h2 className="font-sans text-sm font-bold uppercase tracking-[0.18em] text-[#1D1C1C]">
                2. External Applications
              </h2>
              <p>
                Links to external digital properties open in separate browser contexts governed by their own operating notices.
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-[#E5DFD7]">
              <h2 className="font-sans text-sm font-bold uppercase tracking-[0.18em] text-[#1D1C1C]">
                3. Contact Information
              </h2>
              <p className="text-[#1D1C1C]">
                Samad Expo &mdash; Bodla, Agra, Uttar Pradesh 282010
                <br />
                Email:{" "}
                <a
                  href="mailto:officialaadhakh@gmail.com"
                  className="italic text-[#C10016] underline"
                >
                  officialaadhakh@gmail.com
                </a>
              </p>
            </section>
          </div>
        </Card3D>
      </div>
    </div>
  );
}
