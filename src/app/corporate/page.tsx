import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";
import {
  ArrowRight,
  ExternalLink,
  Globe,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { publicWebsiteUrl } from "@/lib/corporate-public";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Samad Expo — Corporate Overview",
  description:
    "Corporate overview of Samad Expo: website hosting engine, live digital utilities, engineering services, and leadership.",
};

export default function CorporateHomePage() {
  const db = readDb();
  const profile = db.companyProfile;
  const websites = (db.websiteListings ?? []).filter((w) => w.isPublic !== false);
  const team = (db.teamMembers ?? []).filter((m) => m.isActive !== false);
  const services = (db.corporateServices ?? []).filter(
    (s) => s.status === "active"
  );
  const hostedCount = (db.hostedProjects ?? []).filter(
    (p) =>
      p.visibility === "public" &&
      p.deploymentStatus === "live" &&
      !p.projectName.toLowerCase().includes("automated test platform")
  ).length;

  return (
    <div className="bg-[#060608] min-h-screen text-white">
      {/* Header */}
      <section className="samad-hero-grid border-b border-zinc-800/80 pt-10 pb-14 sm:pt-16 sm:pb-20 relative overflow-hidden">
        <ThreeHeroCanvas variant="dark" />
        <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-[#FFF33D]/15 blur-[120px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <nav className="text-xs text-zinc-400 flex items-center gap-2">
            <Link href="/" className="hover:text-[#FFF33D] font-semibold transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#FFF33D] font-bold">Corporate Overview</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF33D]/10 border border-[#FFF33D]/30 text-[#FFF33D] font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Corporate Gateway</span>
            </span>

            <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight tracking-tight">
              <span className="samad-highlight">
                {profile?.businessName ?? "Samad Expo"}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
              {profile?.tagline ??
                "Modern Website Hosting, Developer Tools & Digital Solutions"}
            </p>

            <div className="pt-2 flex flex-wrap gap-3.5">
              <Link
                href="/about-company"
                className="btn-3d-yellow inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-wider"
              >
                <span>Company Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/websites"
                className="btn-3d-black inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-wider"
              >
                <Globe className="w-4 h-4 text-[#FFF33D]" />
                <span>Public Directory</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Metrics Strip */}
      <section className="bg-[#FFF33D] border-b border-black/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-black/15">
            {[
              { label: "Public Web Tools", value: websites.length },
              { label: "Hosted Deployments", value: hostedCount },
              { label: "Leadership", value: team.length || 1 },
              { label: "Active Services", value: services.length },
            ].map((stat) => (
              <div key={stat.label} className="p-6 text-center">
                <div className="text-3xl font-black text-black">{stat.value}</div>
                <div className="text-[11px] font-extrabold text-zinc-900 uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story + Core Values */}
      <section className="bg-[#0B0B0F] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-white tracking-tight">
                Digital Engineering &amp;{" "}
                <span className="samad-highlight">Hosting Platform</span>
              </h2>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                {profile?.about}
              </p>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {profile?.mission}
              </p>
              <div className="pt-2">
                <Link
                  href="/founder"
                  className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#FFF33D] hover:text-white transition"
                >
                  <span>Meet Founder {profile?.founderName || "Sabir Usmani"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(profile?.coreValues ?? []).slice(0, 4).map((val, i) => (
                <Card3D key={i} intensity={10}>
                  <div className="samad-card p-5 space-y-2 h-full">
                    <div className="w-8 h-8 rounded-lg bg-[#FFF33D] text-black font-black text-xs flex items-center justify-center shadow-sm shadow-[#FFF33D]/20">
                      0{i + 1}
                    </div>
                    <h3 className="text-sm font-extrabold text-white">
                      {val.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                </Card3D>
              ))}
            </div>
          </div>

          {/* Featured Live Platforms */}
          {websites.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h2 className="text-2xl font-black text-white">
                  Featured Digital Platforms
                </h2>
                <Link
                  href="/websites"
                  className="text-xs font-extrabold text-[#FFF33D] hover:text-white inline-flex items-center gap-1 transition"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {websites.slice(0, 6).map((site) => {
                  const ext = publicWebsiteUrl(site.url);
                  return (
                    <Card3D key={site.id} intensity={9}>
                      <div className="samad-card p-6 flex flex-col justify-between h-full">
                        <div className="space-y-2 mb-5">
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FFF33D]/10 border border-[#FFF33D]/30 text-[10px] font-bold text-[#FFF33D]">
                            {site.category}
                          </span>
                          <h3 className="text-lg font-extrabold text-white">
                            {site.name}
                          </h3>
                          <p className="text-xs text-zinc-400 line-clamp-3">
                            {site.shortDescription}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                          <Link
                            href={`/websites/${site.slug}`}
                            className="text-xs font-bold text-zinc-300 hover:text-[#FFF33D] transition"
                          >
                            Details
                          </Link>
                          {ext && (
                            <a
                              href={ext}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-3d-yellow inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-extrabold"
                            >
                              <span>Open</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </Card3D>
                  );
                })}
              </div>
            </div>
          )}

          {/* Security Commitment */}
          <Card3D intensity={5}>
            <div className="samad-card p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-[#FFF33D]/35">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 text-[#FFF33D] text-xs font-extrabold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Ready to Deploy</span>
                </div>
                <h2 className="text-2xl font-black text-white">
                  Host Your Static Website with Zero Setup
                </h2>
              </div>

              <Link
                href="/dashboard"
                className="btn-3d-yellow px-6 py-3 rounded-full text-xs uppercase tracking-wider shrink-0"
              >
                Open Console →
              </Link>
            </div>
          </Card3D>
        </div>
      </section>
    </div>
  );
}
