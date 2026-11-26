import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readDb } from "@/lib/db";
import { publicWebsiteUrl } from "@/lib/corporate-public";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";
import { ExternalLink, CheckCircle2, Building2 } from "lucide-react";

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
  if (!website || website.isPublic === false || website.slug.includes("sabir"))
    return { title: "Creation Not Found" };
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

  if (!website || website.isPublic === false || website.slug.includes("sabir")) {
    notFound();
  }
  const externalUrl = publicWebsiteUrl(website.url);
  const previewVideoUrl = publicWebsiteUrl(website.previewVideoUrl);

  const division = website.businessDivisionId
    ? db.businessDivisions?.find((d) => d.id === website.businessDivisionId)
    : null;

  return (
    <div className="bg-white min-h-screen text-[#1D1C1C]">
      <section className="samad-hero-grid border-b border-[#C8A464]/25 pt-14 pb-16 relative overflow-hidden text-white">
        <ThreeHeroCanvas variant="dark" className="opacity-80" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0A0C] via-[#0B0A0C]/40 to-transparent z-[1]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <nav
            aria-label="Breadcrumb"
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2"
          >
            <Link href="/" className="hover:text-[#C8A464] transition">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/websites"
              className="hover:text-[#C8A464] transition"
            >
              Digital Catalogue
            </Link>
            <span>/</span>
            <span className="text-[#C8A464]">{website.name}</span>
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="inline-block px-3.5 py-1 bg-[#C10016] text-white font-bold text-[10px] uppercase tracking-[0.22em]">
              {website.category}
            </span>
            <span className="inline-block px-3 py-1 border border-[#C8A464]/50 text-[#C8A464] text-[10px] font-bold uppercase tracking-[0.2em]">
              {website.status.replace("_", " ")}
            </span>
          </div>

          <div className="flex min-w-0 flex-col lg:flex-row lg:items-center gap-6">
            {website.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={website.logo}
                alt={website.name}
                className="w-20 h-20 shrink-0 object-contain border border-[#C8A464]/50 bg-[#151215] p-2 shadow-lg"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/images/primary-logo.png"
                alt={`${website.name} — Samad Expo`}
                className="h-20 w-20 object-contain shrink-0 border border-[#C8A464]/50 bg-[#151215] p-2 shadow-lg"
              />
            )}
            <div className="min-w-0 flex-1">
              <h1 className="break-words text-3xl sm:text-5xl font-bold uppercase tracking-[0.12em] text-white leading-tight">
                {website.name}
              </h1>
              <p className="font-editorial-serif italic text-base sm:text-xl text-zinc-300 mt-2 max-w-2xl leading-relaxed">
                {website.shortDescription}
              </p>
            </div>
          </div>

          {externalUrl && (
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-maison-light inline-flex items-center gap-2 px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.22em]"
              >
                <span>Launch {website.name}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              {division && (
                <Link
                  href={`/businesses/${division.slug}`}
                  className="font-editorial-serif italic text-base text-[#E5C78E] border-b border-[#C8A464]/50 hover:text-white inline-flex items-center gap-2 py-2 transition"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Division: {division.name}</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="bg-[#FAF7F2] py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {(previewVideoUrl || (externalUrl && website.status === "live")) && (
            <section className="samad-card overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5DFD7] bg-white px-6 py-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C10016]">
                    Interactive Sandbox
                  </span>
                  <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-[#1D1C1C]">
                    Live View &mdash; {website.name}
                  </h2>
                </div>
                {externalUrl && (
                  <a
                    href={externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-3d-yellow inline-flex items-center gap-2 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.18em]"
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
                  className="block max-h-[600px] w-full bg-[#0B0A0C]"
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

              <p className="px-6 py-3 font-editorial-serif italic text-xs text-[#767676] border-t border-[#E5DFD7] bg-white">
                Isolated live sandbox. Select &ldquo;Open Full Tab&rdquo; above if an external host restricts framing.
              </p>
            </section>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card3D intensity={4}>
                <div className="samad-card p-8 space-y-3 border-t-2 border-t-[#C10016]">
                  <h2 className="text-base font-bold uppercase tracking-[0.18em] text-[#1D1C1C]">
                    About {website.name}
                  </h2>
                  <p className="font-editorial-serif text-base text-[#595959] leading-relaxed whitespace-pre-line">
                    {website.description || website.shortDescription}
                  </p>
                </div>
              </Card3D>

              {website.features && website.features.length > 0 && (
                <Card3D intensity={4}>
                  <div className="samad-card p-8 space-y-4">
                    <h2 className="text-base font-bold uppercase tracking-[0.18em] text-[#1D1C1C]">
                      Key Capabilities
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {website.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#C10016] shrink-0 mt-0.5 stroke-[1.5]" />
                          <span className="font-editorial-serif text-sm text-[#1D1C1C]">
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card3D>
              )}
            </div>

            <div>
              <Card3D intensity={5}>
                <div className="samad-card p-7 space-y-5 border-t-2 border-t-[#C8A464]">
                  <h3 className="font-bold text-[#C10016] text-[10px] uppercase tracking-[0.24em]">
                    Specification
                  </h3>

                  <div className="space-y-3.5 text-xs text-[#595959]">
                    <div>
                      <span className="font-bold uppercase tracking-wider text-[#1D1C1C] block">
                        Parent Maison
                      </span>
                      Samad Expo
                    </div>
                    {website.launchDate && (
                      <div>
                        <span className="font-bold uppercase tracking-wider text-[#1D1C1C] block">
                          Release Date
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
                        <span className="font-bold uppercase tracking-wider text-[#1D1C1C] block">
                          Division
                        </span>
                        <Link
                          href={`/businesses/${division.slug}`}
                          className="font-editorial-serif italic text-sm text-[#C10016] underline"
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
                      className="btn-3d-yellow w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.2em]"
                    >
                      <span>Launch Creation</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </Card3D>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
