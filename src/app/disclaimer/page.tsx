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
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-slate-900 font-medium">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">Disclaimer</span>
        </nav>

        <section className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-md bg-[#FFF33D] text-black font-extrabold font-extrabold text-xs uppercase tracking-wider border border-slate-900/20">
            Legal & Regulatory
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 leading-tight">
            Corporate Disclaimer
          </h1>
          <p className="text-xs text-slate-400">Last updated: November 2026</p>
        </section>

        <div className="space-y-6 text-sm text-slate-700 leading-relaxed border-t border-slate-200 pt-6">
          <div className="space-y-2">
            <h2 className="text-base font-black text-slate-950">1. Corporate Brand & Ecosystem Ownership</h2>
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
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-black text-slate-950">2. External Links & Independent Platforms</h2>
            <p>
              This corporate website provides links and directory profiles enabling visitors to navigate
              directly to independent websites and web applications operating under Samad Expo. Users are
              advised that usage and engagements executed on individual platforms are subject to the specific
              terms and policies of those respective platforms.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-black text-slate-950">3. Information Accuracy & Dynamic Listings</h2>
            <p>
              All information provided on Samad Expo is published in good faith for general informational
              and corporate representation purposes. Product specifications, operational statuses (Live, Under
              Development, Coming Soon), and service offerings are subject to dynamic updates and changes as
              platforms evolve.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-black text-slate-950">4. Limitation of Liability</h2>
            <p>
              Under no circumstances shall Samad Expo, its founder, officers, or affiliates be liable for
              any indirect, incidental, or consequential damages resulting from the use of or inability to use
              any of the external platforms or third-party links referenced on this directory.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-black text-slate-950">5. Contact Information</h2>
            <p>
              For legal inquiries, brand usage permissions, or corporate disclosures, please contact:
            </p>
            <p className="font-semibold text-slate-900">
              Samad Expo Corporate Legal Desk
              <br />
              Email: contact@mdenterprises.in
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
