"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Sparkles,
  UploadCloud,
  Globe,
  Monitor,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Play,
  Layers,
  Users,
  Code2,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Lock,
  Phone,
  Mail,
  Award,
  Terminal,
} from "lucide-react";
import { publicWebsiteUrl } from "@/lib/corporate-public";
import { Logo } from "@/components/Logo";
import { HeroAuthCard } from "@/components/HeroAuthCard";
import {
  BusinessDivision,
  WebsiteListing,
  CorporateService,
  TeamMember,
  CompanyProfile,
} from "@/lib/types";

interface ReelhouseProps {
  profile: CompanyProfile | null;
  websites: WebsiteListing[];
  divisions: BusinessDivision[];
  services: CorporateService[];
  team: TeamMember[];
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
  "TypeScript",
  "Tailwind CSS v4",
  "Vercel Edge",
  "Node.js",
  "Model Context Protocol",
  "Python",
  "PostgreSQL",
  "Cloudflare",
];

function useAnimatedCounter(target: number, start: boolean, durationMs = 1200) {
  const [value, setValue] = useState(0);

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
      setValue(Math.round(ease * target));
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
  divisions,
  services,
  team,
}: ReelhouseProps) {
  const [activePhraseIndex, setActivePhraseIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [projectCategory, setProjectCategory] = useState("all");
  const [previewSite, setPreviewSite] = useState<WebsiteListing | null>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Cycling phrases in Hero
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePhraseIndex((prev) => (prev + 1) % heroPhrases.length);
    }, 2800);
    return () => clearInterval(timer);
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

  // Animated counters
  const uptime = useAnimatedCounter(99.9, statsVisible);
  const liveTools = useAnimatedCounter(100, statsVisible);
  const edgeDeployTime = useAnimatedCounter(3, statsVisible);
  const monitoringHours = useAnimatedCounter(24, statsVisible);

  // Filter projects
  const filteredWebsites = useMemo(() => {
    if (projectCategory === "all") return websites;
    return websites.filter((w) => {
      if (projectCategory === "tools") return w.category?.toLowerCase().includes("tool") || w.category?.toLowerCase().includes("calc");
      if (projectCategory === "apps") return w.category?.toLowerCase().includes("app") || w.category?.toLowerCase().includes("web");
      if (projectCategory === "portfolios") return w.category?.toLowerCase().includes("portfolio");
      return true;
    });
  }, [websites, projectCategory]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-teal-500 selection:text-white">
      
      {/* ========================================================
          1. ATHENURA-INSPIRED OBSIDIAN HERO SECTION
          ======================================================== */}
      <section className="relative isolate overflow-hidden bg-[#040D12] text-white pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-teal-900/30">
        
        {/* Subtle Ambient Mesh & Radial Glows */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-teal-500/10 blur-[140px]" />
        <div className="pointer-events-none absolute top-1/2 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[130px]" />
        
        {/* Fine Vector Line Art Background Pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.4) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Editorial Headline & Mission (Span 7) */}
            <div className="lg:col-span-7 space-y-7">
              
              {/* Category Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-teal-500/30 bg-teal-950/50 text-xs font-bold text-teal-300 shadow-sm backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                <span>Next-Gen Web Ecosystem &amp; Instant Hosting</span>
              </div>

              {/* 3-Tier Editorial Headline (Signature Athenura Treatment) */}
              <div className="space-y-1 sm:space-y-2">
                <div className="font-serif italic text-zinc-400 font-light text-2xl sm:text-3xl lg:text-4xl tracking-wide">
                  Empowering
                </div>
                <h1 className="text-4xl sm:text-6xl lg:text-[4.75rem] font-black tracking-tight leading-[0.92] uppercase">
                  <span className="text-gradient-teal block">
                    BUSINESSES WITH
                  </span>
                  <span className="text-white block mt-1">
                    INNOVATION.
                  </span>
                </h1>
              </div>

              {/* Animated Cycling Subphrase */}
              <div className="flex items-center gap-3 text-lg sm:text-xl font-medium text-zinc-300">
                <span className="text-zinc-500">Accelerating</span>
                <span className="font-bold text-teal-300 transition-all duration-300">
                  {heroPhrases[activePhraseIndex]}
                </span>
              </div>

              {/* Mission Statement Quote Box (Athenura Signature Element) */}
              <div className="relative pl-5 border-l-2 border-[#20A9BB] py-1 max-w-xl">
                <p className="text-xs sm:text-sm text-zinc-300 italic font-light leading-relaxed">
                  &ldquo;Samad Expo transforms ideas into live digital platforms, delivering instant website hosting, robust web tools, and scalable technology platforms that help modern businesses innovate, scale, and succeed in the digital era.&rdquo;
                </p>
                <div className="mt-2 text-[10px] uppercase font-bold tracking-[0.25em] text-teal-400">
                  &mdash; THE SAMAD EXPO MISSION
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-white text-slate-950 hover:bg-teal-50 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_10px_25px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95"
                >
                  <span>Deploy Website</span>
                  <ArrowRight className="w-4 h-4 text-teal-700" />
                </Link>

                <Link
                  href="/websites"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-widest text-zinc-300 hover:text-white uppercase transition-colors group"
                >
                  <span>View Projects &amp; Tools</span>
                  <ArrowUpRight className="w-4 h-4 text-teal-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>

              {/* Live Metric Pills */}
              <div className="pt-4 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-zinc-400">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  100% Automated Deployment
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <Zap className="w-3.5 h-3.5 text-teal-400" />
                  &lt; 3s Edge Build Time
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  Enterprise Shield
                </span>
              </div>

            </div>

            {/* Right Column: Hero Console Auth & Hosting Card (Span 5) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <HeroAuthCard dark={true} />
            </div>

          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-12 flex justify-center">
          <a
            href="#marquee"
            aria-label="Scroll to content"
            className="flex flex-col items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-teal-400 transition"
          >
            <span>Scroll</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </a>
        </div>
      </section>

      {/* ========================================================
          2. TECHNOLOGY STACK MARQUEE & STATS TICKER
          ======================================================== */}
      <section id="marquee" className="border-b border-slate-200/80 bg-white py-6 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Powered by Modern Infrastructure</span>
            <span className="hidden sm:inline">Zero-Config Deployment Network</span>
          </div>
        </div>

        <div className="relative flex overflow-x-hidden">
          <div className="animate-athenura-marquee flex items-center gap-8 text-sm font-bold text-slate-700">
            {[...techStack, ...techStack].map((tech, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-slate-200/60 bg-slate-50/80 shrink-0 hover:border-teal-400 transition"
              >
                <div className="w-2 h-2 rounded-full bg-teal-500" />
                <span>{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          3. WHO WE ARE / OUR STORY (Athenura Narrative Grid)
          ======================================================== */}
      <section id="about" className="py-20 lg:py-28 bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider border border-teal-100">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>About Samad Expo</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
              Who We <span className="text-gradient-teal">Are</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Serving as the central digital headquarters and parent corporate brand for software applications, developer utilities, and modern web infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Narrative & 4 Feature Pillars (Span 7) */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                <p>
                  Founded with a vision to shape the future of <strong>digital innovation</strong> and <strong>accessible web hosting</strong>, Samad Expo officially established its foundation as a focused organization driven by <strong>creativity, technology, and purpose</strong>. Today, we deliver impactful web tools and instant hosting services across diverse domains.
                </p>
                <p>
                  Our journey is guided by a clear philosophy: <strong>build solutions that create real value</strong>. Every web application we deploy, every hosting pipeline we engineer, and every tool we launch is centered on <strong>solving real-world challenges</strong>.
                </p>
              </div>

              {/* 4 Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: "Innovation",
                    desc: "Pushing boundaries with instant deployment and automated cloud pipelines.",
                    icon: Zap,
                  },
                  {
                    title: "Excellence",
                    desc: "Delivering enterprise-grade speed, security, and 99.9% uptime reliability.",
                    icon: Award,
                  },
                  {
                    title: "Velocity",
                    desc: "From zero to live web application in seconds with zero server hassle.",
                    icon: Globe,
                  },
                  {
                    title: "Integrity",
                    desc: "Open, dependable infrastructure with client-first transparency.",
                    icon: ShieldCheck,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-xs hover:border-teal-400 hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Elevated Distributed Team & Founder Card (Span 5) */}
            <div className="lg:col-span-5">
              <div className="athenura-card p-6 sm:p-8 space-y-6">
                
                {/* Visual Header */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 h-52 sm:h-60 flex items-center justify-center p-6 text-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-teal-900/60 to-slate-950/90" />
                  <div className="relative z-10 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#FFF33D] text-[11px] font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Corporate Leadership</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      Sabir Usmani
                    </h3>
                    <p className="text-xs text-zinc-300 max-w-xs mx-auto">
                      Founder, Chief Executive &amp; System Architect leading the Samad Expo digital ecosystem.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Headquarters Node</span>
                    <span className="text-teal-700 font-semibold">Central India Gateway</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Primary Contact</span>
                    <span className="text-slate-600 font-mono">officialaadhakh@gmail.com</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Architecture</span>
                    <span className="text-slate-600">Edge Next.js + React 19</span>
                  </div>
                </div>

                <Link
                  href="/founder"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-950 hover:bg-teal-700 text-white text-xs font-bold uppercase tracking-wider transition duration-300 shadow-sm"
                >
                  <span>Explore Leadership Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          4. DIGITAL SOLUTIONS (Athenura Numbered Services Grid 01-06)
          ======================================================== */}
      <section id="services" className="py-20 lg:py-28 bg-white border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-teal-800 text-xs font-bold uppercase tracking-wider border border-cyan-100">
              <Zap className="w-3.5 h-3.5 text-teal-600" />
              <span>Core Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
              Digital Solutions That <span className="text-gradient-teal">Drive Innovation</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We deliver enterprise-grade technology services and hosting infrastructure that transform businesses and accelerate growth in the digital age.
            </p>
          </div>

          {/* 6 Numbered Athenura Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                num: "01",
                title: "Instant Website Hosting",
                desc: "Upload HTML, CSS, JavaScript or static zip bundles and get a live, secure edge URL deployed in seconds.",
                features: ["Zero-Config Deployment", "Automated HTTPS & CDN", "Custom Domain Routing", "Live Build Logs"],
                stat: "100% Instant Deploy",
                link: "/dashboard",
              },
              {
                num: "02",
                title: "Custom Web Applications",
                desc: "Full-stack tailored web apps built with modern Next.js 15, React 19, and scalable API architectures.",
                features: ["Tailored Architectures", "High-Performance SSR/SSG", "Responsive Mobile UX", "Database Integrations"],
                stat: "Enterprise Grade",
                link: "/corporate-services",
              },
              {
                num: "03",
                title: "Digital Ecosystem & Tools",
                desc: "Productive web utilities including Age Calculator, Unit Converters, and custom business workflow tools.",
                features: ["Browser-Based Utilities", "Instant Calculations", "Zero Install Required", "Offline Capable"],
                stat: "100+ Live Tools",
                link: "/websites",
              },
              {
                num: "04",
                title: "Cloud & Edge Infrastructure",
                desc: "Global edge CDN distribution ensuring sub-second response times and 99.9% uptime worldwide.",
                features: ["Global Edge CDN", "DDoS & Rate Limiting", "Continuous Backups", "SLA Guarantee"],
                stat: "99.9% Uptime",
                link: "/corporate-services",
              },
              {
                num: "05",
                title: "Model Context Protocol (MCP)",
                desc: "Full JSON-RPC MCP gateway enabling AI assistants and agentic systems to interact with our platform.",
                features: ["AI Agent Interoperability", "Tool Schema Standard", "Secure Authentication", "Full Data Query"],
                stat: "AI Ready",
                link: "/ecosystem-search?q=api",
              },
              {
                num: "06",
                title: "Corporate Venture Alliance",
                desc: "Incubating and accelerating modern brands under the Samad Expo umbrella with centralized engineering.",
                features: ["Shared Digital Core", "Unified Marketing", "Venture Scaling", "Strategic Advisory"],
                stat: "Multi-Venture",
                link: "/businesses",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className="athenura-card p-7 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Subtle Watermark Numeral */}
                <div className="absolute top-4 right-5 text-4xl sm:text-5xl font-black text-slate-100/90 select-none pointer-events-none group-hover:text-teal-100 transition-colors">
                  {card.num}
                </div>

                <div>
                  {/* Top Squircle Badge */}
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-6 border border-teal-100/80 shadow-xs group-hover:bg-[#20A9BB] group-hover:text-white transition duration-300">
                    <span className="text-base font-black">{card.num}</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    {card.desc}
                  </p>

                  {/* Bullet checklist */}
                  <ul className="space-y-2 mb-6">
                    {card.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Row: Stat Pill + Action Link */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-600 font-bold border border-slate-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                    {card.stat}
                  </span>

                  <Link
                    href={card.link}
                    className="inline-flex items-center gap-1 font-bold text-teal-700 hover:text-teal-900 transition"
                  >
                    <span>Explore</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          5. REAL PROJECTS. REAL RESULTS. (Portfolio Showcase)
          ======================================================== */}
      <section id="work" className="py-20 lg:py-28 bg-[#040D12] text-white relative isolate overflow-hidden">
        
        {/* Glow & Backdrop */}
        <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-teal-500/10 blur-[130px]" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Athenura Portfolio Hero Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-xs font-bold uppercase tracking-wider mb-4 border border-white/10">
                <Globe className="w-3.5 h-3.5 text-teal-400" />
                <span>Live Digital Ecosystem</span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-none">
                <span className="text-white block">Real Projects.</span>
                <span className="text-gradient-teal block mt-1">Real Results.</span>
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              {[
                { id: "all", label: "All Projects" },
                { id: "tools", label: "Tools & Utilities" },
                { id: "apps", label: "Web Applications" },
                { id: "portfolios", label: "Portfolios" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setProjectCategory(tab.id)}
                  className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
                    projectCategory === tab.id
                      ? "bg-[#20A9BB] text-white font-black shadow-sm"
                      : "bg-white/5 border border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredWebsites.slice(0, 6).map((item) => {
              const liveUrl = publicWebsiteUrl(item.url) || item.url || `/websites/${item.slug}`;
              return (
                <div
                  key={item.id}
                  className="rounded-[28px] border border-white/10 bg-[#0A171B]/80 p-6 sm:p-7 flex flex-col justify-between backdrop-blur-md hover:border-teal-400/50 hover:shadow-[0_20px_50px_rgba(32,169,187,0.15)] transition-all duration-300 group"
                >
                  <div>
                    {/* Header Bar */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-bold text-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Live on Edge</span>
                      </span>

                      <span className="text-[11px] font-mono text-zinc-400">
                        {item.category || "Utility"}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-teal-300 transition">
                      {item.name}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-6 line-clamp-3">
                      {item.shortDescription || item.description || "Production tool hosted on Samad Expo edge infrastructure."}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setPreviewSite(item)}
                      className="text-xs font-bold text-zinc-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                    >
                      <Monitor className="w-3.5 h-3.5 text-teal-400" />
                      <span>Instant Preview</span>
                    </button>

                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-white text-slate-950 hover:bg-teal-50 text-xs font-bold transition shadow-xs"
                    >
                      <span>Launch</span>
                      <ExternalLink className="w-3 h-3 text-teal-700" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/websites"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-teal-500/30 bg-teal-950/40 text-teal-300 hover:bg-teal-900/60 text-xs font-bold uppercase tracking-wider transition"
            >
              <span>Explore All Web Projects In Directory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================
          6. WHY CHOOSE US (Athenura Interactive 5-Tab Slider)
          ======================================================== */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider border border-teal-100">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Platform Advantages</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
              Why <span className="text-gradient-teal">Choose Us</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We combine deep technical expertise with strategic business insight to deliver solutions that drive measurable results and sustainable competitive advantage.
            </p>
          </div>

          {/* Interactive Advantage Card */}
          <div className="athenura-card p-8 sm:p-12 mb-10 max-w-4xl mx-auto">
            {activeTab === 0 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold">
                  Key Advantage 01
                </div>
                <h3 className="text-2xl sm:text-4xl font-black text-slate-900">
                  Instant Edge Architecture &amp; Zero Setup
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Traditional web hosting requires complex virtual servers, domain DNS wrangling, and manual SSL certificates. Samad Expo automates the entire lifecycle: simply upload static HTML/CSS/JS or zip packages, and our edge build pipeline deploys it globally under 3 seconds with enterprise SSL included.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="text-xs font-bold text-slate-400">Deploy Speed</div>
                    <div className="text-xl font-black text-teal-700 mt-1">&lt; 3 Seconds</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="text-xs font-bold text-slate-400">SSL Certificate</div>
                    <div className="text-xl font-black text-teal-700 mt-1">100% Automated</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="text-xs font-bold text-slate-400">Server Friction</div>
                    <div className="text-xl font-black text-teal-700 mt-1">Zero Config</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold">
                  Key Advantage 02
                </div>
                <h3 className="text-2xl sm:text-4xl font-black text-slate-900">
                  Audit-Grade Cyber Protection &amp; Resilience
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Every page and API route in Samad Expo is hardened according to OWASP Top 10 guidelines. With automated rate limiting, CSRF protections, cryptographic password hashing, and strict role verification, your digital platforms operate with military-grade safety.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="text-xs font-bold text-slate-400">Security Tests</div>
                    <div className="text-xl font-black text-teal-700 mt-1">20/20 Passed</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="text-xs font-bold text-slate-400">Rate Limiter</div>
                    <div className="text-xl font-black text-teal-700 mt-1">Dynamic Token Bucket</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="text-xs font-bold text-slate-400">Headers</div>
                    <div className="text-xl font-black text-teal-700 mt-1">HSTS &amp; CSP Ready</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold">
                  Key Advantage 03
                </div>
                <h3 className="text-2xl sm:text-4xl font-black text-slate-900">
                  Centralized Digital Headquarters &amp; Ecosystem
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Samad Expo isn&apos;t just one website; it is the parent home for all our specialized ventures, business divisions, customer portals, and web utilities. Users can discover, test, and launch tools through one unified digital experience.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="text-xs font-bold text-slate-400">Live Portals</div>
                    <div className="text-xl font-black text-teal-700 mt-1">Unified Search</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="text-xs font-bold text-slate-400">Single Sign-On</div>
                    <div className="text-xl font-black text-teal-700 mt-1">Integrated Console</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="text-xs font-bold text-slate-400">API Access</div>
                    <div className="text-xl font-black text-teal-700 mt-1">Model Context Protocol</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 3 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold">
                  Key Advantage 04
                </div>
                <h3 className="text-2xl sm:text-4xl font-black text-slate-900">
                  Next-Gen Technology Stack (React 19 &amp; Next 15)
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  We adopt state-of-the-art web standards to deliver maximum performance. By leveraging Next.js 15 App Router, React 19 concurrent features, and Tailwind CSS v4, our pages achieve perfect Core Web Vitals and lightning-fast user interactions.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="text-xs font-bold text-slate-400">Lighthouse Score</div>
                    <div className="text-xl font-black text-teal-700 mt-1">98+ Performance</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="text-xs font-bold text-slate-400">Framework</div>
                    <div className="text-xl font-black text-teal-700 mt-1">Next.js 15.5</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="text-xs font-bold text-slate-400">Styling</div>
                    <div className="text-xl font-black text-teal-700 mt-1">Tailwind CSS v4</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 4 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold">
                  Key Advantage 05
                </div>
                <h3 className="text-2xl sm:text-4xl font-black text-slate-900">
                  Founder-Led Stewardship &amp; Direct Reliability
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Direct personal oversight by founder Sabir Usmani guarantees that every client project, deployment pipeline, and corporate venture receives prompt attention, dedicated engineering, and long-term support.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="text-xs font-bold text-slate-400">Accountability</div>
                    <div className="text-xl font-black text-teal-700 mt-1">100% Direct</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="text-xs font-bold text-slate-400">Inquiry Response</div>
                    <div className="text-xl font-black text-teal-700 mt-1">&lt; 2 Hours</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="text-xs font-bold text-slate-400">Direct Support</div>
                    <div className="text-xl font-black text-teal-700 mt-1">Founder Direct</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 5 Numbered Tab Buttons */}
          <div className="flex justify-center items-center gap-3">
            {[0, 1, 2, 3, 4].map((tabIdx) => (
              <button
                key={tabIdx}
                onClick={() => setActiveTab(tabIdx)}
                className={`w-10 h-10 rounded-full font-bold text-xs transition-all cursor-pointer ${
                  activeTab === tabIdx
                    ? "bg-[#20A9BB] text-white shadow-md scale-110"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                0{tabIdx + 1}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          7. OUR COMPETITIVE EDGE (Athenura 4 Pillars)
          ======================================================== */}
      <section className="py-20 lg:py-28 bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
              Our <span className="text-gradient-teal">Competitive Edge</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              What makes Samad Expo a trusted partner for deploying and scaling digital solutions
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Senior Technical Leadership",
                desc: "Every project is architected with modern industry best practices and strict code quality.",
                progress: "95%",
                icon: Award,
              },
              {
                title: "Zero-Config Methodology",
                desc: "Structured automated delivery ensuring quality, lightning-fast timeline, and zero deployment friction.",
                progress: "98%",
                icon: Zap,
              },
              {
                title: "End-to-End Ownership",
                desc: "Full accountability from conception to edge deployment and continuous maintenance.",
                progress: "100%",
                icon: ShieldCheck,
              },
              {
                title: "Cutting-Edge Innovation",
                desc: "Adopting emerging technologies including MCP AI protocols and Next.js 15 server actions.",
                progress: "92%",
                icon: Cpu,
              },
            ].map((col, idx) => (
              <div
                key={idx}
                className="athenura-card p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-5 border border-teal-100">
                    <col.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{col.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{col.desc}</p>
                </div>

                {/* Progress bar at footer (Signature Athenura treatment) */}
                <div className="mt-8 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1.5">
                    <span>Performance Benchmark</span>
                    <span className="text-teal-700">{col.progress}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full rounded-full"
                      style={{ width: col.progress }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          8. BY THE NUMBERS (Animated Metric Showcase)
          ======================================================== */}
      <section ref={statsRef} className="py-20 lg:py-28 bg-white border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="athenura-card p-8 sm:p-14 text-center max-w-5xl mx-auto space-y-12 bg-gradient-to-b from-white to-slate-50/50">
            
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
                By The <span className="text-gradient-teal">Numbers</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-500">
                Quantifying our platform speed, reliability, and commitment to excellence
              </p>
            </div>

            {/* 4 Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-2">
                <div className="text-4xl sm:text-6xl font-black text-[#20A9BB] tracking-tight">
                  {uptime}%
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-700">
                  Uptime Guarantee
                </div>
                <div className="text-[11px] text-slate-400">
                  Global edge infrastructure
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-4xl sm:text-6xl font-black text-[#20A9BB] tracking-tight">
                  {liveTools}+
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-700">
                  Live Web Tools
                </div>
                <div className="text-[11px] text-slate-400">
                  Active ecosystem assets
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-4xl sm:text-6xl font-black text-[#20A9BB] tracking-tight">
                  &lt; {edgeDeployTime}s
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-700">
                  Edge Build Time
                </div>
                <div className="text-[11px] text-slate-400">
                  Instant automated deploy
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-4xl sm:text-6xl font-black text-[#20A9BB] tracking-tight">
                  {monitoringHours}/7
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-700">
                  Continuous Monitoring
                </div>
                <div className="text-[11px] text-slate-400">
                  Enterprise security shield
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          9. THE SAMAD EXPO APPROACH (4-Step Connected Pipeline)
          ======================================================== */}
      <section className="py-20 lg:py-28 bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
              The Samad Expo <span className="text-gradient-teal">Approach</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Our systematic methodology ensures consistent, high-velocity and secure results
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {[
              {
                step: "01",
                title: "Discovery & Strategy",
                desc: "Deep analysis to understand digital goals, tool requirements, and architecture constraints.",
              },
              {
                step: "02",
                title: "Architecture & Planning",
                desc: "Designing robust technical solutions with edge distribution and scalability in mind.",
              },
              {
                step: "03",
                title: "Development & Testing",
                desc: "Agile engineering with 20/20 automated cyber audit verification and performance checks.",
              },
              {
                step: "04",
                title: "Deployment & Support",
                desc: "Seamless live deployment followed by continuous monitoring and feature iteration.",
              },
            ].map((pipe, idx) => (
              <div
                key={idx}
                className="athenura-card p-7 text-center space-y-4 relative"
              >
                {/* Step Circle */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#1E7A86] to-[#28A3B9] text-white font-black text-lg flex items-center justify-center mx-auto shadow-md">
                  {pipe.step}
                </div>

                <h3 className="text-lg font-bold text-slate-900">{pipe.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{pipe.desc}</p>

                {/* Target Ring */}
                <div className="pt-2 flex justify-center">
                  <div className="w-5 h-5 rounded-full border-2 border-teal-500/40 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-teal-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          10. CLIENT & VENTURE TESTIMONIALS
          ======================================================== */}
      <section className="py-20 lg:py-28 bg-white border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
              Client &amp; Partner <span className="text-gradient-teal">Success Stories</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Hear from developers, partners, and businesses growing with Samad Expo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Samad Expo's instant hosting pipeline reduced our website deployment time from hours to literally 3 seconds. The automated SSL and edge speed are simply unmatched.",
                author: "Sameer Patel",
                role: "Lead Full-Stack Engineer",
                org: "NextGen Software Labs",
              },
              {
                quote: "Their team built an architecture that functions as an extension of our vision. The Model Context Protocol integration opens endless AI capabilities.",
                author: "Alok Verma",
                role: "Product Director",
                org: "CloudScale Systems",
              },
              {
                quote: "The reliability and cyber hardening give us total confidence. Every security requirement is baked directly into the hosting environment.",
                author: "Neha Sharma",
                role: "DevOps & Security Specialist",
                org: "VentureCraft India",
              },
            ].map((story, idx) => (
              <div
                key={idx}
                className="athenura-card p-8 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="text-teal-600 text-3xl font-serif leading-none">&ldquo;</div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    {story.quote}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-900 to-teal-800 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    {story.author[0]}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{story.author}</div>
                    <div className="text-[11px] text-slate-500">{story.role} &middot; {story.org}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          11. HIGH-IMPACT CORPORATE CTA SECTION
          ======================================================== */}
      <section className="py-20 lg:py-28 bg-[#040D12] text-white relative isolate overflow-hidden">
        
        {/* Glow */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-teal-500/15 blur-[160px]" />
        
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-teal-300 text-xs font-bold uppercase tracking-wider border border-white/10">
            <Zap className="w-4 h-4 text-teal-400" />
            <span>Launch Your Platform Today</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-tight">
            Turn Ideas Into Live <span className="text-gradient-teal">Digital Platforms.</span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Join developers, creators, and business founders deploying their web projects on Samad Expo&apos;s global edge network. Fast, reliable, and production-ready.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-full bg-white text-slate-950 hover:bg-teal-50 text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 shadow-xl hover:scale-105 active:scale-95"
            >
              <span>Deploy Website Now</span>
              <ArrowRight className="w-4 h-4 text-teal-700" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300"
            >
              <span>Contact Headquarters</span>
              <Mail className="w-4 h-4 text-teal-400" />
            </Link>
          </div>

          <div className="pt-6 text-xs text-zinc-500">
            Official Inquiry: <a href="mailto:officialaadhakh@gmail.com" className="text-teal-400 hover:underline">officialaadhakh@gmail.com</a> &middot; Phone: <a href="tel:+919170230159" className="text-teal-400 hover:underline">+91 91702 30159</a>
          </div>

        </div>
      </section>

      {/* ========================================================
          12. FLOATING ASSISTANT QUICK-ACTION BADGE
          ======================================================== */}
      <div className="fixed bottom-6 right-6 z-40">
        <Link
          href="/contact"
          aria-label="Connect with Samad Expo Support"
          className="animate-athenura-pulse flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#09181C] text-white border border-teal-500/40 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group"
        >
          <div className="w-7 h-7 rounded-full bg-[#20A9BB] flex items-center justify-center text-white shrink-0">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
          <div className="text-left hidden sm:block pr-1">
            <div className="text-[10px] uppercase font-bold text-teal-400 leading-none">Instant Help</div>
            <div className="text-xs font-bold text-white">Contact HQ</div>
          </div>
        </Link>
      </div>

      {/* ========================================================
          13. INSTANT PREVIEW MODAL
          ======================================================== */}
      {previewSite && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-5xl h-[80vh] rounded-3xl bg-slate-900 border border-white/10 overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#071317]">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold text-white text-sm">{previewSite.name}</span>
                <span className="text-xs text-zinc-400 font-mono hidden sm:inline">({publicWebsiteUrl(previewSite.url) || previewSite.url})</span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={publicWebsiteUrl(previewSite.url) || previewSite.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
                >
                  <span>Open Full Site</span>
                  <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewSite(null)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Iframe View */}
            <iframe
              src={publicWebsiteUrl(previewSite.url) || previewSite.url}
              title={previewSite.name}
              className="flex-1 w-full h-full bg-white border-none"
            />
          </div>
        </div>
      )}

    </div>
  );
}
