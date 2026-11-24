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
  Sparkles,
  Globe,
  Layers,
  Cpu,
  ShieldCheck,
  Phone,
  Mail,
  Zap,
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
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [aboutDropdown, setAboutDropdown] = useState(false);

  // Exclude admin pages only
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Handle scroll detection for dynamic shadow and blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_4px_24px_rgba(15,23,42,0.06)] border-b border-slate-100 py-2.5"
          : "bg-white/90 backdrop-blur-sm border-b border-slate-100/80 py-3.5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Logo size="md" showTagline />

          {/* Desktop Navigation - Athenura Style */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-semibold text-slate-700"
          >
            {/* Home */}
            <Link
              href="/"
              className={`px-3.5 py-2 rounded-full transition-all duration-200 ${
                isHome
                  ? "bg-cyan-50 text-teal-800 font-bold shadow-xs"
                  : "hover:text-teal-700 hover:bg-slate-50"
              }`}
            >
              Home
            </Link>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdown(true)}
              onMouseLeave={() => setServicesDropdown(false)}
            >
              <Link
                href="/corporate-services"
                className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-full transition-all duration-200 ${
                  pathname?.startsWith("/corporate-services") || pathname?.startsWith("/services")
                    ? "bg-cyan-50 text-teal-800 font-bold shadow-xs"
                    : "hover:text-teal-700 hover:bg-slate-50"
                }`}
              >
                <span>Services</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesDropdown ? "rotate-180 text-teal-600" : "text-slate-400"}`} />
              </Link>

              {servicesDropdown && (
                <div className="absolute top-full left-0 pt-2 w-80 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
                      Enterprise Solutions
                    </div>
                    <Link
                      href="/corporate-services"
                      onClick={() => setServicesDropdown(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-teal-700">Custom Software & Web Apps</div>
                        <div className="text-[11px] text-slate-500">Tailored digital systems & modern architectures</div>
                      </div>
                    </Link>

                    <Link
                      href="/dashboard"
                      onClick={() => setServicesDropdown(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0 group-hover:bg-cyan-600 group-hover:text-white transition">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-cyan-700">Instant Website Hosting</div>
                        <div className="text-[11px] text-slate-500">Automated Git & zip edge deployment in &lt; 3s</div>
                      </div>
                    </Link>

                    <Link
                      href="/ecosystem-search?q=api"
                      onClick={() => setServicesDropdown(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-amber-700">MCP Protocol & AI API</div>
                        <div className="text-[11px] text-slate-500">Model Context Protocol for AI integrations</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Portfolio / Projects */}
            <Link
              href="/websites"
              className={`px-3.5 py-2 rounded-full transition-all duration-200 ${
                pathname === "/websites" || pathname?.startsWith("/portfolio")
                  ? "bg-cyan-50 text-teal-800 font-bold shadow-xs"
                  : "hover:text-teal-700 hover:bg-slate-50"
              }`}
            >
              Projects &amp; Tools
            </Link>

            {/* Businesses */}
            <Link
              href="/businesses"
              className={`px-3.5 py-2 rounded-full transition-all duration-200 ${
                pathname?.startsWith("/businesses") || pathname?.startsWith("/corporate")
                  ? "bg-cyan-50 text-teal-800 font-bold shadow-xs"
                  : "hover:text-teal-700 hover:bg-slate-50"
              }`}
            >
              Ventures
            </Link>

            {/* About Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setAboutDropdown(true)}
              onMouseLeave={() => setAboutDropdown(false)}
            >
              <Link
                href="/about-company"
                className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-full transition-all duration-200 ${
                  pathname?.startsWith("/about") || pathname?.startsWith("/founder") || pathname?.startsWith("/careers")
                    ? "bg-cyan-50 text-teal-800 font-bold shadow-xs"
                    : "hover:text-teal-700 hover:bg-slate-50"
                }`}
              >
                <span>About</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${aboutDropdown ? "rotate-180 text-teal-600" : "text-slate-400"}`} />
              </Link>

              {aboutDropdown && (
                <div className="absolute top-full left-0 pt-2 w-64 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="rounded-2xl border border-slate-100 bg-white p-2.5 shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
                    <Link
                      href="/about-company"
                      onClick={() => setAboutDropdown(false)}
                      className="block px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 hover:text-teal-700 transition"
                    >
                      Corporate Profile &amp; Mission
                    </Link>
                    <Link
                      href="/founder"
                      onClick={() => setAboutDropdown(false)}
                      className="block px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 hover:text-teal-700 transition"
                    >
                      Founder &amp; Leadership
                    </Link>
                    <Link
                      href="/careers"
                      onClick={() => setAboutDropdown(false)}
                      className="block px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 hover:text-teal-700 transition"
                    >
                      Careers &amp; Opportunities
                    </Link>
                    <Link
                      href="/partnerships"
                      onClick={() => setAboutDropdown(false)}
                      className="block px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 hover:text-teal-700 transition"
                    >
                      Partnership Ecosystem
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* FAQ */}
            <Link
              href="/faq"
              className={`px-3.5 py-2 rounded-full transition-all duration-200 ${
                pathname === "/faq"
                  ? "bg-cyan-50 text-teal-800 font-bold shadow-xs"
                  : "hover:text-teal-700 hover:bg-slate-50"
              }`}
            >
              FAQs
            </Link>

            {/* Direct Contact */}
            <Link
              href="/contact"
              className={`px-3.5 py-2 rounded-full transition-all duration-200 ${
                pathname === "/contact"
                  ? "bg-cyan-50 text-teal-800 font-bold shadow-xs"
                  : "hover:text-teal-700 hover:bg-slate-50"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Search */}
            <button
              type="button"
              onClick={() => setSearchOpen((prev) => !prev)}
              aria-label="Search Ecosystem"
              className="p-2.5 rounded-full border border-slate-200 bg-slate-50/80 text-slate-600 hover:text-teal-700 hover:bg-white hover:border-teal-300 transition-all duration-200 shadow-xs cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Authentication Control */}
            <HeaderAuthControl />

            {/* High-Contrast Athenura Contact Pill Button */}
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-slate-950 hover:bg-teal-700 text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Contact Us</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden p-2.5 rounded-full border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 transition cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Expandable Instant Search Bar */}
        {searchOpen && (
          <div className="pt-3 pb-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl max-w-2xl mx-auto"
            >
              <Search className="w-4 h-4 text-teal-600 ml-2 shrink-0" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search websites, tools, business divisions, APIs..."
                className="flex-1 bg-transparent px-2 py-1.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-950 text-white hover:bg-teal-700 text-xs font-bold tracking-wider uppercase transition cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white/98 backdrop-blur-xl px-5 py-6 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <nav aria-label="Mobile Navigation" className="grid gap-2">
            {[
              { label: "Home", href: "/" },
              { label: "Corporate Services", href: "/corporate-services" },
              { label: "Instant Hosting & Deploy", href: "/dashboard" },
              { label: "Projects & Tools Showcase", href: "/websites" },
              { label: "Business Divisions", href: "/businesses" },
              { label: "About Samad Expo", href: "/about-company" },
              { label: "Founder & Leadership", href: "/founder" },
              { label: "Careers & Culture", href: "/careers" },
              { label: "Ecosystem Search", href: "/ecosystem-search" },
              { label: "Frequently Asked Questions", href: "/faq" },
              { label: "Contact Central Headquarters", href: "/contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  pathname === item.href
                    ? "bg-cyan-50 text-teal-800 font-bold"
                    : "text-slate-800 hover:bg-slate-50 hover:text-teal-700"
                }`}
              >
                <span>{item.label}</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </Link>
            ))}
          </nav>

          <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-950 hover:bg-teal-700 text-white text-xs font-bold uppercase tracking-wider transition shadow-sm"
            >
              <span>Get In Touch</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
              <Mail className="w-3.5 h-3.5 text-teal-600" />
              <span>officialaadhakh@gmail.com</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
