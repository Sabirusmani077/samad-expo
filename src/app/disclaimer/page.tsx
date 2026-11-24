import React from "react";
import Link from "next/link";
import { ShieldCheck, Info } from "lucide-react";

export const metadata = {
  title: "Corporate Disclaimer | Samad Expo",
  description:
    "Legal disclaimer, brand ownership disclosure, and terms of digital ecosystem participation for Samad Expo.",
};

export default function DisclaimerPage() {
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
          <span className="text-slate-900 font-bold">Corporate Disclaimer</span>
        </nav>

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-50 text-teal-800 text-xs font-bold uppercase tracking-wider border border-cyan-100">
            <Info className="w-3.5 h-3.5 text-teal-600" />
            <span>Legal &amp; Regulatory Disclosures</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Corporate Disclaimer
          </h1>

          <p className="text-xs text-slate-500 font-medium">
            Effective Date: November 2026 &bull; Samad Expo Digital Ecosystem
          </p>
        </div>

        {/* Content Card */}
        <div className="athenura-card p-8 sm:p-12 space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-950">
              1. Corporate Brand &amp; Ecosystem Ownership
            </h2>
            <p>
              Samad Expo is the parent corporate brand and the central ownership identity of all associated
              websites, web applications, digital platforms, products, and services listed within this website
              or its digital directory.
            </p>
            <p>
              While Samad Expo provides strategic guidance, administrative oversight, and shared
              governance, each individual platform, independent website, and business division maintains its
              own domain, specialized terms of service, and operational branding.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-base sm:text-lg font-bold text-slate-950">
              2. External Links &amp; Independent Platforms
            </h2>
            <p>
              This corporate website provides links and directory profiles enabling visitors to navigate
              directly to independent websites and web applications operating under Samad Expo. Users are
              advised that usage and engagements executed on individual platforms are subject to the specific
              terms and policies of those respective platforms.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-base sm:text-lg font-bold text-slate-950">
              3. Information Accuracy &amp; Dynamic Listings
            </h2>
            <p>
              All information provided on Samad Expo is published in good faith for general informational
              and corporate representation purposes. Product specifications, operational statuses (Live, Under
              Development, Coming Soon), and service offerings are subject to dynamic updates and changes as
              platforms evolve.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-base sm:text-lg font-bold text-slate-950">
              4. Limitation of Liability
            </h2>
            <p>
              Under no circumstances shall Samad Expo, its founder, officers, or affiliates be liable for
              any indirect, incidental, or consequential damages resulting from the use of or inability to use
              any of the external platforms or third-party links referenced on this directory.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-base sm:text-lg font-bold text-slate-950">
              5. Contact Information
            </h2>
            <p>
              For legal inquiries, brand usage permissions, or corporate disclosures, please contact:
            </p>
            <p className="font-semibold text-slate-900">
              Samad Expo Corporate Legal Desk
              <br />
              Email: <a href="mailto:officialaadhakh@gmail.com" className="text-teal-700 hover:underline">officialaadhakh@gmail.com</a>
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
