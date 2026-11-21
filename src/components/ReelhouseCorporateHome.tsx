"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowUp,
  Play,
  Menu,
  X,
  CheckCircle2,
  Search,
  Sparkles,
  UploadCloud,
  Globe,
  Monitor,
  Cpu,
} from "lucide-react";
import { publicWebsiteUrl } from "@/lib/corporate-public";
import { Logo } from "@/components/Logo";
import { HeaderAuthControl } from "@/components/HeaderAuthControl";
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

const homeNavLinks = [
  { id: "about", label: "About" },
  { id: "hosting", label: "Hosting" },
  { id: "work", label: "Projects" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
];

const heroPhrases = [
  "instant website hosting.",
  "live web deployments.",
  "practical web tools.",
  "modern digital platforms.",
];

function useAnimatedCounter(target: number, start: boolean, durationMs = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (target <= 0) {
      setValue(0);
      return;
    }
    let rafId = 0;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [liveTimecode, setLiveTimecode] = useState("00 : 00 : 00");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openServiceId, setOpenServiceId] = useState<string | null>(
    services[0]?.id || null
  );
  const [statsInView, setStatsInView] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 65, my: 45 });

  useEffect(() => {
    let mounted = true;
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (mounted && data?.user) {
          const target = data.user.role === "admin" ? "/admin/corporate" : "/dashboard";
          window.location.href = target;
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const statsRef = useRef<HTMLDivElement>(null);

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    division: "",
    message: "",
    consent: false,
  });

  const ownerProjectUrls = useMemo(
    () =>
      new Set([
        "https://sabirusmani077.github.io/Age-calculator",
        "https://sabirusmani077.github.io/MDK-Convertor",
        "https://sabirusmani077.github.io/Self-Portfolio-",
      ]),
    []
  );

  const showcaseWebsites = useMemo(
    () => [
      ...websites.filter((website) =>
        ownerProjectUrls.has((website.url || "").replace(/\/$/, ""))
      ),
      ...websites.filter(
        (website) =>
          !ownerProjectUrls.has((website.url || "").replace(/\/$/, ""))
      ),
    ],
    [websites, ownerProjectUrls]
  );

  const liveWebsites = useMemo(
    () =>
      showcaseWebsites.filter(
        (w) => w.status === "live" && Boolean(publicWebsiteUrl(w.url))
      ),
    [showcaseWebsites]
  );

  const categories = useMemo(() => {
    const uniqueCats = Array.from(
      new Set(showcaseWebsites.map((w) => w.category).filter(Boolean))
    );
    return ["All", "Live", ...uniqueCats];
  }, [showcaseWebsites]);

  const filteredWebsites = useMemo(() => {
    if (selectedCategory === "All") return showcaseWebsites;
    if (selectedCategory === "Live") {
      return showcaseWebsites.filter((w) => w.status === "live");
    }
    return showcaseWebsites.filter((w) => w.category === selectedCategory);
  }, [showcaseWebsites, selectedCategory]);

  const workItems = useMemo(
    () =>
      filteredWebsites.slice(0, 7).map((website, index) => ({
        id: website.id,
        name: website.name,
        concept: `Website ${String(index + 1).padStart(2, "0")}`,
        badge: website.status.replace(/_/g, " ").toUpperCase(),
        category: website.category,
        title: website.name,
        description: website.shortDescription || website.description,
        image:
          website.banner || website.screenshots?.[0] || website.logo || "",
        previewUrl:
          website.status === "live" ? publicWebsiteUrl(website.url) : null,
        href: `/websites/${website.slug}`,
        itemClass: index < 4 ? `work-item-${index + 1}` : "work-item-extra",
      })),
    [filteredWebsites]
  );

  // Scroll progress bar, scrolled header & back-to-top visibility
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        setIsScrolled(scrollTop > 32);
        setShowBackToTop(scrollTop > 420);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active nav section tracking
  useEffect(() => {
    const sections = ["about", "hosting", "work", "services", "contact"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target instanceof HTMLElement) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: "-18% 0px -62% 0px", threshold: [0, 0.05, 0.15] }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Scroll-triggered reveal observer for all [data-reveal] elements
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!nodes.length) return;

    if (typeof IntersectionObserver === "undefined") {
      nodes.forEach((n) => n.classList.add("is-visible"));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    nodes.forEach((node) => revealObserver.observe(node));

    // Safety fallback so nothing ever stays hidden
    const fallbackTimer = window.setTimeout(() => {
      nodes.forEach((n) => n.classList.add("is-visible"));
    }, 1800);

    return () => {
      revealObserver.disconnect();
      window.clearTimeout(fallbackTimer);
    };
  }, [selectedCategory]);

  // Stats strip visibility observer for animated count-ups
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Rotating hero kinetic phrase every 3.4s
  useEffect(() => {
    const timer = window.setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % heroPhrases.length);
    }, 3400);
    return () => window.clearInterval(timer);
  }, []);

  // Live IST clock in hero timecode
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString("en-IN", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setLiveTimecode(formatted.split(":").join(" : "));
    };
    updateClock();
    const timer = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const statLiveCount = useAnimatedCounter(
    Math.max(liveWebsites.length, 3),
    statsInView
  );
  const statTotalProjects = useAnimatedCounter(
    showcaseWebsites.length,
    statsInView
  );
  const statDivisionsCount = useAnimatedCounter(divisions.length, statsInView);
  const statServicesCount = useAnimatedCounter(services.length, statsInView);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const yRatio = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - yRatio) * 10,
      ry: (xRatio - 0.5) * 12,
      mx: Math.round(xRatio * 100),
      my: Math.round(yRatio * 100),
    });
  };

  const handleHeroMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, mx: 65, my: 45 });
  };

  const handleDiscussService = (serviceName: string) => {
    setFormData((prev) => ({ ...prev, service: serviceName }));
    const contactEl = document.getElementById("contact");
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError("");
    setFormSuccess(false);

    try {
      const res = await fetch("/api/corporate/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: "",
          subject: formData.service || "General Inquiry",
          inquiryType: "business",
          relatedBusiness: formData.division,
          message: formData.message,
          consent: formData.consent,
        }),
      });

      if (res.ok) {
        setFormSuccess(true);
        setFormData({
          name: "",
          email: "",
          company: "",
          service: "",
          division: "",
          message: "",
          consent: false,
        });
      } else {
        const data = await res.json().catch(() => ({}));
        setFormError(data.error || "Failed to send inquiry. Please try again.");
      }
    } catch {
      setFormError("Network error. Please try again later.");
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>

      <div className="premium-home">
        <header
          className={`premium-home-header ${isScrolled ? "is-scrolled" : ""}`}
        >
          <div className="premium-home-nav">
            <Logo size="md" showTagline />
            <nav className="premium-home-links" aria-label="Main navigation">
              {homeNavLinks.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={activeSection === item.id ? "active" : undefined}
                  aria-current={activeSection === item.id ? "location" : undefined}
                >
                  {item.label}
                  <ArrowUpRight className="home-nav-arrow" aria-hidden="true" />
                </a>
              ))}
            </nav>
            <div className="premium-home-actions">
              <Link href="/websites" className="home-store-link">
                Ecosystem
              </Link>
              <HeaderAuthControl isHeroHeader />
              <button
                type="button"
                className="home-menu-toggle"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="home-mobile-nav"
                onClick={() => setMenuOpen((open) => !open)}
              >
                {menuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          {menuOpen && (
            <nav
              id="home-mobile-nav"
              className="premium-home-mobile-nav"
              aria-label="Mobile main navigation"
            >
              {homeNavLinks.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              ))}
              <Link href="/websites" onClick={() => setMenuOpen(false)}>
                Digital ecosystem
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                Dashboard &amp; Deployments
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </nav>
          )}
        </header>

        {/* Main Content Area */}
        <div className="site-content">
          <main id="main">
            {/* 1. HERO SECTION */}
            <section
              id="top"
              className="hero premium-hero"
              onMouseMove={handleHeroMouseMove}
              onMouseLeave={handleHeroMouseLeave}
              style={
                {
                  "--mx": `${tilt.mx}%`,
                  "--my": `${tilt.my}%`,
                } as React.CSSProperties
              }
            >
              <div className="premium-hero-bg" aria-hidden="true" />
              <div className="hero-shade" aria-hidden="true" />
              <div className="hero-cursor-glow" aria-hidden="true" />

              <div className="hero-topline">
                <span className="eyebrow">
                  Independent vision. Collective craft.
                </span>
                <a href="#contact" className="eyebrow">
                  Have an idea? <ArrowUpRight className="w-[15px] h-[15px]" />
                </a>
              </div>

              {/* HERO MAIN GRID CONTAINER: Headline on left, Login Popup on right */}
              <div className="hero-grid-container">
                <div className="hero-content">
                  <p className="eyebrow hero-eyebrow">
                    <span className="blue-square"></span>Corporate headquarters ·
                    Agra, India
                  </p>
                  <h1>
                    Websites into
                    <br />
                    <em key={phraseIndex} className="hero-kinetic-word">
                      {heroPhrases[phraseIndex]}
                    </em>
                  </h1>
                  <p className="hero-description">
                    Samad Expo provides multi-user website hosting, instant ZIP deployments, and high-performance digital tools under one verified platform.
                  </p>
                  <div className="hero-actions">
                    <Link href="/dashboard" className="blue-button">
                      <Play className="w-[14px] h-[14px] fill-current" />
                      Deploy your website
                    </Link>
                    <Link className="text-link" href="/websites">
                      Explore hosted websites{" "}
                      <ArrowUpRight className="w-[17px] h-[17px]" />
                    </Link>
                  </div>
                  <form
                    action="/ecosystem-search"
                    method="get"
                    className="hero-search mt-5 flex max-w-lg items-center gap-2 rounded-xl border p-2"
                  >
                    <Search className="ml-2 h-4 w-4 shrink-0" />
                    <label className="sr-only" htmlFor="home-ecosystem-search">
                      Search websites, businesses, and services
                    </label>
                    <input
                      id="home-ecosystem-search"
                      name="q"
                      type="search"
                      minLength={2}
                      maxLength={100}
                      placeholder="Search websites, businesses, services"
                      className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm outline-none"
                    />
                    <button
                      type="submit"
                      className="rounded-lg bg-[#FFF33D] px-3.5 py-2 text-xs font-extrabold text-black border border-black/15 transition hover:bg-black hover:text-[#FFF33D] cursor-pointer"
                    >
                      Search
                    </button>
                  </form>
                </div>

                {/* Right Column: Console Login / Sign-up Popup Card */}
                <div className="hero-visual">
                  <HeroAuthCard />
                </div>
              </div>

              <div className="hero-bottom">
                <a href="#about" className="eyebrow">
                  <ArrowDown className="w-[17px] h-[17px]" />
                  Scroll to explore
                </a>
                <span className="hero-frame eyebrow" suppressHydrationWarning>
                  [ {liveTimecode} ]
                </span>
                <span className="hero-caption eyebrow">
                  Central Digital Headquarters
                </span>
              </div>

              <span className="hero-vertical eyebrow">00 — Headquarters</span>
            </section>

            {/* DYNAMIC LIVE ECOSYSTEM METRICS STRIP */}
            <div ref={statsRef} className="live-stats-strip" aria-label="Live platform statistics">
              <div className="live-stat-card" data-reveal style={{ "--reveal-delay": "0ms" } as React.CSSProperties}>
                <strong>{String(statLiveCount).padStart(2, "0")}+</strong>
                <span>Live Hosted Websites</span>
              </div>
              <div className="live-stat-card" data-reveal style={{ "--reveal-delay": "80ms" } as React.CSSProperties}>
                <strong>15+</strong>
                <span>Registered Developers</span>
              </div>
              <div className="live-stat-card" data-reveal style={{ "--reveal-delay": "160ms" } as React.CSSProperties}>
                <strong>99.9%</strong>
                <span>Platform Uptime</span>
              </div>
              <div className="live-stat-card" data-reveal style={{ "--reveal-delay": "240ms" } as React.CSSProperties}>
                <strong>{String(statServicesCount).padStart(2, "0")}</strong>
                <span>Core Capabilities</span>
              </div>
            </div>

            {/* 2. STUDIO INTRO SECTION */}
            <section id="about" className="studio-intro">
              <p className="eyebrow" data-reveal style={{ "--reveal-delay": "0ms" } as React.CSSProperties}>
                <span className="red-square"></span>This is Samad Expo.
              </p>
              <div
                data-reveal
                style={{ "--reveal-delay": "60ms" } as React.CSSProperties}
              >
                <h2>
                  Not just platforms.
                  <br />
                  <em>Ecosystems.</em>
                </h2>
              </div>
              <div
                className="intro-copy space-y-5"
                data-reveal
                style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
              >
                <div className="relative pl-5 border-l-3 border-[#FFF33D]">
                  <p className="text-lg sm:text-xl lg:text-[22px] font-semibold text-slate-950 leading-relaxed tracking-tight">
                    <span className="font-extrabold text-black underline decoration-[#FFF33D] decoration-2 underline-offset-4">
                      An independent business ecosystem.
                    </span>{" "}
                    Samad Expo serves as the parent corporate company, guiding
                    vision, and central digital gateway for all our independent
                    businesses, digital applications, web platforms, and
                    innovative technology ventures.
                  </p>
                </div>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal pl-5">
                  From the first conceptual blueprint to enterprise cloud
                  deployment, we bring a long-term mindset and meticulous
                  engineering to every platform. Each venture maintains complete
                  brand autonomy and dedicated customer focus, strengthened by
                  shared governance and capital.
                </p>
                <div className="pt-2 pl-5">
                  <a
                    href="/about-company"
                    className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#FFF33D] hover:text-black hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span>Get to know us</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <span aria-hidden="true" className="intro-aperture">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </section>

            {/* 3. SELECTED WORK / DIGITAL ECOSYSTEM */}
            <section id="work" className="section selected-work">
              <div
                data-reveal
                style={{ "--reveal-delay": "0ms" } as React.CSSProperties}
              >
                <div className="section-heading">
                  <div className="section-heading-main">
                    <span className="section-index" aria-hidden="true">
                      01
                    </span>
                    <div>
                      <p className="eyebrow">
                        <span className="red-square"></span>Selected work /
                        Digital Ecosystem
                      </p>
                      <h2>
                        Different platforms.
                        <br />
                        <em>Same obsession.</em>
                      </h2>
                    </div>
                  </div>
                  <p className="heading-description">
                    A curated showcase of our live digital platforms, web
                    applications, and enterprise technology.
                  </p>
                </div>
              </div>

              {/* Interactive Dynamic Filter Tabs */}
              <div
                className="ecosystem-filter-bar"
                role="tablist"
                aria-label="Filter digital ecosystem by category"
                data-reveal
                style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
              >
                {categories.map((cat) => {
                  const count =
                    cat === "All"
                      ? showcaseWebsites.length
                      : cat === "Live"
                      ? showcaseWebsites.filter((w) => w.status === "live")
                          .length
                      : showcaseWebsites.filter((w) => w.category === cat)
                          .length;
                  const active = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedCategory(cat)}
                      className={`ecosystem-filter-pill ${
                        active ? "is-active" : ""
                      }`}
                    >
                      <span>{cat}</span>
                      <span className="ecosystem-filter-count">{count}</span>
                    </button>
                  );
                })}
              </div>

              <div className="work-grid">
                {workItems.map((item, idx) => (
                  <div
                    key={`${selectedCategory}-${item.id}`}
                    className={`work-item work-item-animated ${item.itemClass}`}
                    style={
                      {
                        animationDelay: `${idx * 75}ms`,
                      } as React.CSSProperties
                    }
                  >
                    <Link
                      href={item.href}
                      className="work-media block text-left"
                      aria-label={`Explore ${item.name}`}
                    >
                      {item.image ? (
                        <img src={item.image} alt={item.name} loading="lazy" />
                      ) : item.previewUrl ? (
                        <>
                          <iframe
                            src={item.previewUrl}
                            title={`${item.name} live preview`}
                            loading="lazy"
                            tabIndex={-1}
                            aria-hidden="true"
                            referrerPolicy="strict-origin-when-cross-origin"
                            sandbox="allow-forms allow-scripts allow-same-origin allow-downloads allow-popups"
                            className="work-preview-frame"
                          />
                          <span className="work-preview-badge">
                            Live website preview
                          </span>
                        </>
                      ) : (
                        <span className="flex h-full min-h-64 items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 p-8 text-center text-3xl font-black text-white/60">
                          {item.name}
                        </span>
                      )}
                      <span className="work-corner top-left"></span>
                      <span className="work-corner bottom-right"></span>
                      <span className="work-image-top">
                        <span className="eyebrow">{item.badge}</span>
                        <span className="eyebrow">{item.concept}</span>
                      </span>
                      <span className="work-play">
                        <Play className="w-[19px] h-[19px] fill-current" />
                      </span>
                      <span className="work-image-bottom">
                        <span>Explore Platform</span>
                        <ArrowUpRight className="w-[21px] h-[21px]" />
                      </span>
                    </Link>
                    <div className="work-caption">
                      <div>
                        <p className="eyebrow">{item.category}</p>
                        <h3>
                          <Link href={item.href}>{item.title}</Link>
                        </h3>
                      </div>
                      <Link
                        href={item.href}
                        className="work-open"
                        aria-label={`View ${item.name}`}
                      >
                        <ArrowUpRight className="w-[23px] h-[23px]" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex justify-center">
                <Link href="/websites" className="text-link">
                  Explore all websites{" "}
                  <ArrowUpRight className="w-[17px] h-[17px]" />
                </Link>
              </div>

              <p className="portfolio-note eyebrow">
                Independent platforms, unified corporate governance. Your
                venture could be next.
              </p>
              <span className="vertical-label">01 — Digital Ecosystem</span>
            </section>

            {/* 4. PLATFORM ARCHITECTURE & INSTANT HOSTING */}
            <section
              id="hosting"
              className="py-20 px-4 sm:px-6 lg:px-8 border-y border-zinc-200 bg-[#FAFAFA]"
              aria-label="Platform Architecture and Website Hosting"
              data-reveal
            >
              <div className="mx-auto max-w-7xl">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
                  <div>
                    <p className="eyebrow flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-[#FFF33D] inline-block border border-black/30"></span>
                      Core Platform Engine
                    </p>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight">
                      Deploy any website in seconds.
                    </h2>
                  </div>
                  <p className="text-sm sm:text-base text-zinc-600 max-w-xl">
                    Our self-contained multi-tenant web platform lets developers and creators upload ZIP archives, inspect responsive previews, and share production-ready URLs instantly.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-black text-[#FFF33D] flex items-center justify-center font-black mb-4">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-black text-black mb-2">1-Click ZIP Upload</h3>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      Upload your raw static files or bundle. Files are extracted, verified, and mapped to your workspace instantly.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-black text-[#FFF33D] flex items-center justify-center font-black mb-4">
                      <Monitor className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-black text-black mb-2">Live Multi-Device Preview</h3>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      Switch seamlessly between Desktop, Tablet, and Mobile viewports directly inside the developer workspace.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-black text-[#FFF33D] flex items-center justify-center font-black mb-4">
                      <Globe className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-black text-black mb-2">Instant Public URLs</h3>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      Every project gets a shareable production URL and is showcased in the searchable Public Directory.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-black text-[#FFF33D] flex items-center justify-center font-black mb-4">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-black text-black mb-2">Developer Dashboard</h3>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      Manage project status, view storage usage, edit metadata, or toggle visibility with full administrative control.
                    </p>
                  </div>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-4 pt-4 border-t border-zinc-200">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3.5 text-xs font-black uppercase tracking-wider text-[#FFF33D] hover:bg-zinc-800 transition-colors shadow-sm"
                  >
                    <span>Deploy Your Website</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/websites"
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-6 py-3.5 text-xs font-black uppercase tracking-wider text-black hover:border-black transition-colors"
                  >
                    <span>Browse Public Directory</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </section>

            {/* 6. WHAT WE DO / DYNAMIC SERVICES ACCORDION */}
            <section id="services" className="section services-section">
              <div
                data-reveal
                style={{ "--reveal-delay": "0ms" } as React.CSSProperties}
              >
                <div className="section-heading">
                  <div className="section-heading-main">
                    <span className="section-index" aria-hidden="true">
                      02
                    </span>
                    <div>
                      <p className="eyebrow">
                        <span className="red-square"></span>From concept to
                        high-scale execution
                      </p>
                      <h2>The whole picture.</h2>
                    </div>
                  </div>
                  <p className="heading-description">
                    One parent enterprise. Every part of the digital stack. Come
                    to us with a vision, an enterprise need, or a partnership
                    proposition.
                  </p>
                </div>
              </div>

              <div
                className="service-list"
                data-reveal
                style={{ "--reveal-delay": "90ms" } as React.CSSProperties}
              >
                {services.map((service, index) => {
                  const isOpen = openServiceId === service.id;
                  return (
                    <div
                      key={service.id}
                      id={service.slug}
                      className={`dynamic-service-row ${isOpen ? "is-open" : ""}`}
                    >
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() =>
                          setOpenServiceId(isOpen ? null : service.id)
                        }
                        className="dynamic-service-trigger"
                      >
                        <span className="service-number eyebrow">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3>{service.name}</h3>
                        <span className="service-tags eyebrow">
                          {service.category}
                        </span>
                        <ArrowDown className="w-[21px] h-[21px] dynamic-service-icon" />
                      </button>

                      <div className="dynamic-service-panel">
                        <div className="dynamic-service-panel-inner">
                          <div className="dynamic-service-body space-y-3">
                            {service.shortDescription && (
                              <p className="service-subtitle font-bold text-slate-900">
                                {service.shortDescription}
                              </p>
                            )}
                            <p className="text-slate-600 leading-relaxed">
                              {service.description}
                            </p>
                            <button
                              type="button"
                              onClick={() => handleDiscussService(service.name)}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-black hover:text-zinc-700 underline transition-colors cursor-pointer pt-1"
                            >
                              <span>Discuss {service.name}</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {!services.length && (
                  <p className="eyebrow">
                    Services will appear here when published by the company.
                  </p>
                )}
              </div>

              <div className="services-bottom">
                <p className="eyebrow">
                  {services.length} published service
                  {services.length === 1 ? "" : "s"}
                </p>
                <a href="#contact" className="text-link">
                  Discuss your requirement{" "}
                  <ArrowUpRight className="w-[17px] h-[17px]" />
                </a>
              </div>

              <span className="vertical-label">02 — Capabilities</span>
            </section>

            {/* 7. CONTACT SECTION */}
            <section id="contact" className="section contact-section">
              <div className="contact-layout">
                <div
                  className="contact-copy"
                  data-reveal
                  style={{ "--reveal-delay": "0ms" } as React.CSSProperties}
                >
                  <div className="section-heading">
                    <div className="section-heading-main">
                      <span className="section-index" aria-hidden="true">
                        03
                      </span>
                      <div>
                        <p className="eyebrow">
                          <span className="red-square"></span>The next great
                          venture could be yours
                        </p>
                        <h2>
                          Let’s make
                          <br />
                          <em>something move.</em>
                        </h2>
                      </div>
                    </div>
                  </div>

                  <p className="contact-introduction">
                    An idea on a napkin. An enterprise partnership inquiry.
                    <br />
                    We’d love to hear what you’re thinking.
                  </p>

                  <a
                    className="contact-email"
                    href={`mailto:${
                      profile?.contactEmail || "contact@mdenterprises.in"
                    }`}
                  >
                    {profile?.contactEmail || "sabirusmani159@gmail.com"}{" "}
                    <ArrowUpRight className="w-[23px] h-[23px]" />
                  </a>

                  <div className="contact-info">
                    <div>
                      <span className="eyebrow">Headquarters &amp; Business Address</span>
                      <p>
                        <a
                          href="https://maps.app.goo.gl/UnzqY6kZ3i2BRieKA"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#FFF33D] transition-colors inline-flex items-center gap-1 font-semibold"
                        >
                          {profile?.contactAddress || "Bodla, Agra, Uttar Pradesh 282010, India"} ↗
                        </a>
                        <br />
                        {profile?.contactPhone ? (
                          <a
                            href={`tel:${profile.contactPhone.replace(
                              /[^\d+]/g,
                              ""
                            )}`}
                            className="hover:text-[#FFF33D] transition-colors"
                          >
                            {profile.contactPhone}
                          </a>
                        ) : (
                          "Operating across digital and physical domains."
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="eyebrow">Our approach</span>
                      <p>
                        Direct leadership engagement.
                        <br />
                        Thoughtful, fast execution.
                      </p>
                    </div>
                  </div>

                  <span className="contact-red-mark" aria-hidden="true">
                    ↗
                  </span>
                </div>

                <div
                  className="brief-panel"
                  data-reveal
                  style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
                >
                  <form className="project-form" onSubmit={handleSubmit}>
                    <div className="form-heading">
                      <h3>A little about your project.</h3>
                      <span className="eyebrow">01 / The brief</span>
                    </div>

                    {formSuccess && (
                      <div className="p-4 mb-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                        <span>
                          Thank you. Your inquiry has been received and will be
                          reviewed.
                        </span>
                      </div>
                    )}

                    {formError && (
                      <div className="p-4 mb-4 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-xs">
                        {formError}
                      </div>
                    )}

                    <div className="form-grid">
                      <div className="field">
                        <label htmlFor="brief-name">
                          Your name <span>*</span>
                        </label>
                        <input
                          id="brief-name"
                          placeholder="First and last name"
                          required
                          minLength={2}
                          maxLength={200}
                          autoComplete="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>

                      <div className="field">
                        <label htmlFor="brief-email">
                          Email address <span>*</span>
                        </label>
                        <input
                          id="brief-email"
                          placeholder="you@company.com"
                          type="email"
                          required
                          maxLength={254}
                          autoComplete="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </div>

                      <div className="field full-width">
                        <label htmlFor="brief-company">
                          Company or business name
                        </label>
                        <input
                          id="brief-company"
                          placeholder="Your organization (optional)"
                          maxLength={200}
                          autoComplete="organization"
                          value={formData.company}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              company: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="field">
                        <label htmlFor="brief-service">
                          What are you thinking? <span>*</span>
                        </label>
                        <select
                          id="brief-service"
                          required
                          value={formData.service}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              service: e.target.value,
                            })
                          }
                        >
                          <option value="" disabled>
                            Select a service
                          </option>
                          {services.map((service) => (
                            <option key={service.id} value={service.name}>
                              {service.name}
                            </option>
                          ))}
                          <option value="General inquiry">
                            General inquiry
                          </option>
                        </select>
                      </div>

                      <div className="field">
                        <label htmlFor="brief-division">
                          Platform or Topic <span>*</span>
                        </label>
                        <select
                          id="brief-division"
                          required
                          value={formData.division}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              division: e.target.value,
                            })
                          }
                        >
                          <option value="" disabled>
                            Select a category
                          </option>
                          <option value="Website Hosting Platform">
                            Website Hosting &amp; Deployment
                          </option>
                          <option value="Custom Web Engineering">
                            Custom Web Engineering &amp; Development
                          </option>
                          <option value="Developer Account & Support">
                            Developer Account &amp; Support
                          </option>
                          <option value="General Corporate Inquiry">
                            General Corporate Inquiry
                          </option>
                          {websites
                            .filter((website) => website.isPublic !== false)
                            .map((website) => (
                              <option key={website.id} value={website.name}>
                                Website: {website.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="field full-width">
                        <label htmlFor="brief-message">
                          Tell us the story <span>*</span>
                        </label>
                        <textarea
                          id="brief-message"
                          placeholder="The idea, the scope, the timeline, or the partnership opportunity…"
                          required
                          minLength={10}
                          maxLength={5000}
                          rows={4}
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              message: e.target.value,
                            })
                          }
                        ></textarea>
                        <span className="field-hint">
                          A brief description or clear idea is completely fine.
                        </span>
                      </div>
                    </div>

                    <label className="consent-field">
                      <input
                        type="checkbox"
                        required
                        checked={formData.consent}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            consent: e.target.checked,
                          })
                        }
                      />
                      <span>
                        I agree to Samad Expo using these details to respond
                        to my project inquiry.
                      </span>
                    </label>

                    <button
                      type="submit"
                      className="red-button submit-brief cursor-pointer"
                      disabled={formSubmitting}
                    >
                      {formSubmitting
                        ? "Sending inquiry..."
                        : "Let’s start the conversation"}{" "}
                      <ArrowUpRight className="w-[19px] h-[19px]" />
                    </button>

                    <p className="form-bottom-note">
                      Direct response from leadership. No bureaucracy.
                    </p>
                  </form>
                </div>
              </div>

              <span className="vertical-label">03 — Start something</span>
            </section>
          </main>
        </div>
      </div>

      {/* Floating Back-to-Top Button */}
      <button
        type="button"
        aria-label="Scroll back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`back-to-top-btn ${showBackToTop ? "is-shown" : ""}`}
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </>
  );
}
