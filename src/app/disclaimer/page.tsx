import React from "react";
import Link from "next/link";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";
import { Info } from "lucide-react";

export const metadata = {
  title: "Corporate Disclaimer | Samad Expo",
  description:
    "Legal disclaimer and ecosystem disclosures for Samad Expo.",
};

export default function DisclaimerPage() {
  return (
    <div className="bg-[#060608] samad-hero-grid min-h-screen py-14 sm:py-20 text-white relative overflow-hidden">
      <ThreeHeroCanvas variant="dark" />
      <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-[#FFF33D]/15 blur-[120px]" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-zinc-400 flex items-center gap-2"
        >
          <Link href="/" className="hover:text-[#FFF33D] font-semibold transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#FFF33D] font-bold">Corporate Disclaimer</span>
        </nav>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF33D]/10 border border-[#FFF33D]/30 text-[#FFF33D] text-xs font-bold uppercase tracking-wider">
            <Info className="w-3.5 h-3.5" />
            <span>Legal &amp; Disclosures</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Corporate <span className="samad-highlight">Disclaimer</span>
          </h1>

          <p className="text-xs text-zinc-400 font-medium">
            Effective Date: November 2026 &bull; Samad Expo
          </p>
        </div>

        <Card3D intensity={4}>
          <div className="samad-card p-8 sm:p-10 space-y-8 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t-4 border-t-[#FFF33D]">
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-extrabold text-[#FFF33D]">
                1. Ecosystem Ownership
              </h2>
              <p>
                Samad Expo is the parent brand behind our digital utilities, hosted portals, and cloud services. Individual community-uploaded websites under `/sites/` reflect the work of their respective creators.
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-zinc-800">
              <h2 className="text-base sm:text-lg font-extrabold text-[#FFF33D]">
                2. External Platforms
              </h2>
              <p>
                Links to external platforms and GitHub Pages tools are provided for convenience and open in isolated tabs subject to each platform&apos;s own operating terms.
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-zinc-800">
              <h2 className="text-base sm:text-lg font-extrabold text-[#FFF33D]">
                3. Contact Information
              </h2>
              <p className="font-semibold text-zinc-200">
                Samad Expo &mdash; Bodla, Agra, Uttar Pradesh 282010
                <br />
                Email:{" "}
                <a
                  href="mailto:officialaadhakh@gmail.com"
                  className="text-[#FFF33D] underline decoration-[#FFF33D]/60 decoration-2 hover:text-white"
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
