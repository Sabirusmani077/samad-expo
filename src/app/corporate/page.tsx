import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { publicWebsiteUrl } from "@/lib/corporate-public";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Corporate Overview | Samad Expo",
  description:
    "Corporate overview of Samad Expo: website hosting studio, curated web utilities, engineering services, and governance.",
};

export default function CorporateHomePage() {
  const db = readDb();
  const profile = db.companyProfile;
  const websites = (db.websiteListings ?? []).filter(
    (w) =>
      w.isPublic !== false &&
      !w.slug.includes("sabir") &&
      !w.name.toLowerCase().includes("sabir")
  );
  const services = (db.corporateServices ?? []).filter(
    (s) => s.status === "active"
  );
  const hostedCount = (db.hostedProjects ?? []).filter(
    (p) =>
      p.visibility === "public" &&
      p.deploymentStatus === "live" &&
      !p.projectName.toLowerCase().includes("automated test platform") &&
      !p.projectName.toLowerCase().includes("sabir") &&
      !p.slug.includes("sabir")
  ).length;

  return (
    <div className="bg-white min-h-screen text-[#1D1C1C]">
      <section className="samad-hero-grid border-b border-[#C8A464]/25 pt-14 pb-16 sm:pt-20 sm:pb-24 relative overflow-hidden text-white">
        <ThreeHeroCanvas variant="dark" className="opacity-80" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0A0C] via-[#0B0A0C]/40 to-transparent z-[1]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <nav className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
            <Link href="/" className="hover:text-[#C8A464] transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#C8A464]">Corporate Overview</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#C8A464]">
              Corporate Gateway
            </div>

            <h1 className="text-3xl sm:text-6xl font-bold uppercase tracking-[0.14em] text-white leading-tight">
              {profile?.businessName ?? "Samad Expo"}
            </h1>

            <p className="font-editorial-serif italic text-base sm:text-xl text-zinc-300 leading-relaxed">
              {profile?.tagline ??
                "Instant Website Hosting, Curated Web Utilities & Digital Engineering"}
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-5">
              <Link
                href="/about-company"
                className="btn-maison-light px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.22em]"
              >
                The Maison Story
              </Link>
              <Link
                href="/websites"
                className="font-editorial-serif italic text-base text-[#E5C78E] border-b border-[#C8A464]/50 hover:border-white hover:text-white pb-0.5 transition"
              >
                Public Creations Catalogue
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cartier Crimson Verified Metrics Ribbon */}
      <section className="bg-[#C10016] text-white border-b border-[#9E0012]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/20">
            {[
              { label: "Public Web Tools", value: websites.length },
              { label: "Hosted Deployments", value: hostedCount },
              { label: "Established", value: profile?.founded || "2024" },
              { label: "Active Services", value: services.length },
            ].map((stat) => (
              <div key={stat.label} className="p-6 text-center">
                <div className="font-editorial-serif italic text-3xl text-white">
                  {stat.value}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/85 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FAF7F2] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-[0.16em] text-[#1D1C1C]">
                Digital Engineering &amp; Hosting Maison
              </h2>
              <p className="font-editorial-serif text-base text-[#595959] leading-relaxed">
                {profile?.about}
              </p>
              <p className="font-editorial-serif italic text-sm text-[#767676] leading-relaxed">
                {profile?.mission}
              </p>
              <div className="pt-2">
                <Link
                  href="/about-company"
                  className="font-editorial-serif italic text-base text-[#1D1C1C] border-b border-[#1D1C1C] hover:text-[#C10016] hover:border-[#C10016] pb-0.5 transition"
                >
                  Explore Company Profile
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {(profile?.coreValues ?? []).slice(0, 4).map((val, i) => (
                <Card3D key={i} intensity={5}>
                  <div className="samad-card p-6 space-y-2 h-full border-t-2 border-t-[#C10016]">
                    <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#C8A464]">
                      0{i + 1}
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-[#1D1C1C]">
                      {val.title}
                    </h3>
                    <p className="font-editorial-serif text-sm text-[#595959] leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                </Card3D>
              ))}
            </div>
          </div>

          {websites.length > 0 && (
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-3">
                <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-[#1D1C1C]">
                  Featured Creations
                </h2>
                <Link
                  href="/websites"
                  className="font-editorial-serif italic text-sm text-[#C10016] hover:underline"
                >
                  View All Catalogue
                </Link>
              </div>

              <div
                className={`grid ${
                  websites.length <= 1
                    ? "grid-cols-1 max-w-xl"
                    : websites.length === 2 || websites.length === 4
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                } gap-6`}
              >
                {websites.slice(0, 6).map((site) => {
                  const ext = publicWebsiteUrl(site.url);
                  return (
                    <Card3D key={site.id} intensity={5}>
                      <div className="samad-card p-7 flex flex-col justify-between h-full">
                        <div className="space-y-2 mb-5">
                          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C10016]">
                            {site.category}
                          </span>
                          <h3 className="text-base font-bold uppercase tracking-[0.14em] text-[#1D1C1C]">
                            {site.name}
                          </h3>
                          <p className="font-editorial-serif text-sm text-[#595959] leading-relaxed">
                            {site.shortDescription}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-[#E5DFD7] flex items-center justify-between">
                          <Link
                            href={`/websites/${site.slug}`}
                            className="font-editorial-serif italic text-sm text-[#595959] hover:text-[#1D1C1C]"
                          >
                            Details
                          </Link>
                          {ext && (
                            <a
                              href={ext}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-4 py-1.5 bg-[#1D1C1C] hover:bg-[#C10016] text-white text-[10px] font-bold uppercase tracking-[0.18em] transition"
                            >
                              <span>Launch</span>
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

          <Card3D intensity={4}>
            <div className="samad-card-dark p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-[#C8A464]/35">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 text-[#C8A464] text-[10px] font-bold uppercase tracking-[0.24em]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Ready to Deploy</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-[0.16em] text-white">
                  Host Static Websites With Zero Setup
                </h2>
              </div>

              <Link
                href="/dashboard"
                className="btn-maison-light px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.22em] shrink-0"
              >
                Open Console
              </Link>
            </div>
          </Card3D>
        </div>
      </section>
    </div>
  );
}
