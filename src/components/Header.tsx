"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  Menu,
  Search,
  X,
  ArrowUpRight,
  Globe,
  Cpu,
  Mail,
  Zap,
  Calculator,
  FileCode2,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { HeaderAuthControl } from "@/components/HeaderAuthControl";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toolsDropdown, setToolsDropdown] = useState(false);
  const [aboutDropdown, setAboutDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard")) {
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

  const isHome = pathname === "/";

  const navPillClass = (active: boolean) =>
    `whitespace-nowrap px-3.5 py-2 rounded-full text-[13px] font-bold transition-all duration-200 inline-flex items-center gap-1 ${
      active
        ? "bg-[#FFF33D] text-zinc-950 font-extrabold shadow-[0_0_20px_rgba(255,243,61,0.35)]"
        : "text-zinc-300 hover:text-[#FFF33D] hover:bg-white/5"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-t-[3px] border-t-[#FFF33D] ${
        isScrolled
          ? "bg-[#060608]/95 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] border-b border-zinc-800/90 py-2.5"
          : "bg-[#060608]/90 backdrop-blur-md border-b border-zinc-800/60 py-3"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="shrink-0">
            <Logo size="md" showTagline inverted />
          </div>

          {/* Desktop Navigation — Single-Line Precision */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-1"
          >
            <Link href="/" className={navPillClass(isHome)}>
              Home
            </Link>

            {/* Live Tools Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setToolsDropdown(true)}
              onMouseLeave={() => setToolsDropdown(false)}
            >
              <Link
                href="/websites"
                className={navPillClass(
                  Boolean(
                    pathname?.startsWith("/websites") ||
                      pathname?.startsWith("/portfolio")
                  )
                )}
              >
                <span>Live Tools</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    toolsDropdown ? "rotate-180 text-[#FFF33D]" : "text-zinc-400"
                  }`}
                />
              </Link>

              {toolsDropdown && (
                <div className="absolute top-full left-0 pt-2 w-80 z-50">
                  <div className="rounded-2xl border border-[#FFF33D]/25 bg-[#0C0C10]/98 backdrop-blur-xl p-2.5 shadow-[0_24px_60px_rgba(0,0,0,0.9)]">
                    <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFF33D]/70 px-3 py-1.5">
                      Directory &amp; Instant Hosting
                    </div>

                    <Link
                      href="/websites"
                      onClick={() => setToolsDropdown(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#FFF33D] text-zinc-950 flex items-center justify-center shrink-0">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#FFF33D]">
                          Public Websites Directory
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          Browse all live platforms &amp; hosted sites
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/websites/mdk-chrono-age-calculator"
                      onClick={() => setToolsDropdown(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-[#FFF33D] flex items-center justify-center shrink-0 group-hover:bg-[#FFF33D] group-hover:text-black">
                        <Calculator className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#FFF33D]">
                          MDK Chrono Age Calculator
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          Exact chronological age &amp; milestone engine
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/websites/mdk-convertor"
                      onClick={() => setToolsDropdown(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-[#FFF33D] flex items-center justify-center shrink-0 group-hover:bg-[#FFF33D] group-hover:text-black">
                        <FileCode2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#FFF33D]">
                          MDK Unit &amp; Media Convertor
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          Browser-based conversion utility
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/ecosystem-search?q=api"
                      onClick={() => setToolsDropdown(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-[#FFF33D] flex items-center justify-center shrink-0 group-hover:bg-[#FFF33D] group-hover:text-black">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#FFF33D]">
                          Search Ecosystem &amp; MCP API
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          Find tools, services &amp; AI endpoints
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/dashboard"
              className={navPillClass(Boolean(pathname?.startsWith("/dashboard")))}
            >
              <Zap className="w-3.5 h-3.5 text-[#FFF33D]" />
              <span>Hosting</span>
            </Link>

            <Link
              href="/corporate-services"
              className={navPillClass(
                Boolean(
                  pathname?.startsWith("/corporate-services") ||
                    pathname?.startsWith("/services")
                )
              )}
            >
              Services
            </Link>

            {/* About Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setAboutDropdown(true)}
              onMouseLeave={() => setAboutDropdown(false)}
            >
              <Link
                href="/about-company"
                className={navPillClass(
                  Boolean(
                    pathname?.startsWith("/about") ||
                      pathname?.startsWith("/founder") ||
                      pathname?.startsWith("/careers") ||
                      pathname?.startsWith("/partnerships")
                  )
                )}
              >
                <span>About</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    aboutDropdown ? "rotate-180 text-[#FFF33D]" : "text-zinc-400"
                  }`}
                />
              </Link>

              {aboutDropdown && (
                <div className="absolute top-full left-0 pt-2 w-60 z-50">
                  <div className="rounded-2xl border border-[#FFF33D]/25 bg-[#0C0C10]/98 backdrop-blur-xl p-2 shadow-[0_24px_60px_rgba(0,0,0,0.9)]">
                    <Link
                      href="/about-company"
                      onClick={() => setAboutDropdown(false)}
                      className="block px-3.5 py-2.5 rounded-xl text-xs font-bold text-zinc-300 hover:bg-white/5 hover:text-[#FFF33D] transition"
                    >
                      Company Profile &amp; Vision
                    </Link>
                    <Link
                      href="/founder"
                      onClick={() => setAboutDropdown(false)}
                      className="block px-3.5 py-2.5 rounded-xl text-xs font-bold text-zinc-300 hover:bg-white/5 hover:text-[#FFF33D] transition"
                    >
                      Founder &mdash; Sabir Usmani
                    </Link>
                    <Link
                      href="/careers"
                      onClick={() => setAboutDropdown(false)}
                      className="block px-3.5 py-2.5 rounded-xl text-xs font-bold text-zinc-300 hover:bg-white/5 hover:text-[#FFF33D] transition"
                    >
                      Careers &amp; Opportunities
                    </Link>
                    <Link
                      href="/partnerships"
                      onClick={() => setAboutDropdown(false)}
                      className="block px-3.5 py-2.5 rounded-xl text-xs font-bold text-zinc-300 hover:bg-white/5 hover:text-[#FFF33D] transition"
                    >
                      Partnerships &amp; Alliances
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/faq" className={navPillClass(pathname === "/faq")}>
              FAQ
            </Link>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen((prev) => !prev)}
              aria-label="Search Ecosystem"
              className="w-9 h-9 rounded-full border border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:text-[#FFF33D] hover:border-[#FFF33D]/60 flex items-center justify-center transition-all cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
            </button>

            <HeaderAuthControl />

            <Link
              href="/contact"
              className="btn-3d-black hidden sm:inline-flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-xs font-extrabold tracking-wide shrink-0"
            >
              <span>Contact</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden w-9 h-9 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-200 hover:text-[#FFF33D] flex items-center justify-center transition cursor-pointer shrink-0"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="pt-3 pb-1">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 rounded-2xl border border-[#FFF33D]/30 bg-zinc-950 p-1.5 shadow-2xl max-w-2xl mx-auto"
            >
              <Search className="w-4 h-4 text-[#FFF33D] ml-2.5 shrink-0" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search websites, live tools, hosting, or services..."
                className="flex-1 bg-transparent px-2 py-1.5 text-sm text-white outline-none placeholder:text-zinc-500"
                autoFocus
              />
              <button
                type="submit"
                className="btn-3d-yellow px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-800 bg-[#08080B] px-5 py-6 shadow-2xl">
          <nav aria-label="Mobile Navigation" className="grid gap-1.5">
            {[
              { label: "Home", href: "/" },
              { label: "Instant Website Hosting", href: "/dashboard" },
              { label: "Live Tools & Directory", href: "/websites" },
              { label: "Services & Capabilities", href: "/corporate-services" },
              { label: "About Samad Expo", href: "/about-company" },
              { label: "Founder — Sabir Usmani", href: "/founder" },
              { label: "Careers", href: "/careers" },
              { label: "Partnerships", href: "/partnerships" },
              { label: "Ecosystem Search", href: "/ecosystem-search" },
              { label: "FAQ", href: "/faq" },
              { label: "Contact Us", href: "/contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition ${
                  pathname === item.href
                    ? "bg-[#FFF33D] text-zinc-950"
                    : "text-zinc-300 hover:bg-white/5 hover:text-[#FFF33D]"
                }`}
              >
                <span>{item.label}</span>
                <ArrowUpRight className="w-4 h-4 opacity-60" />
              </Link>
            ))}
          </nav>

          <div className="mt-5 pt-4 border-t border-zinc-800 space-y-3">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-3d-yellow w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider"
            >
              <span>Contact Headquarters</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <div className="flex items-center justify-center gap-2 text-xs text-zinc-400 font-medium">
              <Mail className="w-3.5 h-3.5 text-[#FFF33D]" />
              <span>officialaadhakh@gmail.com</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
