import React from "react";
import Link from "next/link";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";

export const metadata = {
  title: "Terms of Use | Samad Expo",
  description:
    "Terms of Use governing Samad Expo website hosting and digital tools.",
};

export default function TermsPage() {
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
            <span className="text-[#C8A464]">Terms of Use</span>
          </nav>

          <div className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#C8A464]">
            Legal Area &middot; Terms
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-[0.14em] text-white">
            Terms and Conditions
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
                1. General Use
              </h2>
              <p>
                By accessing Samad Expo, static website hosting routes, and browser utilities, you agree to use platform features lawfully and supply accurate registration information.
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-[#E5DFD7]">
              <h2 className="font-sans text-sm font-bold uppercase tracking-[0.18em] text-[#1D1C1C]">
                2. Intellectual Property
              </h2>
              <p>
                Samad Expo architecture, trademarks, and platform code belong to Samad Expo. Creators who deploy static packages retain rights over their own submitted content while authorizing hosting delivery.
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-[#E5DFD7]">
              <h2 className="font-sans text-sm font-bold uppercase tracking-[0.18em] text-[#1D1C1C]">
                3. Acceptable Hosting Policy
              </h2>
              <p>
                Deceptive pages, malicious payloads, executable binaries, or unlawful assets are strictly prohibited across hosting routes and are subject to immediate removal.
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-[#E5DFD7]">
              <h2 className="font-sans text-sm font-bold uppercase tracking-[0.18em] text-[#1D1C1C]">
                4. Legal Desk
              </h2>
              <p>
                Direct inquiries concerning these terms to{" "}
                <a
                  href="mailto:officialaadhakh@gmail.com"
                  className="italic text-[#C10016] underline"
                >
                  officialaadhakh@gmail.com
                </a>
                .
              </p>
            </section>
          </div>
        </Card3D>
      </div>
    </div>
  );
}
