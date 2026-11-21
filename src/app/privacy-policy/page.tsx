import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Samad Expo",
  description:
    "Privacy Policy and data protection practices at Samad Expo.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-slate-500 flex items-center gap-2"
        >
          <Link href="/" className="hover:text-slate-900 font-medium">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">Privacy Policy</span>
        </nav>

        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-[#FFF33D]/25 text-black font-extrabold text-[11px] uppercase border border-black/15">
            Data Protection &amp; Privacy
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-950">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-600">
            Effective Date: November 2026 • Samad Expo
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 p-6 sm:p-8 bg-white space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-sm">
          <section className="space-y-2">
            <h2 className="text-base font-black text-slate-950">
              1. Information We Collect
            </h2>
            <p>
              Samad Expo collects only the minimum personal information
              necessary to respond to corporate inquiries, partnership requests,
              and website analytics:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Contact Details:</strong> Full name, email address,
                optional phone number, and organization name provided via our
                contact or partnership forms.
              </li>
              <li>
                <strong>Inquiry Content:</strong> Project briefs, messages, and
                business communication submitted voluntarily by visitors.
              </li>
              <li>
                <strong>Basic Page Analytics:</strong> Anonymous page-view paths
                and referrer hosts used strictly to improve our digital
                ecosystem.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-slate-950">
              2. How We Use Information
            </h2>
            <p>
              Submitted contact information is used solely to review and respond
              to business inquiries, partnership proposals, career applications,
              and corporate communications. We never sell or rent visitor data
              to third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-slate-950">
              3. Access Control &amp; Security
            </h2>
            <p>
              Administrative systems and corporate records are protected by
              server-side authentication and role-based access controls.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-slate-950">
              4. Your Privacy Rights
            </h2>
            <p>
              You may request access to, correction of, or deletion of any
              inquiry details you have submitted by reaching out via our{" "}
              <Link href="/contact" className="font-bold text-black underline font-bold">
                Contact Us
              </Link>{" "}
              page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
