import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Terms and Conditions | Samad Expo",
  description:
    "Terms and Conditions governing the use of the Samad Expo corporate website and digital ecosystem directory.",
};

export default function TermsPage() {
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
          <span className="text-slate-900 font-bold">Terms &amp; Conditions</span>
        </nav>

        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-[#FFF33D]/25 text-black font-extrabold text-[11px] uppercase border border-black/15">
            Legal Agreement
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-950">
            Terms and Conditions
          </h1>
          <p className="text-xs text-slate-600">
            Effective Date: November 2026 • Samad Expo
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 p-6 sm:p-8 bg-white space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-sm">
          <section className="space-y-2">
            <h2 className="text-base font-black text-slate-950">
              1. General Use of the Corporate Website
            </h2>
            <p>
              By accessing the Samad Expo corporate website and digital
              ecosystem directory, you agree to use this website lawfully and
              provide accurate information when submitting business inquiries or
              partnership requests.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-slate-950">
              2. Intellectual Property &amp; Brand Ownership
            </h2>
            <p>
              All trademarks, brand identities, copy, designs, and original
              materials published on this site are owned by or licensed to MD
              Enterprises. Individual websites and web applications listed in
              our ecosystem maintain their own independent branding and terms of
              use.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-slate-950">
              3. Ecosystem Directory &amp; External Platforms
            </h2>
            <p>
              This website provides direct links to independent web applications
              and platforms owned or operated under Samad Expo. Usage of
              each individual platform is governed by that platform&apos;s own
              published terms and policies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-slate-950">
              4. Contact &amp; Inquiries
            </h2>
            <p>
              For questions regarding these terms, please reach out through our{" "}
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
