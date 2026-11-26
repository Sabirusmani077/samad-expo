import React from "react";
import Link from "next/link";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";
import { FileText } from "lucide-react";

export const metadata = {
  title: "Terms and Conditions | Samad Expo",
  description:
    "Terms and Conditions governing the use of Samad Expo website hosting and digital tools.",
};

export default function TermsPage() {
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
          <span className="text-[#FFF33D] font-bold">Terms &amp; Conditions</span>
        </nav>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF33D]/10 border border-[#FFF33D]/30 text-[#FFF33D] text-xs font-bold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            <span>Legal Agreement</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Terms and <span className="samad-highlight">Conditions</span>
          </h1>

          <p className="text-xs text-zinc-400 font-medium">
            Effective Date: November 2026 &bull; Samad Expo
          </p>
        </div>

        <Card3D intensity={4}>
          <div className="samad-card p-8 sm:p-10 space-y-8 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t-4 border-t-[#FFF33D]">
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-extrabold text-[#FFF33D]">
                1. General Use
              </h2>
              <p>
                By accessing Samad Expo, our static hosting platform, and our live digital utilities, you agree to use the service lawfully and provide accurate information during registration or inquiry submission.
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-zinc-800">
              <h2 className="text-base sm:text-lg font-extrabold text-[#FFF33D]">
                2. Intellectual Property
              </h2>
              <p>
                The Samad Expo brand, logo, and platform code belong to Samad Expo. Creators who deploy static websites retain rights to their own uploaded content while granting Samad Expo permission to serve those assets.
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-zinc-800">
              <h2 className="text-base sm:text-lg font-extrabold text-[#FFF33D]">
                3. Acceptable Hosting Policy
              </h2>
              <p>
                Users may not upload phishing pages, malware, executable payloads, or unlawful content to the Samad Expo hosting service. Violations result in immediate suspension.
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-zinc-800">
              <h2 className="text-base sm:text-lg font-extrabold text-[#FFF33D]">
                4. Contact Legal Desk
              </h2>
              <p>
                For questions regarding these terms, write to{" "}
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
