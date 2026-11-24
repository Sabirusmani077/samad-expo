import React from "react";
import Link from "next/link";
import { FileText, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Terms and Conditions | Samad Expo",
  description:
    "Terms and Conditions governing the use of the Samad Expo corporate website and digital ecosystem directory.",
};

export default function TermsPage() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen py-14 sm:py-20 text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-slate-500 flex items-center gap-2"
        >
          <Link href="/" className="hover:text-teal-700 font-semibold transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">Terms &amp; Conditions</span>
        </nav>

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-50 text-teal-800 text-xs font-bold uppercase tracking-wider border border-cyan-100">
            <FileText className="w-3.5 h-3.5 text-teal-600" />
            <span>Legal Agreement</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Terms and Conditions
          </h1>

          <p className="text-xs text-slate-500 font-medium">
            Effective Date: November 2026 &bull; Samad Expo
          </p>
        </div>

        {/* Content Card */}
        <div className="athenura-card p-8 sm:p-12 space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-950">
              1. General Use of the Corporate Website
            </h2>
            <p>
              By accessing the Samad Expo corporate gateway, instant hosting portal, and digital directory, you agree to use the services lawfully and provide accurate credentials when establishing a developer account or deploying web tools.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-base sm:text-lg font-bold text-slate-950">
              2. Intellectual Property &amp; Brand Ownership
            </h2>
            <p>
              All trademarks, trade dress, original logos, and proprietary architecture published on this site are owned by Samad Expo. Individual tools and web applications hosted in our ecosystem retain their own independent rights and licenses.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-base sm:text-lg font-bold text-slate-950">
              3. Instant Hosting Acceptable Use Policy
            </h2>
            <p>
              Users deploying websites or applications via Samad Expo agree not to upload malicious software, phishing payloads, unauthorized proxy networks, or content violating regional or international cyber laws.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-base sm:text-lg font-bold text-slate-950">
              4. Contact Legal Desk
            </h2>
            <p>
              For legal inquiries regarding these terms, please contact executive administration at{" "}
              <a href="mailto:officialaadhakh@gmail.com" className="text-teal-700 font-bold hover:underline">
                officialaadhakh@gmail.com
              </a>.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
