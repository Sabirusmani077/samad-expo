import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readDb } from "@/lib/db";
import { publicWebsiteUrl } from "@/lib/corporate-public";
import { Globe, ArrowRight, ExternalLink, ShieldCheck, CheckCircle2, Calendar, Building2, LayoutDashboard } from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const db = readDb();
  const website = db.websiteListings?.find((w) => w.slug === slug || w.id === slug);
  if (!website || website.isPublic === false) return { title: "Website Not Found" };
  return {
    title: `${website.name} — Samad Expo Digital Ecosystem`,
    description: website.shortDescription || website.description,
  };
}

export default async function WebsiteDetailPage({ params }: Props) {
  const { slug } = await params;
  const db = readDb();
  const website = db.websiteListings?.find((w) => w.slug === slug || w.id === slug);

  if (!website || website.isPublic === false) {
    notFound();
  }
  const externalUrl = publicWebsiteUrl(website.url);
  const previewVideoUrl = publicWebsiteUrl(website.previewVideoUrl);

  const division = website.businessDivisionId
    ? db.businessDivisions?.find((d) => d.id === website.businessDivisionId)
    : null;

  const statusBadgeColors: Record<string, string> = {
    live: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    under_development: "bg-[#FFF33D]/10 text-[#FFF33D] border border-[#FFF33D]/30",
    coming_soon: "bg-zinc-800/80 text-zinc-400 border border-zinc-700/60",
    temporarily_unavailable: "bg-red-500/10 text-red-400 border border-red-500/20",
    maintenance: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col lg:flex-row">
      <DashboardSidebar currentTab="websites" />
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <div className="website-detail-container mx-auto w-full max-w-6xl min-w-0 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-zinc-500 flex items-center gap-2">
          <Link href="/" className="hover:text-zinc-300 font-medium transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/websites" className="hover:text-zinc-300 font-medium transition-colors">
            Public Directory
          </Link>
          <span>/</span>
          <span className="text-[#FFF33D] font-bold">{website.name}</span>
        </nav>

        {/* Hero Card */}
        <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/90 via-zinc-900/50 to-zinc-950 p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-2xl space-y-6">
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#FFF33D]/10 blur-3xl" />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#FFF33D]/10 text-[#FFF33D] font-extrabold text-xs uppercase tracking-wider border border-[#FFF33D]/20 shadow-sm">
              {website.category}
            </span>
            <div className="flex items-center gap-3">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  statusBadgeColors[website.status] || "bg-zinc-800 text-zinc-300 border border-zinc-700"
                }`}
              >
                ● {website.status.replace("_", " ").toUpperCase()}
              </span>
              {website.showOwnershipPublicly === true && (
                <span className="text-xs px-3 py-1 rounded-full bg-zinc-800/80 text-zinc-300 font-semibold capitalize border border-zinc-700/60">
                  {website.ownershipType} by Samad Expo
                </span>
              )}
            </div>
          </div>

          <div className="relative z-10 flex min-w-0 flex-col lg:flex-row lg:items-center gap-6">
            {website.logo ? (
              <img
                src={website.logo}
                alt={website.name}
                className="w-20 h-20 shrink-0 rounded-2xl object-contain border border-zinc-700/80 bg-zinc-900 p-2 shadow-md"
              />
            ) : (
              <img
                src="/images/primary-logo.png"
                alt={`${website.name} — Samad Expo`}
                className="h-20 w-20 rounded-2xl object-cover shrink-0 select-none border border-zinc-700/80 shadow-md"
              />
            )}
            <div className="min-w-0 flex-1">
              <h1 className="break-words text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                {website.name}
              </h1>
              <p className="text-sm sm:text-base text-zinc-400 mt-2 max-w-2xl leading-relaxed">
                {website.shortDescription}
              </p>
            </div>
          </div>

          {externalUrl && (
            <div className="relative z-10 flex flex-wrap gap-3 pt-2">
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FFF33D] hover:bg-black hover:text-[#FFF33D] text-black font-extrabold text-xs uppercase tracking-wider border border-black/20 transition-all shadow-md active:scale-95"
              >
                <span>Visit {website.name}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              {division && (
                <Link
                  href={`/businesses/${division.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold text-xs uppercase tracking-wider border border-zinc-800 transition-colors"
                >
                  <Building2 className="w-4 h-4 text-zinc-400" />
                  <span>Division: {division.name}</span>
                </Link>
              )}
            </div>
          )}
        </section>

        {/* Live Preview / Video Section */}
        {(previewVideoUrl || (externalUrl && website.status === "live")) && (
          <section className="website-detail-preview overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl backdrop-blur-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900/90 px-5 py-4 sm:px-7">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFF33D]">
                  Digital Showcase
                </span>
                <h2 className="mt-1 text-lg font-black text-white sm:text-xl">
                  Preview {website.name}
                </h2>
              </div>
              {externalUrl && (
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FFF33D] px-4 py-2 text-xs font-extrabold text-black hover:bg-black hover:text-[#FFF33D] transition-colors border border-black/20"
                >
                  <span>Open Full Website</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
            {previewVideoUrl && (
              <video
                src={previewVideoUrl}
                controls
                playsInline
                preload="metadata"
                className="block max-h-[640px] w-full bg-zinc-950"
                aria-label={`${website.name} preview video`}
              />
            )}
            {externalUrl && website.status === "live" && (
              <div className="relative h-[430px] bg-zinc-950 sm:h-[600px]">
                <iframe
                  src={externalUrl}
                  title={`${website.name} live website preview`}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  sandbox="allow-forms allow-scripts allow-same-origin allow-downloads allow-popups"
                  allow="fullscreen"
                  className="h-full w-full border-0"
                />
              </div>
            )}
            <p className="px-5 py-3 text-[11px] leading-relaxed text-zinc-500 sm:px-7">
              This is a live embedded preview. If the browser blocks third-party iframe embedding, use &ldquo;Open Full Website&rdquo; above.
            </p>
          </section>
        )}

        {/* Screenshots Preview */}
        {website.screenshots && website.screenshots.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-white">Platform Screenshots &amp; Preview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {website.screenshots.map((s, idx) => (
                <div
                  key={idx}
                  className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-xl"
                >
                  <img src={s} alt={`${website.name} preview ${idx + 1}`} className="w-full h-64 object-cover" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* About & Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 space-y-4 backdrop-blur-xl shadow-xl">
              <h2 className="text-xl font-black text-white">About {website.name}</h2>
              <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-line">
                {website.description || website.shortDescription}
              </p>
            </div>

            {website.features && website.features.length > 0 && (
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 space-y-4 backdrop-blur-xl shadow-xl">
                <h2 className="text-xl font-black text-white">Key Features &amp; Capabilities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {website.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-[#FFF33D] flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-zinc-300">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {website.productsAndServices && website.productsAndServices.length > 0 && (
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 space-y-4 backdrop-blur-xl shadow-xl">
                <h2 className="text-xl font-black text-white">Products &amp; Services Available</h2>
                <div className="flex flex-wrap gap-2">
                  {website.productsAndServices.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-zinc-800/80 border border-zinc-700/80 text-zinc-300 text-xs font-semibold"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Governance Card */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4 backdrop-blur-xl shadow-xl">
              <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">
                Corporate Governance
              </h3>

              <div className="space-y-3.5 text-xs text-zinc-400">
                <div>
                  <span className="font-bold text-zinc-200 block">Parent Organization:</span>
                  Samad Expo
                </div>
                {website.showOwnershipPublicly === true && (
                  <div>
                    <span className="font-bold text-zinc-200 block">Ownership Status:</span>
                    <span className="capitalize text-zinc-300">{website.ownershipType}</span> by Samad Expo
                  </div>
                )}
                {website.launchDate && (
                  <div>
                    <span className="font-bold text-zinc-200 block">Launch Date:</span>
                    {new Date(website.launchDate).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                )}
                {division && (
                  <div>
                    <span className="font-bold text-zinc-200 block">Business Division:</span>
                    <Link
                      href={`/businesses/${division.slug}`}
                      className="text-[#FFF33D] underline hover:text-white font-semibold"
                    >
                      {division.name}
                    </Link>
                  </div>
                )}
                <div>
                  <span className="font-bold text-zinc-200 block">Platform Architecture:</span>
                  Dedicated routing with high-speed CDN acceleration on Samad Expo server network.
                </div>
              </div>

              {externalUrl && (
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#FFF33D] hover:bg-black hover:text-[#FFF33D] text-black font-extrabold text-xs uppercase tracking-wider border border-black/20 transition-all shadow-md active:scale-95"
                >
                  <span>Launch Platform</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
