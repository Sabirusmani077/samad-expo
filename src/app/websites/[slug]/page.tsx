import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readDb } from "@/lib/db";
import { publicWebsiteUrl } from "@/lib/corporate-public";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";
import {
  ExternalLink,
  CheckCircle2,
  Building2,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const db = readDb();
  const website = db.websiteListings?.find(
    (w) => w.slug === slug || w.id === slug
  );
  if (!website || website.isPublic === false)
    return { title: "Website Not Found" };
  return {
    title: `${website.name} — Samad Expo Digital Ecosystem`,
    description: website.shortDescription || website.description,
  };
}

export default async function WebsiteDetailPage({ params }: Props) {
  const { slug } = await params;
  const db = readDb();
  const website = db.websiteListings?.find(
    (w) => w.slug === slug || w.id === slug
  );

  if (!website || website.isPublic === false) {
    notFound();
  }
  const externalUrl = publicWebsiteUrl(website.url);
  const previewVideoUrl = publicWebsiteUrl(website.previewVideoUrl);

  const division = website.businessDivisionId
    ? db.businessDivisions?.find((d) => d.id === website.businessDivisionId)
    : null;

  const statusBadgeColors: Record<string, string> = {
    live: "bg-emerald-950/70 text-emerald-300 border border-emerald-500/30",
    under_development: "bg-[#FFF33D]/15 text-[#FFF33D] border border-[#FFF33D]/35",
    coming_soon: "bg-zinc-900 text-zinc-400 border border-zinc-700",
    temporarily_unavailable: "bg-rose-950/60 text-rose-300 border border-rose-500/30",
    maintenance: "bg-orange-950/60 text-orange-300 border border-orange-500/30",
  };

  return (
    <div className="bg-[#060608] min-h-screen text-white">
      <section className="samad-hero-grid border-b border-zinc-800/80 pt-10 pb-12 sm:pt-14 sm:pb-16 relative overflow-hidden">
        <ThreeHeroCanvas
          variant="dark"
          className="absolute inset-0 w-full h-full z-0 opacity-75"
        />
        <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-[#FFF33D]/15 blur-[120px]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <nav
            aria-label="Breadcrumb"
            className="text-xs text-zinc-400 flex items-center gap-2"
          >
            <Link href="/" className="hover:text-[#FFF33D] font-semibold transition">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/websites"
              className="hover:text-[#FFF33D] font-semibold transition"
            >
              Public Directory
            </Link>
            <span>/</span>
            <span className="text-[#FFF33D] font-bold">{website.name}</span>
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#FFF33D] text-zinc-950 font-extrabold text-xs uppercase tracking-wider">
              {website.category}
            </span>
            <div className="flex items-center gap-2.5">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  statusBadgeColors[website.status] ||
                  "bg-zinc-900 text-zinc-300 border border-zinc-700"
                }`}
              >
                ● {website.status.replace("_", " ").toUpperCase()}
              </span>
              {website.showOwnershipPublicly === true && (
                <span className="text-xs px-3 py-1 rounded-full bg-zinc-900 text-zinc-300 font-semibold capitalize border border-zinc-700">
                  {website.ownershipType} by Samad Expo
                </span>
              )}
            </div>
          </div>

          <div className="flex min-w-0 flex-col lg:flex-row lg:items-center gap-6">
            {website.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={website.logo}
                alt={website.name}
                className="w-20 h-20 shrink-0 rounded-2xl object-contain border border-[#FFF33D]/30 bg-zinc-900 p-2 shadow-lg"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/images/primary-logo.png"
                alt={`${website.name} — Samad Expo`}
                className="h-20 w-20 rounded-2xl object-cover shrink-0 border border-[#FFF33D]/40 shadow-lg"
              />
            )}
            <div className="min-w-0 flex-1">
              <h1 className="break-words text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                {website.name}
              </h1>
              <p className="text-sm sm:text-base text-zinc-300 mt-2 max-w-2xl leading-relaxed">
                {website.shortDescription}
              </p>
            </div>
          </div>

          {externalUrl && (
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-3d-yellow inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-extrabold text-xs uppercase tracking-wider"
              >
                <span>Launch {website.name}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              {division && (
                <Link
                  href={`/businesses/${division.slug}`}
                  className="btn-3d-black inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider"
                >
                  <Building2 className="w-4 h-4 text-[#FFF33D]" />
                  <span>Division: {division.name}</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="bg-[#0B0B0F] py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {(previewVideoUrl || (externalUrl && website.status === "live")) && (
            <section className="samad-card overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 bg-[#08080B] px-6 py-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFF33D]">
                    Interactive Preview
                  </span>
                  <h2 className="text-lg font-black text-white">
                    Live View &mdash; {website.name}
                  </h2>
                </div>
                {externalUrl && (
                  <a
                    href={externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-3d-yellow inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold"
                  >
                    <span>Open Full Tab</span>
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
                  className="block max-h-[600px] w-full bg-zinc-950"
                  aria-label={`${website.name} preview video`}
                />
              )}

              {externalUrl && website.status === "live" && (
                <div className="relative h-[430px] bg-white sm:h-[600px]">
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

              <p className="px-6 py-3 text-[11px] text-zinc-400 border-t border-zinc-800 bg-[#08080B]">
                Interactive live frame. Use &ldquo;Open Full Tab&rdquo; above if an external host restricts framing.
              </p>
            </section>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card3D intensity={4} className="samad-card p-6 sm:p-8 space-y-3">
                <h2 className="text-xl font-black text-white">
                  About {website.name}
                </h2>
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                  {website.description || website.shortDescription}
                </p>
              </Card3D>

              {website.features && website.features.length > 0 && (
                <Card3D intensity={4} className="samad-card p-6 sm:p-8 space-y-4">
                  <h2 className="text-xl font-black text-white">
                    Key Features &amp; Capabilities
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {website.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#FFF33D] shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-zinc-200 font-medium">
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card3D>
              )}
            </div>

            <div>
              <Card3D intensity={5} className="samad-card p-6 space-y-4 border-t-4 border-t-[#FFF33D]">
                <h3 className="font-extrabold text-[#FFF33D] text-xs uppercase tracking-wider">
                  Platform Details
                </h3>

                <div className="space-y-3.5 text-xs text-zinc-400">
                  <div>
                    <span className="font-bold text-white block">
                      Parent Organization
                    </span>
                    Samad Expo
                  </div>
                  {website.showOwnershipPublicly === true && (
                    <div>
                      <span className="font-bold text-white block">
                        Ownership Status
                      </span>
                      <span className="capitalize">
                        {website.ownershipType}
                      </span>{" "}
                      by Samad Expo
                    </div>
                  )}
                  {website.launchDate && (
                    <div>
                      <span className="font-bold text-white block">
                        Launch Date
                      </span>
                      {new Date(website.launchDate).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  )}
                  {division && (
                    <div>
                      <span className="font-bold text-white block">
                        Business Division
                      </span>
                      <Link
                        href={`/businesses/${division.slug}`}
                        className="text-[#FFF33D] underline font-bold"
                      >
                        {division.name}
                      </Link>
                    </div>
                  )}
                </div>

                {externalUrl && (
                  <a
                    href={externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-3d-yellow w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full font-extrabold text-xs uppercase tracking-wider"
                  >
                    <span>Launch Platform</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </Card3D>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
