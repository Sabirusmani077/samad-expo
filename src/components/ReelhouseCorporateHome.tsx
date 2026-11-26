"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  UploadCloud,
  Globe,
  Monitor,
  Cpu,
  ShieldCheck,
  Search,
  ExternalLink,
  X,
} from "lucide-react";
import { publicWebsiteUrl } from "@/lib/corporate-public";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";
import { EntranceExperience } from "@/components/EntranceExperience";
import { AuthModal } from "@/components/AuthModal";
import {
  BusinessDivision,
  WebsiteListing,
  CorporateService,
  TeamMember,
  CompanyProfile,
  HostedProject,
} from "@/lib/types";

interface ReelhouseProps {
  profile: CompanyProfile | null;
  websites: WebsiteListing[];
  divisions: BusinessDivision[];
  services: CorporateService[];
  team: TeamMember[];
  hostedProjects?: HostedProject[];
}

interface UnifiedPlatformCard {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  liveUrl: string;
  profileHref: string;
  isHostedSite: boolean;
}

const showcaseChapters = [
  {
    eyebrow: "Chapter I · Cloud Architecture",
    title: "ZERO-FRICTION DEPLOYMENT",
    desc: "Upload static HTML packages or ZIP bundles cleanly and publish isolated public links in seconds.",
  },
  {
    eyebrow: "Chapter II · Security Engineering",
    title: "20/20 HARDENED DEFENSE",
    desc: "Server-side role validation, PBKDF2 authentication, and rate-limited forms across every edge route.",
  },
  {
    eyebrow: "Chapter III · Browser Utilities",
    title: "PRACTICAL DIGITAL SUITE",
    desc: "Chronographs, unit converters, and instant tools engineered for effortless execution inside any browser.",
  },
  {
    eyebrow: "Chapter IV · MCP Protocol v2",
    title: "AI-NATIVE DISCOVERY API",
    desc: "Structured JSON-RPC 2.0 gateway connecting ecosystem tools directly with automated agent workflows.",
  },
];

function useAnimatedCounter(target: number, start: boolean, durationMs = 1100) {
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (!start) return;
    if (target <= 0) {
      setValue(target);
      return;
    }
    const startTime = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.max(1, Math.round(ease * target)));
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [target, start, durationMs]);

  return value;
}

function gridColsClass(count: number): string {
  if (count <= 1) return "grid-cols-1 max-w-xl mx-auto";
  if (count === 2 || count === 4) return "grid-cols-1 md:grid-cols-2";
  return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
}

