"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X, Compass } from "lucide-react";
import { HeaderAuthControl } from "@/components/HeaderAuthControl";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard")) {
    return null;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    setSearchOpen(false);
    setMobileMenuOpen(false);
    router.push(`/ecosystem-search?q=${encodeURIComponent(trimmed)}`);
  };

  const navLinkClass = (active: boolean) =>
    `whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.16em] pb-1 transition-colors duration-200 border-b ${
      active
        ? "text-[#C10016] border-[#C10016]"
        : "text-[#1D1C1C] border-transparent hover:text-[#C10016]"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#E5DFD7]">
      {/* Tier 1: Left Utility Links · Centered Editorial Italic Wordmark · Right Minimal 1px Controls */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Left Utility Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#595959] min-w-[200px]">
          <span>Agra &middot; India</span>
          <Link href="/contact" className="hover:text-[#C10016] transition">
            Contact Us
          </Link>
          <Link href="/corporate-services" className="hover:text-[#C10016] transition">
            Services
          </Link>
        </div>

        {/* Left Menu Button (Mobile/Tablet) */}
        <div className="flex lg:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Open menu"
            className="p-2 text-[#1D1C1C] hover:text-[#C10016] transition cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 stroke-[1.5]" />
            ) : (
              <Menu className="w-5 h-5 stroke-[1.5]" />
            )}
          </button>
        </div>

        {/* Centered Signature Editorial Italic Wordmark */}
        <Link
          href="/"
          aria-label="Samad Expo Home"
          className="group flex items-center gap-2.5 shrink-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/primary-logo.png"
            alt="Samad Expo Emblem"
            className="h-7 w-7 object-contain opacity-90 group-hover:opacity-100 transition"
          />
          <span className="font-editorial-serif italic text-2xl sm:text-[1.95rem] leading-none text-[#1D1C1C] tracking-tight group-hover:text-[#C10016] transition-colors">
            Samad Expo
          </span>
        </Link>

        {/* Right Controls (Compact on mobile so zero overflow) */}
        <div className="flex items-center justify-end gap-2 sm:gap-3.5 min-w-0 lg:min-w-[200px]">
          <Link
            href="/websites"
            aria-label="Public Directory"
            title="Public Directory"
            className="hidden sm:inline-flex p-1.5 text-[#1D1C1C] hover:text-[#C10016] transition"
          >
            <Compass className="w-4 h-4 stroke-[1.5]" />
          </Link>

          <HeaderAuthControl />

          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Toggle Search"
            className="p-1.5 text-[#1D1C1C] hover:text-[#C10016] transition cursor-pointer lg:hidden"
          >
            <Search className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>
      </div>

      {/* Tier 2: Desktop Centered Category Bar (Pinned Clean Navigation Row) */}
      <div className="hidden lg:block border-t border-[#F0EBE4] bg-white">
        <nav
          aria-label="Main Navigation"
          className="mx-auto max-w-7xl px-6 h-11 flex items-center justify-center gap-7"
        >
          <Link href="/" className={navLinkClass(pathname === "/")}>
            Home
          </Link>
          <Link
            href="/dashboard"
            className={navLinkClass(Boolean(pathname?.startsWith("/dashboard")))}
          >
            Hosting Console
          </Link>
          <Link
            href="/websites"
            className={navLinkClass(Boolean(pathname?.startsWith("/websites")))}
          >
            Live Tools
          </Link>
          <Link
            href="/corporate-services"
            className={navLinkClass(
              Boolean(pathname?.startsWith("/corporate-services"))
            )}
          >
            Services
          </Link>
          <Link
            href="/portfolio"
            className={navLinkClass(Boolean(pathname?.startsWith("/portfolio")))}
          >
            Portfolio
          </Link>
          <Link
            href="/about-company"
            className={navLinkClass(
              Boolean(
                pathname?.startsWith("/about") ||
                  pathname?.startsWith("/careers") ||
                  pathname?.startsWith("/partnerships")
              )
            )}
          >
            The Maison
          </Link>
          <Link
            href="/blog"
            className={navLinkClass(Boolean(pathname?.startsWith("/blog")))}
          >
            News
          </Link>
          <Link
            href="/faq"
            className={navLinkClass(pathname === "/faq")}
          >
            FAQ
          </Link>

          <span className="h-3.5 w-[1px] bg-[#D5CEC5]" aria-hidden="true" />

          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Search Ecosystem"
            className="text-[#1D1C1C] hover:text-[#C10016] transition cursor-pointer"
          >
            <Search className="w-4 h-4 stroke-[1.5]" />
          </button>
        </nav>
      </div>

      {/* Hairline Search Bar Overlay */}
      {searchOpen && (
        <div className="border-t border-[#E5DFD7] bg-[#FAF7F2] px-4 py-4">
          <form
            onSubmit={handleSearch}
            className="mx-auto max-w-2xl flex items-center gap-3"
          >
            <Search className="w-4 h-4 text-[#595959] shrink-0" />
            <input
              type="search"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search live web tools, services, or hosted sites..."
              className="flex-1 py-1.5 bg-transparent border-b border-[#1D1C1C] text-xs font-medium text-[#1D1C1C] placeholder:text-[#767676] focus:border-[#C10016] outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-[#1D1C1C] hover:bg-[#C10016] text-white text-[10px] font-bold uppercase tracking-[0.2em] transition cursor-pointer shrink-0"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close Search"
              className="p-1 text-[#595959] hover:text-[#1D1C1C] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Gallery Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5DFD7] bg-white px-5 py-6 shadow-xl">
          <nav aria-label="Mobile Navigation" className="divide-y divide-[#F0EBE4]">
            {[
              { label: "Home", href: "/" },
              { label: "Hosting Console", href: "/dashboard" },
              { label: "Live Tools Directory", href: "/websites" },
              { label: "Our Services", href: "/corporate-services" },
              { label: "Portfolio", href: "/portfolio" },
              { label: "The Maison · About Us", href: "/about-company" },
              { label: "Careers", href: "/careers" },
              { label: "Partnerships", href: "/partnerships" },
              { label: "News & Announcements", href: "/blog" },
              { label: "FAQ", href: "/faq" },
              { label: "Contact Advisor", href: "/contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-3 text-xs font-bold uppercase tracking-[0.18em] transition ${
                  pathname === item.href
                    ? "text-[#C10016]"
                    : "text-[#1D1C1C] hover:text-[#C10016]"
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
