import React from "react";
import Link from "next/link";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Samad Expo",
  description: "Privacy Policy and data protection practices at Samad Expo.",
};

export default function PrivacyPolicyPage() {
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
          <span className="text-[#FFF33D] font-bold">Privacy Policy</span>
        </nav>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF33D]/10 border border-[#FFF33D]/30 text-[#FFF33D] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Data Protection &amp; Governance</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Privacy <span className="samad-highlight">Policy</span>
          </h1>

          <p className="text-xs text-zinc-400 font-medium">
            Effective Date: November 2026 &bull; Samad Expo
          </p>
        </div>

        <Card3D intensity={4}>
          <div className="samad-card p-8 sm:p-10 space-y-8 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t-4 border-t-[#FFF33D]">
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-extrabold text-[#FFF33D]">
                1. Information We Collect
              </h2>
              <p>
                Samad Expo collects only the minimum personal information necessary to respond to inquiries, operate user hosting accounts, and maintain platform performance:
              </p>
              <ul className="space-y-2 pl-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FFF33D] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Account &amp; Contact Details:</strong> Name, email address, optional phone number, and organization submitted during registration or contact inquiries.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FFF33D] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Uploaded Static Assets:</strong> Website files uploaded intentionally by registered users for static hosting under `/sites/`.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FFF33D] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Basic Usage Metrics:</strong> Anonymized page-view paths used strictly to monitor uptime and platform health.
                  </span>
                </li>
              </ul>
            </section>

            <section className="space-y-3 pt-6 border-t border-zinc-800">
              <h2 className="text-base sm:text-lg font-extrabold text-[#FFF33D]">
                2. How We Use Information
              </h2>
              <p>
                Submitted information is used solely to fulfill hosting deployments, respond to business inquiries, and provide support. We never sell or rent user data to third parties.
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-zinc-800">
              <h2 className="text-base sm:text-lg font-extrabold text-[#FFF33D]">
                3. Security &amp; Access Controls
              </h2>
              <p>
                User accounts, sessions, and administrative APIs are protected by cryptographic password hashing, server-side authorization checks, rate limiting, and hardened HTTP security headers.
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-zinc-800">
              <h2 className="text-base sm:text-lg font-extrabold text-[#FFF33D]">
                4. Contact Privacy Desk
              </h2>
              <p>
                To request access, correction, or deletion of your information, email{" "}
                <a
                  href="mailto:officialaadhakh@gmail.com"
                  className="text-[#FFF33D] font-bold underline decoration-[#FFF33D]/60 decoration-2 hover:text-white"
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