export function ReelhouseCorporateHome({
  profile,
  websites,
  services,
  hostedProjects = [],
}: ReelhouseProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const [toolSearch, setToolSearch] = useState("");
  const [projectCategory, setProjectCategory] = useState("all");
  const [previewSite, setPreviewSite] = useState<UnifiedPlatformCard | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [statsVisible, setStatsVisible] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [dragReveal, setDragReveal] = useState(38);
  const [cursorBrush, setCursorBrush] = useState({ x: 50, y: 50, active: false });

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress(Math.min(1, Math.max(0, window.scrollY / total)));
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Deduplicate real websites + non-personal public hosted projects (zero owner/founder exposure)
  const unifiedPlatforms = useMemo<UnifiedPlatformCard[]>(() => {
    const map = new Map<string, UnifiedPlatformCard>();

    for (const w of websites) {
      if (
        w.slug.includes("sabir") ||
        w.name.toLowerCase().includes("sabir")
      ) {
        continue;
      }
      const liveUrl = publicWebsiteUrl(w.url) || `/websites/${w.slug}`;
      map.set(w.slug, {
        id: w.id,
        name: w.name,
        slug: w.slug,
        category: w.category || "Web Applications",
        description:
          w.shortDescription ||
          w.description ||
          "Production web utility hosted in the Samad Expo ecosystem.",
        liveUrl,
        profileHref: `/websites/${w.slug}`,
        isHostedSite: false,
      });
    }

    for (const hp of hostedProjects) {
      if (
        hp.projectName.toLowerCase().includes("automated test platform") ||
        hp.projectName.toLowerCase().includes("sabir") ||
        hp.slug.includes("sabir") ||
        map.has(hp.slug)
      ) {
        continue;
      }
      map.set(hp.slug, {
        id: hp.id,
        name: hp.projectName,
        slug: hp.slug,
        category: "Hosted Sites",
        description:
          hp.description ||
          "Live static deployment hosted on Samad Expo cloud infrastructure.",
        liveUrl: `/sites/${hp.slug}`,
        profileHref: `/sites/${hp.slug}`,
        isHostedSite: true,
      });
    }

    return Array.from(map.values());
  }, [websites, hostedProjects]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(unifiedPlatforms.map((p) => p.category)));
    return ["all", ...cats];
  }, [unifiedPlatforms]);

  const filteredPlatforms = useMemo(() => {
    return unifiedPlatforms.filter((item) => {
      const matchesCat =
        projectCategory === "all" || item.category === projectCategory;
      const q = toolSearch.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [unifiedPlatforms, projectCategory, toolSearch]);

  // Smooth auto-dissolving chapter rotation
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const timer = setInterval(() => {
      setActiveChapter((prev) => (prev + 1) % showcaseChapters.length);
    }, 4400);
    return () => clearInterval(timer);
  }, []);

  // GSAP scroll-reveal choreography
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".hero-stagger", {
        y: 26,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "transform,opacity",
      });

      gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((section) => {
        gsap.from(section, {
          y: 30,
          opacity: 0,
          duration: 0.9,
          ease: "power2.out",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: section,
            start: "top 86%",
            once: true,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".photo-reveal").forEach((frame) => {
        gsap.fromTo(
          frame,
          { opacity: 0.3, scale: 0.96, filter: "blur(5px)" },
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.0,
            ease: "power2.out",
            clearProps: "filter,transform",
            scrollTrigger: {
              trigger: frame,
              start: "top 86%",
              once: true,
            },
          }
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // Stats Counter trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.25 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const livePlatformsCount = useAnimatedCounter(
    unifiedPlatforms.length,
    statsVisible
  );

  const coreValues =
    profile?.coreValues && profile.coreValues.length > 0
      ? profile.coreValues.slice(0, 4)
      : [
          {
            title: "Practical Innovation",
            description:
              "Precision web utilities and hosting systems solving everyday engineering needs cleanly.",
          },
          {
            title: "Reliability & Uptime",
            description:
              "Dependable routing, isolated preview containers, and continuous production availability.",
          },
          {
            title: "Simplicity & Speed",
            description:
              "Instant HTML & ZIP static cloud publishing without unnecessary setup barriers.",
          },
          {
            title: "Transparent Standards",
            description:
              "Verified architectural engineering, clean documentation, and audited platform security.",
          },
        ];

  const primaryHostingService = services[0];
  const currentChapter = showcaseChapters[activeChapter];

  return (
    <div ref={rootRef} className="min-h-screen bg-white text-[#1D1C1C]">
      {/* Opening Gallery Curtain + Consultation Advisor Modal */}
      <EntranceExperience onOpenAuth={() => setAuthModalOpen(true)} />

      {/* Cartier Into-The-Wild Left-Edge Scroll Progress Track */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-5 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col items-center gap-1.5"
      >
        <div className="relative h-44 w-4 flex justify-center">
          <div className="h-full border-l border-dashed border-[#C8A464]/60" />
          <div
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-[1.5px] border-[#C10016] bg-white shadow-xs transition-all duration-150"
            style={{ top: `${Math.round(scrollProgress * 100)}%` }}
          />
          <span className="absolute top-[25%] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C8A464]" />
          <span className="absolute top-[60%] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C8A464]" />
        </div>
      </div>

      {/* ========================================================
          1. CARTIER NOCTURNAL CAMPAIGN HERO 1 — INSTANT WEBSITE HOSTING
          ======================================================== */}
      <section className="relative isolate overflow-hidden samad-hero-grid min-h-[82vh] flex flex-col justify-end pb-14 sm:pb-20 pt-24 text-white text-center">
        <ThreeHeroCanvas
          variant="hero"
          className="absolute inset-0 w-full h-full z-0 opacity-95"
        />

        {/* Nocturnal Velvet Gradient Scrim for Cartier Bottom Typography Contrast */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09080A] via-[#09080A]/35 to-transparent z-[1]" />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-5">
          <div className="hero-stagger text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.36em] text-[#C8A464]">
            Maison Samad Expo &middot; Agra, India
          </div>

          <h1 className="hero-stagger text-3xl sm:text-5xl lg:text-[3.5rem] font-bold uppercase tracking-[0.16em] leading-tight text-white">
            Instant Website Hosting
          </h1>

          <p className="hero-stagger font-editorial-serif italic text-lg sm:text-xl text-zinc-200 max-w-xl mx-auto leading-relaxed">
            {profile?.mission ||
              "Upload static builds, inspect responsive sandboxes, and publish live web platforms with precision architecture."}
          </p>

          <div className="hero-stagger pt-3 flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/dashboard"
              className="btn-maison-light px-9 py-3.5 text-[11px] font-bold uppercase tracking-[0.24em]"
            >
              Discover Hosting
            </Link>

            <a
              href="#live-tools"
              className="font-editorial-serif italic text-base text-white border-b border-white/60 hover:border-[#C8A464] hover:text-[#E5C78E] pb-0.5 transition"
            >
              Explore Creations
            </a>

            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="font-editorial-serif italic text-base text-zinc-300 border-b border-transparent hover:border-white hover:text-white pb-0.5 transition cursor-pointer"
            >
              Console Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. FULL-BLEED EDITORIAL SHOWCASE 2 — BAS-RELIEF CURSOR GOLD REVEAL
          ======================================================== */}
      <section
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const px = ((e.clientX - rect.left) / rect.width) * 100;
          const py = ((e.clientY - rect.top) / rect.height) * 100;
          setCursorBrush({ x: px, y: py, active: true });
        }}
        onMouseLeave={() => setCursorBrush((prev) => ({ ...prev, active: false }))}
        className="reveal-section relative isolate overflow-hidden bg-[#130508] min-h-[68vh] flex flex-col justify-end py-16 sm:py-20 text-white text-center border-t border-[#C8A464]/20"
      >
        <ThreeHeroCanvas
          variant="dark"
          className="absolute inset-0 w-full h-full z-0 opacity-85"
        />

        {/* Cartier Into-The-Wild Interactive Cursor Gold-Leaf Reveal Layer */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] transition-opacity duration-500"
          style={{
            opacity: cursorBrush.active ? 1 : 0.35,
            background: `radial-gradient(280px circle at ${cursorBrush.x}% ${cursorBrush.y}%, rgba(200,164,100,0.28), rgba(193,0,22,0.16) 45%, transparent 72%)`,
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] opacity-40"
          style={{
            clipPath: `circle(${cursorBrush.active ? 170 : 90}px at ${cursorBrush.x}% ${cursorBrush.y}%)`,
            backgroundImage:
              "repeating-conic-gradient(from 0deg at 50% 50%, rgba(229,199,142,0.22) 0deg 12deg, transparent 12deg 24deg)",
            transition: "clip-path 0.2s ease-out",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(193,0,22,0.18),rgba(10,8,10,0.88)_74%)] z-[1]" />

        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#C8A464]">
            Curated Web Software &middot; Move Cursor to Reveal
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-[0.18em] text-white">
            Precision Digital Utilities
          </h2>
          <p className="font-editorial-serif italic text-base sm:text-lg text-zinc-300 leading-relaxed max-w-xl mx-auto">
            Browser-native calculators, file converters, and fast utility applications built with clean engineering and effortless execution.
          </p>
          <div className="pt-2">
            <Link
              href="/websites"
              className="btn-maison-light inline-block px-9 py-3.5 text-[11px] font-bold uppercase tracking-[0.24em]"
            >
              Discover Utilities
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. PURE GALLERY WHITE BAND — THE MAISON & CORE VALUES
          ======================================================== */}
      <section id="about" className="reveal-section py-20 sm:py-28 bg-white border-b border-[#E5DFD7]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#C10016]">
              La Maison
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-[0.18em] text-[#1D1C1C]">
              About Samad Expo
            </h2>
            <p className="font-editorial-serif italic text-base sm:text-lg text-[#595959] leading-relaxed">
              {profile?.story ||
                "Established in Bodla, Agra, Samad Expo unites agile static website hosting with practical digital utilities and custom software engineering."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, idx) => (
              <Card3D key={idx} intensity={5}>
                <div className="samad-card p-7 h-full flex flex-col justify-between space-y-5 border-t-2 border-t-[#C10016]">
                  <div className="space-y-3">
                    <div className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#C8A464]">
                      0{idx + 1} &middot; Principle
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[#1D1C1C]">
                      {val.title}
                    </h3>
                    <p className="font-editorial-serif text-sm text-[#595959] leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                  <div className="h-[1px] w-10 bg-[#C8A464]" />
                </div>
              </Card3D>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          4. OUR CREATIONS — BALANCED CARTIER BOUTIQUE SHOWCASE (#live-tools)
          ======================================================== */}
      <section id="live-tools" className="reveal-section py-20 sm:py-28 bg-[#FAF7F2] border-b border-[#E5DFD7]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#C10016]">
              Digital Catalogue
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-[0.18em] text-[#1D1C1C]">
              Our Creations
            </h2>
            <p className="font-editorial-serif italic text-base sm:text-lg text-[#595959]">
              Explore live digital tools and public deployments curated across the Samad Expo cloud network.
            </p>
          </div>

          {/* Understated Cartier Filter Bar & Underline Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#E5DFD7] pb-5">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setProjectCategory(cat)}
                  className={`pb-1.5 text-[11px] font-bold uppercase tracking-[0.18em] border-b transition-colors cursor-pointer ${
                    projectCategory === cat
                      ? "text-[#C10016] border-[#C10016]"
                      : "text-[#595959] border-transparent hover:text-[#1D1C1C]"
                  }`}
                >
                  {cat === "all" ? "All Creations" : cat}
                </button>
              ))}
            </div>

            <div className="w-full md:w-64 relative">
              <Search className="w-3.5 h-3.5 text-[#595959] absolute left-1 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={toolSearch}
                onChange={(e) => setToolSearch(e.target.value)}
                placeholder="Filter platforms..."
                className="w-full pl-7 pr-2 py-1.5 bg-transparent border-b border-[#D5CEC5] focus:border-[#1D1C1C] font-editorial-serif italic text-sm text-[#1D1C1C] placeholder:text-[#888178] outline-none"
              />
            </div>
          </div>

          {/* Symmetric Balanced Grid (zero lonely trailing columns) */}
          {filteredPlatforms.length === 0 ? (
            <div className="samad-card p-12 text-center font-editorial-serif italic text-base text-[#595959]">
              No matching platforms found. Adjust your filter selection above.
            </div>
          ) : (
            <div className={`grid ${gridColsClass(filteredPlatforms.length)} gap-8`}>
              {filteredPlatforms.map((item) => (
                <Card3D key={item.id} intensity={5}>
                  <div className="bg-white border border-[#E5DFD7] hover:border-[#C10016] h-full flex flex-col justify-between transition-colors duration-300 group">
                    {/* Cartier Warm Champagne Showcase Stage Top */}
                    <div className="photo-reveal h-52 bg-gradient-to-b from-[#F4EDE4] to-[#EAE0D3] relative overflow-hidden flex flex-col items-center justify-center p-6 border-b border-[#E5DFD7]">
                      <div className="w-20 h-20 rounded-full bg-[#151215] border-2 border-[#C8A464] flex items-center justify-center shadow-[0_14px_30px_rgba(0,0,0,0.22)] group-hover:scale-105 transition-transform duration-500">
                        {item.isHostedSite ? (
                          <Globe className="w-7 h-7 text-[#C8A464] stroke-[1.3]" />
                        ) : (
                          <Monitor className="w-7 h-7 text-[#C8A464] stroke-[1.3]" />
                        )}
                      </div>
                      {/* Lacquered Crimson Plinth Shadow */}
                      <div className="mt-3 w-28 h-2.5 bg-gradient-to-r from-[#7A0010] via-[#C10016] to-[#7A0010] rounded-full shadow-md" />
                      <span className="mt-4 text-[9px] font-bold uppercase tracking-[0.26em] text-[#595959]">
                        {item.category} &middot; Live Online
                      </span>
                    </div>

                    {/* Centered Classic Typography Body & Underlined Serif Links */}
                    <div className="p-7 sm:p-8 text-center flex-1 flex flex-col justify-between space-y-5">
                      <div className="space-y-2.5">
                        <h3 className="text-sm sm:text-base font-bold uppercase tracking-[0.16em] text-[#1D1C1C]">
                          {item.name}
                        </h3>
                        <p className="font-editorial-serif text-sm text-[#595959] leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
                        <button
                          type="button"
                          onClick={() => setPreviewSite(item)}
                          className="font-editorial-serif italic text-sm text-[#1D1C1C] border-b border-[#1D1C1C] hover:text-[#C10016] hover:border-[#C10016] pb-0.5 transition cursor-pointer"
                        >
                          Preview Sandbox
                        </button>

                        <a
                          href={item.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-editorial-serif italic text-sm text-[#1D1C1C] border-b border-[#1D1C1C] hover:text-[#C10016] hover:border-[#C10016] pb-0.5 transition inline-flex items-center gap-1"
                        >
                          <span>Launch Creation</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </Card3D>
              ))}
            </div>
          )}

          <div className="text-center pt-4">
            <Link
              href="/websites"
              className="btn-3d-black inline-block px-9 py-3.5 text-[11px] font-bold uppercase tracking-[0.22em]"
            >
              View Full Catalogue
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. ATELIER KINETIC SHOWCASE — 4-CHAPTER CAROUSEL & HOSTING PIPELINE
          ======================================================== */}
      <section className="reveal-section py-20 sm:py-24 bg-[#0B0A0C] text-white relative overflow-hidden">
        <ThreeHeroCanvas variant="dark" className="opacity-55" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-14">
          {/* Auto-Dissolving Chapter Spotlight + Cartier Into-The-Wild Drag-to-Reveal Crest */}
          <div className="border border-[#C8A464]/35 bg-[#120F12]/90 p-8 sm:p-14 text-center space-y-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#C8A464]">
                {currentChapter.eyebrow}
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-[0.18em] text-white transition-all duration-700">
                {currentChapter.title}
              </h2>
              <p className="font-editorial-serif italic text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                {currentChapter.desc}
              </p>
              <div className="flex items-center justify-center gap-2.5 pt-1">
                {showcaseChapters.map((ch, idx) => (
                  <button
                    key={ch.eyebrow}
                    type="button"
                    onClick={() => setActiveChapter(idx)}
                    aria-label={`Select ${ch.eyebrow}`}
                    className={`h-[2px] transition-all duration-300 cursor-pointer ${
                      idx === activeChapter
                        ? "w-8 bg-[#C10016]"
                        : "w-4 bg-zinc-700 hover:bg-[#C8A464]"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Interactive Drag-to-Reveal Cartier Marquetry Sunburst Dial */}
            <div className="pt-6 border-t border-white/10 space-y-5 max-w-md mx-auto">
              <div className="relative w-40 h-28 mx-auto flex items-center justify-center">
                <div
                  className="w-24 h-24 rounded-full border border-[#C8A464]/60 flex items-center justify-center transition-transform duration-200"
                  style={{
                    transform: `rotate(${dragReveal * 3.6}deg) scale(${0.85 + (dragReveal / 100) * 0.25})`,
                    background: `conic-gradient(from 0deg, rgba(200,164,100,${0.15 + (dragReveal / 100) * 0.65}) ${dragReveal * 3.6}deg, rgba(255,255,255,0.04) 0deg)`,
                  }}
                >
                  <div className="w-16 h-16 rounded-full bg-[#0B0A0C] border border-[#C10016]/70 flex items-center justify-center">
                    <span className="font-editorial-serif italic text-xs text-[#E5C78E]">
                      {dragReveal}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={dragReveal}
                  onChange={(e) => setDragReveal(Number(e.target.value))}
                  aria-label="Drag to reveal digital craft"
                  className="w-full h-[2px] appearance-none bg-[#C8A464]/35 accent-[#C10016] cursor-ew-resize"
                />
                <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#C8A464]">
                  Drag to Reveal Craft
                </div>
              </div>
            </div>
          </div>

          {/* Connected 4-Step Deployment Pipeline */}
          <div className="relative">
            <div className="hidden lg:block pointer-events-none absolute top-7 left-10 right-10 h-[1px] bg-[#C8A464]/35" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {[
                {
                  num: "01",
                  title: "Console Access",
                  desc: "Authenticate seamlessly inside the hosting studio.",
                },
                {
                  num: "02",
                  title: "Package Upload",
                  desc: "Submit static HTML pages or structured ZIP bundles.",
                },
                {
                  num: "03",
                  title: "Sandbox Review",
                  desc: "Verify responsive viewports before publishing live.",
                },
                {
                  num: "04",
                  title: "Edge Activation",
                  desc: "Receive an instant public deployment URL immediately.",
                },
              ].map((step) => (
                <Card3D key={step.num} intensity={5}>
                  <div className="samad-card-dark p-6 h-full text-center space-y-3">
                    <div className="w-12 h-12 mx-auto border border-[#C8A464]/60 bg-[#0B0A0C] text-[#C8A464] flex items-center justify-center text-xs font-bold tracking-widest">
                      {step.num}
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                      {step.title}
                    </h3>
                    <p className="font-editorial-serif text-sm text-zinc-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </Card3D>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. OUR SERVICES — CARTIER 2-COLUMN BOUTIQUE PLINTH GRID
          ======================================================== */}
      <section id="services" className="reveal-section py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-[0.2em] text-[#1D1C1C]">
              Our Services
            </h2>
            <p className="font-editorial-serif italic text-base text-[#595959] leading-relaxed">
              Our engineering studio empowers you to host websites, integrate APIs, and launch bespoke web platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
            {/* Service Card 1: Multi-User Website Hosting */}
            <Card3D intensity={5}>
              <div className="h-full flex flex-col justify-between bg-white border border-[#E5DFD7] hover:border-[#C10016] transition-colors">
                <div className="h-64 sm:h-72 bg-gradient-to-b from-[#EFE7DC] to-[#E2D6C8] flex flex-col items-center justify-center p-8 border-b border-[#E5DFD7]">
                  <div className="w-28 h-28 bg-[#181518] border border-[#C8A464] flex items-center justify-center shadow-xl">
                    <UploadCloud className="w-9 h-9 text-[#C8A464] stroke-[1.2]" />
                  </div>
                  <div className="w-40 h-3.5 bg-gradient-to-r from-[#7A0010] via-[#C10016] to-[#7A0010] mt-3 shadow-md" />
                </div>

                <div className="p-8 text-center space-y-4">
                  <h3 className="text-sm sm:text-base font-bold uppercase tracking-[0.18em] text-[#1D1C1C]">
                    {primaryHostingService?.name || "Website Hosting Studio"}
                  </h3>
                  <p className="font-editorial-serif text-sm sm:text-base text-[#595959] leading-relaxed max-w-md mx-auto">
                    {primaryHostingService?.shortDescription ||
                      "Deploy static HTML & ZIP packages into isolated preview environments with immediate public URLs."}
                  </p>
                  <div className="pt-1">
                    <Link
                      href="/dashboard"
                      className="font-editorial-serif italic text-base text-[#1D1C1C] border-b border-[#1D1C1C] hover:text-[#C10016] hover:border-[#C10016] pb-0.5 transition"
                    >
                      Open Hosting Studio
                    </Link>
                  </div>
                </div>
              </div>
            </Card3D>

            {/* Service Card 2: Contact an Engineering Advisor */}
            <Card3D intensity={5}>
              <div className="h-full flex flex-col justify-between bg-white border border-[#E5DFD7] hover:border-[#C10016] transition-colors">
                <div className="h-64 sm:h-72 bg-gradient-to-b from-[#EFE7DC] to-[#E2D6C8] flex flex-col items-center justify-center p-8 border-b border-[#E5DFD7]">
                  <div className="w-28 h-28 rounded-full bg-[#181518] border-2 border-[#C8A464] flex items-center justify-center shadow-xl">
                    <Cpu className="w-9 h-9 text-[#C8A464] stroke-[1.2]" />
                  </div>
                  <div className="w-40 h-3.5 bg-gradient-to-r from-[#7A0010] via-[#C10016] to-[#7A0010] mt-3 rounded-full shadow-md" />
                </div>

                <div className="p-8 text-center space-y-4">
                  <h3 className="text-sm sm:text-base font-bold uppercase tracking-[0.18em] text-[#1D1C1C]">
                    Contact an Engineering Advisor
                  </h3>
                  <p className="font-editorial-serif text-sm sm:text-base text-[#595959] leading-relaxed max-w-md mx-auto">
                    Our technical team in Agra is available for custom Next.js engineering, hosting architecture, and MCP API inquiries.
                  </p>
                  <div className="pt-1">
                    <Link
                      href="/contact"
                      className="font-editorial-serif italic text-base text-[#1D1C1C] border-b border-[#1D1C1C] hover:text-[#C10016] hover:border-[#C10016] pb-0.5 transition"
                    >
                      Contact us
                    </Link>
                  </div>
                </div>
              </div>
            </Card3D>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. VERIFIED MAISON METRICS STRIP (#FAF7F2)
          ======================================================== */}
      <section ref={statsRef} className="reveal-section py-16 bg-[#FAF7F2] border-t border-[#E5DFD7]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { val: `${livePlatformsCount}`, label: "Live Creations" },
              { val: `${profile?.founded || "2024"}`, label: "Established · Agra" },
              { val: "20/20", label: "Security Audited" },
              { val: "MCP v2", label: "JSON-RPC Endpoint" },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1.5">
                <div className="font-editorial-serif italic text-3xl sm:text-4xl text-[#1D1C1C]">
                  {stat.val}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#595959] flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-[#C10016]" />
                  <span>{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          MODALS: AUTH MODAL + LIVE SANDBOX IFRAME PREVIEW MODAL
          ======================================================== */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode="login"
      />

      {previewSite && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-5xl h-[82vh] bg-white border border-[#C8A464]/60 overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E5DFD7] bg-[#FAF7F2]">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#C10016] shrink-0" />
                <span className="font-bold uppercase tracking-[0.14em] text-[#1D1C1C] text-xs truncate">
                  {previewSite.name}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={previewSite.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1D1C1C] hover:bg-[#C10016] text-white text-[10px] font-bold uppercase tracking-[0.18em] transition"
                >
                  <span>Open Live</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewSite(null)}
                  aria-label="Close preview"
                  className="p-1.5 text-[#595959] hover:text-[#C10016] transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <iframe
              src={previewSite.liveUrl}
              title={previewSite.name}
              className="flex-1 w-full h-full bg-white border-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
