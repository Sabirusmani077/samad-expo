import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Samad Expo",
  description:
    "Privacy Policy and data protection practices at Samad Expo.",
};

export default function PrivacyPolicyPage() {
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
          <span className="text-slate-900 font-bold">Privacy Policy</span>
        </nav>

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-50 text-teal-800 text-xs font-bold uppercase tracking-wider border border-cyan-100">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Data Protection &amp; Governance</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Privacy Policy
          </h1>

          <p className="text-xs text-slate-500 font-medium">
            Effective Date: November 2026 &bull; Samad Expo Digital Ecosystem
          </p>
        </div>

        {/* Content Card */}
        <div className="athenura-card p-8 sm:p-12 space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-950">
              1. Information We Collect
            </h2>
            <p>
              Samad Expo collects only the minimum personal information necessary to respond to corporate inquiries, partnership proposals, and website hosting services:
            </p>
            <ul className="space-y-2 pl-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Contact Details:</strong> Full name, email address, optional phone number, and organization name provided via our contact or consultation forms.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Inquiry Content:</strong> Project briefs, technical specifications, and messages submitted voluntarily by visitors.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Anonymous Telemetry:</strong> Anonymized page-view paths and server performance metrics used strictly to improve edge routing and uptime.</span>
              </li>
            </ul>
          </section>

          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-base sm:text-lg font-bold text-slate-950">
              2. How We Use Information
            </h2>
            <p>
              Submitted information is used exclusively to fulfill user requests, deploy website assets, review partnership proposals, and provide executive customer support. We never sell, rent, or trade visitor data to third-party brokers.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-base sm:text-lg font-bold text-slate-950">
              3. Cyber Security &amp; Data Hardening
            </h2>
            <p>
              All customer sessions, authentication credentials, and database records are cryptographically secured in accordance with our 20/20 verified cyber audit, including TLS 1.3 encryption, Argon2 password hashing, and token-bucket rate limiters.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-base sm:text-lg font-bold text-slate-950">
              4. Contact Privacy Desk
            </h2>
            <p>
              To request access, correction, or deletion of your information, please contact our data governance desk directly at{" "}
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
