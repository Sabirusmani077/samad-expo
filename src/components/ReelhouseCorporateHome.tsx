"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  ArrowRight,
  UploadCloud,
  Globe,
  Monitor,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Layers,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Mail,
  Award,
  Search,
  MapPin,
  Sparkles,
  FileArchive,
  Rocket,
  X,
} from "lucide-react";
import { publicWebsiteUrl } from "@/lib/corporate-public";
import { HeroAuthCard } from "@/components/HeroAuthCard";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";
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

const heroPhrases = [
  "instant website hosting.",
  "live web deployments.",
  "practical web tools.",
  "modern digital platforms.",
];

const techStack = [
  "Next.js 15",
  "React 19",
  "Three.js 3D Engine",
  "TypeScript",
  "HTML5 & Static ZIP",
  "Instant /sites/ Routing",
  "Isolated Previews",
  "MCP JSON-RPC API",
  "Rate-Limited Security",
];

function useAnimatedCounter(target: number, start: boolean, durationMs = 900) {
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

export function ReelhouseCorporateHome({
  profile,
  websites,
  services,
  team,
  hostedProjects = [],
}: ReelhouseProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [activePhraseIndex, setActivePhraseIndex] = useState(0);
  const [toolSearch, setToolSearch] = useState("");
  const [projectCategory, setProjectCategory] = useState("all");
  const [previewSite, setPreviewSite] = useState<UnifiedPlatformCard | null>(
    null
  );
  const [statsVisible, setStatsVisible] = useState(false);

  // Cycling phrases in Hero
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const timer = setInterval(() => {
      setActivePhraseIndex((prev) => (prev + 1) % heroPhrases.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // GSAP 3D perspective entrance & scroll animations
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".hero-stagger", {
        y: 22,
        opacity: 0,
        duration: 0.75,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "transform,opacity",
      });

      gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((section) => {
        gsap.from(section, {
          y: 28,
          rotationX: 6,
          scale: 0.985,
          opacity: 0,
          duration: 0.75,
          ease: "power3.out",
          transformPerspective: 1200,
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: section,
            start: "top 86%",
            once: true,
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // Stats Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Deduplicate real websites + clean public hosted projects
  const unifiedPlatforms = useMemo<UnifiedPlatformCard[]>(() => {
    const map = new Map<string, UnifiedPlatformCard>();

    for (const w of websites) {
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
          `Live static deployment hosted on Samad Expo by ${
            hp.userName || "Creator"
          }.`,
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

  const livePlatformsCount = useAnimatedCounter(
    unifiedPlatforms.length,
    statsVisible
  );

  const founder = team.find((m) => m.isFounder) || null;
  const founderName = founder?.name || profile?.founderName || "Sabir Usmani";
  const founderTitle =
    founder?.designation || profile?.founderDesignation || "Founder & Owner";
  const founderPhoto =
    founder?.photo || profile?.founderPhoto || "/images/founder-portrait.jpg";
  const founderMessage =
    founder?.founderMessage ||
    profile?.founderMessage ||
    "Welcome to Samad Expo. Our journey began with a fundamental belief: great digital platforms are built on robust architecture, practical utility, and continuous innovation.";

  const coreValues =
    profile?.coreValues && profile.coreValues.length > 0
      ? profile.coreValues
      : [
          {
            title: "Practical Innovation",
            description:
              "Building web tools and hosting engines that solve real everyday problems with zero friction.",
          },
          {
            title: "Reliability & Uptime",
            description:
              "Ensuring fast routing, secure isolated sandboxes, and dependable availability.",
          },
          {
            title: "Simplicity & Speed",
            description:
              "Eliminating deployment complexity with 1-click ZIP upload and instant URLs.",
          },
          {
            title: "Transparent Governance",
            description:
              "Clear ownership, verified credentials, and honest platform metrics without fluff.",
          },
        ];

  const capabilityCards = [
    ...(services.length > 0
      ? services.map((svc, idx) => ({
          num: `0${idx + 1}`,
          title: svc.name,
          desc: svc.shortDescription || svc.description,
          features:
            svc.features && svc.features.length > 0
              ? svc.features.slice(0, 4)
              : ["Zero-Config Setup", "Isolated Sandboxes", "Instant Routing"],
          href: idx === 0 ? "/dashboard" : "/corporate-services",
          cta: idx === 0 ? "Open Hosting Studio" : "Explore Service",
          icon: idx === 0 ? UploadCloud : Layers,
        }))
      : []),
    {
      num: `0${services.length + 1}`,
      title: "Practical Digital Utilities Suite",
      desc: "Browser-native calculators, unit & file converters, and fast utility tools built for everyday productivity with zero installation.",
      features: [
        "MDK Chrono Age Calculator",
        "MDK Unit & Media Convertor",
        "Google Calculator Web App",
        "Instant Browser Preview",
      ],
      href: "/websites",
      cta: "Browse Live Tools",
      icon: Globe,
    },
    {
      num: `0${services.length + 2}`,
      title: "AI-Ready MCP Protocol & Security",
      desc: "Standardized Model Context Protocol JSON-RPC gateway (/api/mcp) protected by rate limiting, CSRF defense, and verified security audits.",
      features: [
        "JSON-RPC 2.0 MCP API",
        "20/20 Security Audit Verified",
        "Token-Bucket Rate Limiting",
        "Server-Side Role Control",
      ],
      href: "/ecosystem-search",
      cta: "Explore Ecosystem API",
      icon: Cpu,
    },
  ];

  return (
    <div ref={rootRef} className="min-h-screen bg-[#060608] text-white">
      {/* ========================================================
          1. LUXURY 3D YELLOW & BLACK HERO SECTION
          ======================================================== */}
      <section className="relative isolate overflow-hidden samad-hero-grid pt-10 pb-16 sm:pt-14 sm:pb-24 border-b border-zinc-800/80">
        {/* Live Interactive 3D WebGL Sculpture & Gold Dust Engine */}
        <ThreeHeroCanvas
          variant="hero"
          className="absolute inset-0 w-full h-full z-0 opacity-95"
        />

        {/* Ambient Gold Spotlight Glows */}
        <div className="pointer-events-none absolute -top-36 right-[-10%] h-[540px] w-[540px] rounded-full bg-[#FFF33D]/14 blur-[140px]" />
        <div className="pointer-events-none absolute bottom-[-10%] left-[-8%] h-[400px] w-[400px] rounded-full bg-[#FFF33D]/10 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: High-Craft Editorial Value Prop & 3D CTAs (Span 7) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Top Location & Live Status Pill */}
              <div className="hero-stagger inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#FFF33D]/40 bg-[#FFF33D]/10 backdrop-blur-md text-xs font-extrabold text-[#FFF33D] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  {profile?.businessName || "Samad Expo"} &middot; Bodla, Agra
                </span>
              </div>

              {/* Clean, Authoritative Editorial Headline */}
              <div className="hero-stagger space-y-2">
                <h1 className="text-4xl sm:text-5xl xl:text-[3.75rem] font-black tracking-tight leading-[1.06] text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.85)]">
                  Launch Websites into{" "}
                  <span className="samad-highlight mt-1">
                    {heroPhrases[activePhraseIndex]}
                  </span>
                </h1>
              </div>

              {/* Concise Practical Summary */}
              <p className="hero-stagger text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl bg-black/35 backdrop-blur-xs rounded-2xl p-3 border border-white/5">
                {profile?.about ||
                  "Samad Expo is a modern website hosting platform and digital ecosystem founded by Sabir Usmani. Upload static HTML or ZIP projects for instant live URLs, or launch practical everyday web tools directly in your browser."}
              </p>

              {/* Mission Callout */}
              <div className="hero-stagger border-l-4 border-[#FFF33D] pl-4 py-2 max-w-xl bg-zinc-900/60 backdrop-blur-md rounded-r-xl pr-4 border-y border-r border-white/5">
                <p className="text-xs sm:text-sm text-zinc-200 italic leading-relaxed">
                  &ldquo;
                  {profile?.mission ||
                    "To deliver lightning-fast, zero-hassle website deployment alongside beautifully engineered web applications that solve real everyday problems."}
                  &rdquo;
                </p>
              </div>

              {/* Primary & Secondary 3D Action Buttons */}
              <div className="hero-stagger pt-1 flex flex-wrap items-center gap-4">
                <Link
                  href="/dashboard"
                  className="btn-3d-yellow inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wider"
                >
                  <Rocket className="w-4 h-4" />
                  <span>Host Website Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#live-tools"
                  className="btn-3d-black inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider"
                >
                  <span>Try Live Tools</span>
                  <ArrowUpRight className="w-4 h-4 text-[#FFF33D]" />
                </a>
              </div>

              {/* Verified Capability Micro-Pills */}
              <div className="hero-stagger pt-2 flex flex-wrap items-center gap-2.5 text-[11px] font-bold text-zinc-300">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 backdrop-blur-md">
                  <FileArchive className="w-3.5 h-3.5 text-[#FFF33D]" />
                  HTML &amp; ZIP Upload
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 backdrop-blur-md">
                  <Globe className="w-3.5 h-3.5 text-[#FFF33D]" />
                  Instant Public URLs
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 backdrop-blur-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Isolated Preview Sandbox
                </span>
              </div>
            </div>

            {/* Right Column: 3D Obsidian & Gold HeroAuthCard (Span 5) */}
            <div className="hero-stagger lg:col-span-5 flex justify-center lg:justify-end">
              <HeroAuthCard dark={true} />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. LUXURY GOLD & CARBON INFRASTRUCTURE MARQUEE
          ======================================================== */}
      <section className="bg-[#0B0B0F] border-b border-zinc-800/80 py-5 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-zinc-500">
          <span className="text-[#FFF33D]">
            Engineered on Modern 3D Web Standards
          </span>
          <span className="hidden sm:inline text-zinc-400">
            Static Hosting &middot; Live Utilities &middot; MCP Protocol
          </span>
        </div>

        <div className="relative flex overflow-x-hidden">
          <div className="animate-samad-marquee flex items-center gap-5 text-xs font-bold text-zinc-200">
            {[...techStack, ...techStack].map((tech, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FFF33D]/25 bg-zinc-900/90 shadow-sm shrink-0"
              >
                <span className="w-2 h-2 rounded-full bg-[#FFF33D]" />
                <span>{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          3. PRACTICAL LIVE TOOLS & HOSTED APPS (#live-tools)
          ======================================================== */}
      <section id="live-tools" className="reveal-section py-16 sm:py-24 bg-[#060608]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header + Search */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF33D]/10 border border-[#FFF33D]/30 text-[#FFF33D] text-xs font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Digital Ecosystem</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                Ready-to-Use{" "}
                <span className="samad-highlight">Web Tools &amp; Apps</span>
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                Launch live web utilities built by Samad Expo or inspect public static sites hosted on our cloud engine.
              </p>
            </div>

            <div className="w-full lg:w-80 relative">
              <Search className="w-4 h-4 text-[#FFF33D] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={toolSearch}
                onChange={(e) => setToolSearch(e.target.value)}
                placeholder="Filter tools or hosted sites..."
                className="w-full pl-11 pr-4 py-2.5 rounded-full border border-zinc-800 bg-zinc-900/90 text-xs sm:text-sm font-medium text-white placeholder:text-zinc-500 focus:border-[#FFF33D] focus:ring-2 focus:ring-[#FFF33D]/25 outline-none transition"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setProjectCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                  projectCategory === cat
                    ? "bg-[#FFF33D] text-zinc-950 shadow-[0_0_20px_rgba(255,243,61,0.3)]"
                    : "bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-[#FFF33D]/50 hover:text-white"
                }`}
              >
                {cat === "all" ? "All Live Platforms" : cat}
              </button>
            ))}
          </div>

          {/* 3D Practical Platform Cards Grid */}
          {filteredPlatforms.length === 0 ? (
            <div className="samad-card p-10 text-center text-sm text-zinc-400">
              No matching live tools found. Try clearing your filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlatforms.map((item) => (
                <Card3D
                  key={item.id}
                  intensity={6}
                  className="samad-card p-6 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-bold text-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Live</span>
                      </span>

                      <span className="px-2.5 py-1 rounded-full bg-[#FFF33D]/15 border border-[#FFF33D]/30 text-[11px] font-bold text-[#FFF33D]">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-white mb-2 group-hover:text-[#FFF33D] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6 line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewSite(item)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-300 hover:text-[#FFF33D] cursor-pointer transition"
                    >
                      <Monitor className="w-3.5 h-3.5 text-[#FFF33D]" />
                      <span>Preview</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {!item.isHostedSite && (
                        <Link
                          href={item.profileHref}
                          className="px-3 py-1.5 rounded-full border border-zinc-700 hover:border-[#FFF33D] text-xs font-bold text-zinc-300 hover:text-[#FFF33D] transition"
                        >
                          Details
                        </Link>
                      )}
                      <a
                        href={item.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-3d-yellow inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-extrabold"
                      >
                        <span>Launch</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </Card3D>
              ))}
            </div>
          )}

          <div className="text-center pt-2">
            <Link
              href="/websites"
              className="btn-3d-black inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider"
            >
              <span>Open Full Public Directory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. HOW INSTANT HOSTING WORKS (#hosting — Carbon)
          ======================================================== */}
      <section
        id="hosting"
        className="reveal-section py-16 sm:py-24 bg-[#0B0B0F] border-y border-zinc-800/80"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF33D] text-zinc-950 text-xs font-extrabold uppercase tracking-wider shadow-sm">
                <Zap className="w-3.5 h-3.5" />
                <span>Automated Deployment Engine</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                Publish a Website in{" "}
                <span className="text-[#FFF33D]">3 Simple Steps</span>
              </h2>
              <p className="text-sm sm:text-base text-zinc-400">
                No server configuration or command-line headaches. Built for students, creators, and teams.
              </p>
            </div>

            <Link
              href="/dashboard?action=upload"
              className="btn-3d-yellow inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider shrink-0 self-start md:self-auto"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Project Now</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Sign In to Console",
                desc: "Use the instant authentication panel above or register a free account in seconds.",
              },
              {
                step: "02",
                title: "Upload HTML or ZIP Package",
                desc: "Drop your static index.html, CSS/JS assets, or ZIP bundle directly into the hosting uploader.",
              },
              {
                step: "03",
                title: "Share Your Live /sites/ URL",
                desc: "Preview your site inside a responsive sandbox and publish a fast public link immediately.",
              },
            ].map((item) => (
              <Card3D
                key={item.step}
                intensity={6}
                className="samad-card p-7 space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FFF33D] text-zinc-950 font-black text-base flex items-center justify-center shadow-[0_6px_18px_rgba(255,243,61,0.3)]">
                  {item.step}
                </div>
                <h3 className="text-xl font-extrabold text-white">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {item.desc}
                </p>
              </Card3D>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          5. SERVICES & CORE CAPABILITIES (#services — Obsidian)
          ======================================================== */}
      <section id="services" className="reveal-section py-16 sm:py-24 bg-[#060608]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF33D]/10 border border-[#FFF33D]/30 text-[#FFF33D] text-xs font-extrabold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>Capabilities &amp; Services</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Engineering &amp;{" "}
              <span className="samad-highlight">Hosting Solutions</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-400">
              Combining multi-user static hosting with custom software development and utility tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {capabilityCards.map((card) => (
              <Card3D
                key={card.num}
                intensity={5}
                className="samad-card p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden group"
              >
                <div className="absolute top-4 right-6 text-5xl font-black text-white/5 select-none pointer-events-none group-hover:text-[#FFF33D]/25 transition-colors">
                  {card.num}
                </div>

                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF33D] text-zinc-950 flex items-center justify-center mb-5 shadow-[0_6px_18px_rgba(255,243,61,0.28)]">
                    <card.icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-xl font-extrabold text-white mb-2 group-hover:text-[#FFF33D] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-5">
                    {card.desc}
                  </p>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                    {card.features.map((feat, fidx) => (
                      <li
                        key={fidx}
                        className="flex items-center gap-2 text-xs text-zinc-200 font-medium"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FFF33D] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  <Link
                    href={card.href}
                    className="inline-flex items-center gap-1.5 font-extrabold text-[#FFF33D] hover:text-white transition"
                  >
                    <span>{card.cta}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </Card3D>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          6. ABOUT SAMAD EXPO & FOUNDER (#about — Carbon)
          ======================================================== */}
      <section
        id="about"
        className="reveal-section py-16 sm:py-24 bg-[#0B0B0F] border-y border-zinc-800/80"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Corporate Story & Core Values (Span 7) */}
            <div className="lg:col-span-7 space-y-7">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF33D]/10 border border-[#FFF33D]/30 text-[#FFF33D] text-xs font-extrabold uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" />
                  <span>About Samad Expo</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  Built for Speed, Reliability &amp;{" "}
                  <span className="text-[#FFF33D]">Everyday Utility</span>
                </h2>
              </div>

              <div className="space-y-3 text-sm sm:text-base text-zinc-300 leading-relaxed">
                <p>
                  {profile?.story ||
                    "Founded by Sabir Usmani in Bodla, Agra, Samad Expo started as an independent web engineering initiative and has grown into a versatile technology platform providing multi-user static website hosting, digital utilities, and custom software development."}
                </p>
                <p className="text-zinc-400 text-sm">
                  {profile?.vision ||
                    "To build a fast, reliable, and accessible website hosting platform and developer ecosystem that simplifies web deployment and provides high-utility digital tools to users worldwide."}
                </p>
              </div>

              {/* 4 Real Core Values in 3D Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {coreValues.map((val, idx) => (
                  <Card3D
                    key={idx}
                    intensity={5}
                    className="samad-card p-5 space-y-2"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FFF33D] text-zinc-950 font-black text-xs flex items-center justify-center mb-2">
                      0{idx + 1}
                    </div>
                    <h3 className="text-sm font-extrabold text-white">
                      {val.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {val.description}
                    </p>
                  </Card3D>
                ))}
              </div>
            </div>

            {/* Right: Authentic Founder 3D Card with Real Portrait (Span 5) */}
            <div className="lg:col-span-5">
              <Card3D
                intensity={5}
                className="samad-card p-6 sm:p-7 space-y-6 overflow-hidden relative"
              >
                <div className="absolute inset-x-0 top-0 h-1.5 bg-[#FFF33D]" />

                <div className="flex items-center gap-4 pt-1">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#FFF33D] shadow-[0_8px_24px_rgba(255,243,61,0.25)] shrink-0 bg-zinc-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={founderPhoto}
                      alt={founderName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FFF33D] text-zinc-950 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                      {founderTitle}
                    </span>
                    <h3 className="text-xl font-black text-white">
                      {founderName}
                    </h3>
                    <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#FFF33D]" />
                      <span>{profile?.headquarters || "Bodla, Agra, UP"}</span>
                    </p>
                  </div>
                </div>

                <blockquote className="text-xs sm:text-sm text-zinc-300 italic leading-relaxed border-l-2 border-[#FFF33D] pl-3.5">
                  &ldquo;{founderMessage}&rdquo;
                </blockquote>

                <div className="space-y-2.5 pt-3 border-t border-zinc-800/80 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-500">Email</span>
                    <a
                      href={`mailto:${
                        profile?.contactEmail || "officialaadhakh@gmail.com"
                      }`}
                      className="font-bold text-[#FFF33D] hover:underline"
                    >
                      {profile?.contactEmail || "officialaadhakh@gmail.com"}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-500">Phone</span>
                    <a
                      href={`tel:${(
                        profile?.contactPhone || "+919458204216"
                      ).replace(/\s+/g, "")}`}
                      className="font-bold text-white hover:text-[#FFF33D]"
                    >
                      {profile?.contactPhone || "+91 94582 04216"}
                    </a>
                  </div>
                </div>

                <Link
                  href="/founder"
                  className="btn-3d-yellow w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full text-xs font-extrabold uppercase tracking-wider"
                >
                  <span>Read Founder Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Card3D>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. VERIFIED PLATFORM METRICS (100% Real Data — Obsidian)
          ======================================================== */}
      <section ref={statsRef} className="reveal-section py-16 sm:py-20 bg-[#060608]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Card3D
            intensity={4}
            className="samad-card p-8 sm:p-12 border-t-4 border-t-[#FFF33D]"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div className="space-y-1">
                <div className="text-3xl sm:text-5xl font-black text-[#FFF33D] tracking-tight">
                  {livePlatformsCount}
                </div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-white">
                  Live Platforms
                </div>
                <div className="text-[11px] text-zinc-500">
                  Verified public apps
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-3xl sm:text-5xl font-black text-[#FFF33D] tracking-tight">
                  {profile?.founded || "2024"}
                </div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-white">
                  Established
                </div>
                <div className="text-[11px] text-zinc-500">
                  Agra, Uttar Pradesh
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-3xl sm:text-5xl font-black text-[#FFF33D] tracking-tight">
                  ZIP
                </div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-white">
                  Instant Hosting
                </div>
                <div className="text-[11px] text-zinc-500">
                  Zero-config deploy
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-3xl sm:text-5xl font-black text-[#FFF33D] tracking-tight">
                  20/20
                </div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-white">
                  Security Audited
                </div>
                <div className="text-[11px] text-zinc-500">
                  Hardened edge routes
                </div>
              </div>
            </div>
          </Card3D>
        </div>
      </section>

      {/* ========================================================
          8. EXECUTIVE 3D BLACK & YELLOW CTA SECTION
          ======================================================== */}
      <section className="py-16 sm:py-24 bg-[#0B0B0F] border-t border-zinc-800/80 text-white relative isolate overflow-hidden">
        <ThreeHeroCanvas
          variant="dark"
          className="absolute inset-0 w-full h-full z-0 opacity-85"
        />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[720px] rounded-full bg-[#FFF33D]/12 blur-[140px]" />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF33D]/15 text-[#FFF33D] text-xs font-extrabold uppercase tracking-wider border border-[#FFF33D]/35">
            <Zap className="w-3.5 h-3.5" />
            <span>Deploy Today</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Ready to Launch Your Next{" "}
            <span className="text-[#FFF33D]">Website or Tool?</span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Create your free Samad Expo account to deploy static websites instantaneously, or contact our team in Agra for custom web engineering.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="btn-3d-yellow inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wider"
            >
              <span>Open Hosting Console</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/contact"
              className="btn-3d-black inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider"
            >
              <Mail className="w-4 h-4 text-[#FFF33D]" />
              <span>Contact Headquarters</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          9. FLOATING QUICK-CONTACT ACTION PILL
          ======================================================== */}
      <div className="fixed bottom-5 right-5 z-40">
        <Link
          href="/contact"
          aria-label="Contact Samad Expo"
          className="animate-samad-pulse flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-zinc-950 text-[#FFF33D] border border-[#FFF33D]/60 shadow-2xl hover:bg-[#FFF33D] hover:text-zinc-950 transition-all duration-200 group"
        >
          <div className="w-7 h-7 rounded-full bg-[#FFF33D] text-zinc-950 flex items-center justify-center shrink-0 group-hover:bg-zinc-950 group-hover:text-[#FFF33D] transition-colors">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
          <span className="hidden sm:inline text-xs font-extrabold pr-1">
            Contact HQ
          </span>
        </Link>
      </div>

      {/* ========================================================
          10. INTERACTIVE LIVE PREVIEW MODAL
          ======================================================== */}
      {previewSite && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <div className="relative w-full max-w-5xl h-[82vh] rounded-3xl bg-[#0B0B0F] border border-[#FFF33D]/30 overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800 bg-[#060608]">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="font-extrabold text-white text-sm truncate">
                  {previewSite.name}
                </span>
                <span className="text-xs text-zinc-400 font-mono hidden sm:inline truncate">
                  ({previewSite.liveUrl})
                </span>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <a
                  href={previewSite.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-3d-yellow inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold"
                >
                  <span>Open Live Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewSite(null)}
                  aria-label="Close preview"
                  className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
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
