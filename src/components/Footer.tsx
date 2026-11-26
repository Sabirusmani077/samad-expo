"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const [dispatchEmail, setDispatchEmail] = useState("");

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard")) {
    return null;
  }

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    const target = dispatchEmail.trim();
    if (!target) {
      router.push("/contact");
      return;
    }
    router.push(`/contact?email=${encodeURIComponent(target)}`);
  };

  return (
    <footer className="bg-white text-[#1D1C1C] border-t border-[#E5DFD7]">
      {/* Tier 1: Centered Maison Newsletter / Dispatch Form (Cartier Flush Sharp Style) */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-14 text-center space-y-6 border-b border-[#E5DFD7]">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-[#1D1C1C]">
          Subscribe to Our Dispatch
        </h3>

        <form
          onSubmit={handleDispatch}
          className="mx-auto max-w-md flex flex-col sm:flex-row items-stretch sm:items-end justify-center gap-0"
        >
          <input
            type="email"
            value={dispatchEmail}
            onChange={(e) => setDispatchEmail(e.target.value)}
            placeholder="Email"
            aria-label="Email address"
            className="flex-1 py-2.5 px-3 bg-transparent border-b border-[#1D1C1C] font-editorial-serif italic text-base text-[#1D1C1C] placeholder:text-[#767676] focus:border-[#C10016] outline-none"
          />
          <button
            type="submit"
            className="px-7 py-3 bg-[#1D1C1C] hover:bg-[#C10016] text-white text-[11px] font-bold uppercase tracking-[0.22em] transition-colors cursor-pointer shrink-0"
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* Tier 2: 4-Column Architectural Uppercase Directory */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Client Care */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#1D1C1C]">
              Client Care
            </h4>
            <ul className="space-y-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#595959]">
              <li>
                <Link href="/contact" className="hover:text-[#C10016] transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href="tel:+919458204216"
                  className="hover:text-[#C10016] transition"
                >
                  Call Now: +91 94582 04216
                </a>
              </li>
              <li>
                <a
                  href="mailto:officialaadhakh@gmail.com"
                  className="hover:text-[#C10016] transition break-words"
                >
                  officialaadhakh@gmail.com
                </a>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#C10016] transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/ecosystem-search"
                  className="hover:text-[#C10016] transition"
                >
                  Ecosystem Index
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Our Company */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#1D1C1C]">
              Our Company
            </h4>
            <ul className="space-y-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#595959]">
              <li>
                <Link
                  href="/about-company"
                  className="hover:text-[#C10016] transition inline-flex items-center gap-1"
                >
                  <span>About Samad Expo</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="/corporate-services"
                  className="hover:text-[#C10016] transition"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:text-[#C10016] transition inline-flex items-center gap-1"
                >
                  <span>Careers</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="/partnerships"
                  className="hover:text-[#C10016] transition"
                >
                  Partnerships
                </Link>
              </li>
              <li>
                <Link
                  href="/corporate"
                  className="hover:text-[#C10016] transition"
                >
                  Corporate Overview
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal Area */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#1D1C1C]">
              Legal Area
            </h4>
            <ul className="space-y-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#595959]">
              <li>
                <Link href="/terms" className="hover:text-[#C10016] transition">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-[#C10016] transition"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  className="hover:text-[#C10016] transition"
                >
                  Disclaimer
                </Link>
              </li>
              <li>
                <a
                  href="https://maps.app.goo.gl/UnzqY6kZ3i2BRieKA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C10016] transition inline-flex items-center gap-1"
                >
                  <span>Bodla, Agra HQ</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Live Platforms */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#1D1C1C]">
              Digital Platforms
            </h4>
            <ul className="space-y-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#595959]">
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-[#C10016] transition"
                >
                  Hosting Console
                </Link>
              </li>
              <li>
                <Link
                  href="/websites"
                  className="hover:text-[#C10016] transition"
                >
                  Public Directory
                </Link>
              </li>
              <li>
                <Link
                  href="/portfolio"
                  className="hover:text-[#C10016] transition"
                >
                  Selected Work
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#C10016] transition">
                  News &amp; Releases
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tier 3: Maison Heritage Emblems */}
      <div className="border-t border-[#E5DFD7] py-10 px-4">
        <div className="mx-auto max-w-4xl flex flex-wrap items-center justify-center gap-10 sm:gap-16 text-center">
          <div className="space-y-0.5">
            <div className="font-editorial-serif italic text-lg text-[#1D1C1C]">
              Samad Cloud
            </div>
            <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#767676]">
              Instant /sites/ Engine
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="font-editorial-serif italic text-lg text-[#1D1C1C]">
              MCP Protocol v2
            </div>
            <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#767676]">
              JSON-RPC Gateway
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="font-editorial-serif italic text-lg text-[#1D1C1C]">
              Atelier Security
            </div>
            <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#767676]">
              20/20 Audited
            </div>
          </div>
        </div>
      </div>

      {/* Tier 4: Signature Cartier Crimson Red Bottom Legal Bar */}
      <div className="bg-[#C10016] text-white py-5 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-bold uppercase tracking-[0.18em]">
          <div className="flex flex-wrap items-center gap-4">
            <span>Maison Location: Bodla, Agra, India</span>
            <Link
              href="/websites"
              className="font-editorial-serif italic text-sm normal-case tracking-normal underline underline-offset-4 hover:text-white/80 transition"
            >
              Explore Platforms
            </Link>
          </div>
          <div>Copyright &copy; {new Date().getFullYear()} Samad Expo</div>
        </div>
      </div>
    </footer>
  );
}
