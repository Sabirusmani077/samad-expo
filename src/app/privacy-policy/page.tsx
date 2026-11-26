import React from "react";
import Link from "next/link";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Samad Expo",
  description: "Privacy Policy and data protection practices at Samad Expo.",
};

export default function PrivacyPolicyPage() {
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
            <span className="text-[#C8A464]">Privacy Policy</span>
          </nav>

          <div className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#C8A464]">
            Legal Area &middot; Governance
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-[0.14em] text-white">
            Privacy Policy
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
                1. Information We Collect
              </h2>
              <p>
                Samad Expo collects only the minimal personal information required to respond to advisory inquiries, operate hosting accounts, and maintain platform performance:
              </p>
              <ul className="space-y-2.5 pl-1">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C10016] shrink-0 mt-1 stroke-[1.5]" />
                  <span>
                    <strong className="text-[#1D1C1C]">Account &amp; Contact Details:</strong> Name, email address, optional telephone, and organization provided during sign-up or inquiry forms.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C10016] shrink-0 mt-1 stroke-[1.5]" />
                  <span>
                    <strong className="text-[#1D1C1C]">Hosted Static Packages:</strong> Website assets uploaded voluntarily by authenticated users under static hosting routes.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C10016] shrink-0 mt-1 stroke-[1.5]" />
                  <span>
                    <strong className="text-[#1D1C1C]">Platform Diagnostics:</strong> Anonymized route-level traffic metrics used strictly to ensure stability.
                  </span>
                </li>
              </ul>
            </section>

            <section className="space-y-3 pt-6 border-t border-[#E5DFD7]">
              <h2 className="font-sans text-sm font-bold uppercase tracking-[0.18em] text-[#1D1C1C]">
                2. How Information Is Used
              </h2>
              <p>
                Submitted information is utilized solely to deliver website hosting, respond to project inquiries, and preserve system integrity. Personal data is never sold or rented.
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-[#E5DFD7]">
              <h2 className="font-sans text-sm font-bold uppercase tracking-[0.18em] text-[#1D1C1C]">
                3. Security &amp; Access Controls
              </h2>
              <p>
                User accounts, sessions, and API endpoints are protected by PBKDF2 password hashing, server-side authorization checks, token-bucket rate limiting, and hardened HTTP security headers.
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-[#E5DFD7]">
              <h2 className="font-sans text-sm font-bold uppercase tracking-[0.18em] text-[#1D1C1C]">
                4. Privacy Correspondence
              </h2>
              <p>
                To request review, correction, or removal of your data, write to{" "}
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
