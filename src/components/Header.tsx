"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  Menu,
  Search,
  X,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { HeaderAuthControl } from "@/components/HeaderAuthControl";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (
    pathname === "/" ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/websites") ||
    pathname?.startsWith("/ecosystem-search")
  ) {
    return null;
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    setSearchOpen(false);
    setMobileMenuOpen(false);
    if (q.length >= 2) {
      router.push(`/ecosystem-search?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/ecosystem-search");
    }
  };

  const isDark = pathname?.startsWith("/websites") || pathname?.startsWith("/ecosystem-search");

  return (
    <header
      data-site-theme="premium"
      className={`sticky top-0 z-40 transition-colors ${
        isDark
          ? "border-b border-zinc-800 bg-[#080808]/95 backdrop-blur-xl text-white shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
          : "site-header"
      }`}
    >
      {/* Main Navigation Bar */}
      <div className="site-header-inner mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between gap-6">
          <Logo size="md" showTagline inverted={isDark} />

          {/* Desktop Navigation */}
          <nav
            aria-label="Primary Navigation"
            className={`site-primary-nav hidden lg:flex items-center gap-7 text-base font-bold ${
              isDark ? "text-zinc-300" : "text-slate-700"
            }`}
          >
            <Link
              href="/"
              className={`py-1 transition-colors border-b-2 border-transparent ${
                isDark ? "hover:text-white" : "hover:text-slate-950"
              }`}
            >
              Home
            </Link>

            <Link
              href="/websites"
              className={`py-1 transition-colors border-b-2 ${
                pathname === "/websites"
                  ? isDark
                    ? "border-[#FFF33D] text-[#FFF33D] font-bold"
                    : "border-slate-950 text-slate-950 font-bold"
                  : isDark
                  ? "border-transparent hover:text-white"
                  : "border-transparent hover:text-slate-950"
              }`}
            >
              Public Directory
            </Link>

            <Link
              href="/dashboard"
              className={`py-1 transition-colors border-b-2 ${
                pathname?.startsWith("/dashboard")
                  ? isDark
                    ? "border-[#FFF33D] text-[#FFF33D] font-bold"
                    : "border-slate-950 text-slate-950 font-bold"
                  : isDark
                  ? "border-transparent hover:text-white"
                  : "border-transparent hover:text-slate-950"
              }`}
            >
              Hosting &amp; Deploy
            </Link>

            <Link
              href="/corporate-services"
              className={`py-1 transition-colors border-b-2 ${
                pathname?.startsWith("/corporate-services")
                  ? isDark
                    ? "border-[#FFF33D] text-[#FFF33D] font-bold"
                    : "border-slate-950 text-slate-950 font-bold"
                  : isDark
                  ? "border-transparent hover:text-white"
                  : "border-transparent hover:text-slate-950"
              }`}
            >
              Services
            </Link>

            {/* About Dropdown */}
            <div className="relative group py-2">
              <Link
                href="/about-company"
                className={`inline-flex items-center gap-1 py-1 transition-colors border-b-2 ${
                  pathname?.startsWith("/about-company") || pathname?.startsWith("/founder")
                    ? isDark
                      ? "border-[#FFF33D] text-[#FFF33D] font-bold"
                      : "border-slate-950 text-slate-950 font-bold"
                    : isDark
                    ? "border-transparent hover:text-white"
                    : "border-transparent hover:text-slate-950"
                }`}
              >
                <span>About</span>
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
              </Link>

              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute left-0 top-full pt-1 w-56 z-50">
                <div
                  className={`rounded-2xl border p-2 space-y-1 ${
                    isDark
                      ? "bg-zinc-950 border-zinc-800 shadow-2xl text-white"
                      : "bg-white border-slate-200 shadow-xl text-slate-900"
                  }`}
                >
                  <Link
                    href="/about-company"
                    className={`block px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                      isDark
                        ? "text-zinc-200 hover:bg-zinc-900 hover:text-white"
                        : "text-slate-900 hover:bg-[#FFFDE0]"
                    }`}
                  >
                    About Samad Expo
                  </Link>
                  <Link
                    href="/founder"
                    className={`block px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                      isDark
                        ? "text-zinc-200 hover:bg-zinc-900 hover:text-white"
                        : "text-slate-900 hover:bg-[#FFFDE0]"
                    }`}
                  >
                    Founder &amp; Owner
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/contact"
              className={`py-1 transition-colors border-b-2 ${
                pathname?.startsWith("/contact")
                  ? isDark
                    ? "border-[#FFF33D] text-[#FFF33D] font-bold"
                    : "border-slate-950 text-slate-950 font-bold"
                  : isDark
                  ? "border-transparent hover:text-white"
                  : "border-transparent hover:text-slate-950"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setSearchOpen((prev) => !prev)}
              aria-label="Search ecosystem"
              className={`p-2.5 rounded-xl border transition-colors ${
                isDark
                  ? "border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:border-zinc-700"
                  : "border-slate-200 bg-white text-slate-700 hover:text-black hover:border-black"
              }`}
            >
              <Search className="w-4 h-4" />
            </button>

            <HeaderAuthControl />

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className={`lg:hidden p-2.5 rounded-xl border transition-colors ${
                isDark
                  ? "border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
                  : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Expandable Ecosystem Search Bar */}
        {searchOpen && (
          <div className="pb-4">
            <form
              onSubmit={handleSearchSubmit}
              className={`flex items-center gap-2 rounded-2xl border p-2 shadow-2xl max-w-2xl mx-auto ${
                isDark
                  ? "border-zinc-800 bg-zinc-950 text-white"
                  : "border-slate-200 bg-white shadow-lg text-slate-900"
              }`}
            >
              <Search className="w-4 h-4 text-zinc-400 ml-2 shrink-0" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search websites, business divisions, and services..."
                className={`flex-1 bg-transparent px-2 py-1.5 text-sm outline-none ${
                  isDark ? "text-white placeholder:text-zinc-500" : "text-slate-900"
                }`}
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#FFF33D] text-black text-xs font-extrabold border border-black/15 hover:bg-black hover:text-[#FFF33D] transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden border-t px-4 py-5 shadow-2xl ${
            isDark ? "border-zinc-800 bg-zinc-950 text-white" : "border-slate-200 bg-white"
          }`}
        >
          <nav aria-label="Mobile Navigation" className="grid gap-1.5">
            {[
              { label: "Home", href: "/" },
              { label: "Public Directory", href: "/websites" },
              { label: "Hosting & Deploy", href: "/dashboard" },
              { label: "Services & Solutions", href: "/corporate-services" },
              { label: "About Samad Expo", href: "/about-company" },
              { label: "Founder & Owner", href: "/founder" },
              { label: "Ecosystem Search", href: "/ecosystem-search" },
              { label: "Contact Us", href: "/contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isDark
                    ? "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                    : "text-slate-800 hover:bg-[#FFFDE0] hover:text-black"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
