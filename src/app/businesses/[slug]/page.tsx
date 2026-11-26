import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readDb } from "@/lib/db";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BusinessDivisionDetailPage({ params }: Props) {
  const { slug } = await params;
  const db = readDb();
  const division = (db.businessDivisions ?? []).find((d) => d.slug === slug);

  if (!division || division.status === "inactive") notFound();

  const associatedWebsites = (db.websiteListings ?? []).filter(
    (w) =>
      ((division.websiteIds ?? []).includes(w.id) ||
        w.businessDivisionId === division.id) &&
      w.isPublic !== false
  );

  return (
    <div className="bg-[#060608] min-h-screen text-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="text-xs text-zinc-400 flex items-center gap-2">
          <Link href="/" className="hover:text-[#FFF33D] font-medium transition">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/businesses"
            className="hover:text-[#FFF33D] font-medium transition"
          >
            Businesses
          </Link>
          <span>/</span>
          <span className="text-[#FFF33D] font-bold">{division.name}</span>
        </nav>
      </div>

      {/* Banner */}
      {division.banner && (
        <div className="w-full h-48 md:h-64 overflow-hidden border-y border-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={division.banner}
            alt={division.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Hero */}
      <section className="samad-hero-grid border-b border-zinc-800/80 py-12 relative overflow-hidden">
        <ThreeHeroCanvas variant="dark" />
        <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-[#FFF33D]/15 blur-[120px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="flex items-center justify-center shrink-0">
              {division.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={division.logo}
                  alt={division.name}
                  className="h-16 w-auto object-contain rounded-xl border border-[#FFF33D]/30 bg-[#141419] p-1"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/images/primary-logo.png"
                  alt={division.name}
                  className="h-16 w-16 rounded-xl object-cover select-none border border-[#FFF33D]/30"
                />
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-[#FFF33D] text-black">
                  {division.category}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-[#FFF33D]/30 bg-[#FFF33D]/10 text-[#FFF33D]">
                  {division.status.replace(/_/g, " ")}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
                {division.name}
              </h1>
              <p className="text-zinc-300 leading-relaxed max-w-2xl">
                {division.description}
              </p>
              {(division.contactEmail || division.contactPhone) && (
                <div className="flex flex-wrap gap-4 mt-4 text-xs text-zinc-300">
                  {division.contactEmail && (
                    <a
                      href={`mailto:${division.contactEmail}`}
                      className="font-bold text-[#FFF33D] hover:text-white transition"
                    >
                      ✉ {division.contactEmail}
                    </a>
                  )}
                  {division.contactPhone && (
                    <a
                      href={`tel:${division.contactPhone}`}
                      className="font-bold text-[#FFF33D] hover:text-white transition"
                    >
                      📞 {division.contactPhone}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-[#0B0B0F] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left — Objectives & Products */}
            <div className="lg:col-span-2 space-y-8">
              {division.objectives && division.objectives.length > 0 && (
                <Card3D intensity={5}>
                  <div className="samad-card p-6 border-t-4 border-t-[#FFF33D]">
                    <h2 className="font-black text-white text-xl mb-4 pb-2 border-b border-zinc-800">
                      Our Objectives
                    </h2>
                    <ul className="space-y-3">
                      {division.objectives.map((obj, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm text-zinc-300"
                        >
                          <span className="mt-0.5 w-5 h-5 shrink-0 bg-[#FFF33D] rounded-md flex items-center justify-center text-[10px] font-black text-black">
                            {i + 1}
                          </span>
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card3D>
              )}

              {division.productsAndServices &&
                division.productsAndServices.length > 0 && (
                  <Card3D intensity={5}>
                    <div className="samad-card p-6">
                      <h2 className="font-black text-white text-xl mb-4 pb-2 border-b border-zinc-800">
                        Products &amp; Services
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {division.productsAndServices.map((item, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#FFF33D]/15 border border-[#FFF33D]/35 text-[#FFF33D]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card3D>
                )}

              {associatedWebsites.length > 0 && (
                <Card3D intensity={5}>
                  <div className="samad-card p-6">
                    <h2 className="font-black text-white text-xl mb-4 pb-2 border-b border-zinc-800">
                      Associated Digital Properties
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {associatedWebsites.map((site) => (
                        <div
                          key={site.id}
                          className="rounded-xl border border-zinc-800 bg-[#141419] p-4 hover:border-[#FFF33D]/40 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-black text-white text-sm">
                              {site.name}
                            </h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#FFF33D]/15 text-[#FFF33D] border border-[#FFF33D]/30">
                              {site.status.replace(/_/g, " ")}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 mb-3">
                            {site.shortDescription}
                          </p>
                          <Link
                            href={`/websites/${site.slug}`}
                            className="text-xs font-bold text-[#FFF33D] hover:underline"
                          >
                            View Profile →
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card3D>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card3D intensity={6}>
                <div className="samad-card p-5">
                  <h3 className="font-black text-[#FFF33D] text-sm mb-3 uppercase tracking-wide">
                    Quick Info
                  </h3>
                  <dl className="space-y-3 text-xs">
                    <div>
                      <dt className="text-zinc-400 font-bold">Category</dt>
                      <dd className="text-white font-black">
                        {division.category}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-zinc-400 font-bold">Status</dt>
                      <dd className="text-white font-black capitalize">
                        {division.status.replace(/_/g, " ")}
                      </dd>
                    </div>
                    {division.contactEmail && (
                      <div>
                        <dt className="text-zinc-400 font-bold">Email</dt>
                        <dd className="text-[#FFF33D] font-black break-all">
                          {division.contactEmail}
                        </dd>
                      </div>
                    )}
                    {division.contactPhone && (
                      <div>
                        <dt className="text-zinc-400 font-bold">Phone</dt>
                        <dd className="text-white font-black">
                          {division.contactPhone}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </Card3D>

              <Link
                href="/contact"
                className="btn-3d-yellow block text-center px-5 py-3 rounded-full text-xs uppercase tracking-wider"
              >
                Enquire About This Division
              </Link>
              <Link
                href="/businesses"
                className="btn-3d-black block text-center px-5 py-3 rounded-full text-xs uppercase tracking-wider"
              >
                ← All Divisions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
