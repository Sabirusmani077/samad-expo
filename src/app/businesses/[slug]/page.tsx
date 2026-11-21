import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BusinessDivisionDetailPage({ params }: Props) {
  const { slug } = await params;
  const db = readDb();
  const division = (db.businessDivisions ?? []).find((d) => d.slug === slug);

  if (!division || division.status === "inactive") notFound();

  const associatedWebsites = (db.websiteListings ?? []).filter((w) =>
    ((division.websiteIds ?? []).includes(w.id) || w.businessDivisionId === division.id) && w.isPublic !== false
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-slate-900 font-medium">
            Home
          </Link>
          <span>/</span>
          <Link href="/businesses" className="hover:text-slate-900 font-medium">
            Businesses
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">{division.name}</span>
        </nav>
      </div>

      {/* Banner */}
      {division.banner && (
        <div className="w-full h-48 md:h-64 overflow-hidden border-b-2 border-slate-900">
          <img
            src={division.banner}
            alt={division.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Hero */}
      <section className="border-b-2 border-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="flex items-center justify-center flex-shrink-0">
              {division.logo ? (
                <img
                  src={division.logo}
                  alt={division.name}
                  className="h-16 w-auto object-contain"
                />
              ) : (
                <img
                  src="/images/primary-logo.png"
                  alt={division.name}
                  className="h-16 w-16 rounded-xl object-cover select-none"
                />
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-[#FFF33D] border border-slate-900">
                  {division.category}
                </span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold uppercase border border-slate-900 ${
                    division.status === "active"
                      ? "bg-green-100 text-green-800"
                      : division.status === "coming_soon"
                      ? "bg-zinc-100 text-zinc-900 border border-zinc-300"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {division.status.replace(/_/g, " ")}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-950 mb-3">
                {division.name}
              </h1>
              <p className="text-slate-600 leading-relaxed max-w-2xl">
                {division.description}
              </p>
              {(division.contactEmail || division.contactPhone) && (
                <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-600">
                  {division.contactEmail && (
                    <a
                      href={`mailto:${division.contactEmail}`}
                      className="font-bold hover:text-slate-900"
                    >
                      ✉ {division.contactEmail}
                    </a>
                  )}
                  {division.contactPhone && (
                    <a
                      href={`tel:${division.contactPhone}`}
                      className="font-bold hover:text-slate-900"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left — Objectives & Products */}
          <div className="lg:col-span-2 space-y-8">
            {/* Objectives */}
            {division.objectives && division.objectives.length > 0 && (
              <div className="border-2 border-slate-900 shadow-[6px_6px_0px_#FFF33D] p-6 bg-white">
                <h2 className="font-black text-slate-900 text-xl mb-4 pb-2 border-b-2 border-slate-900">
                  Our Objectives
                </h2>
                <ul className="space-y-3">
                  {division.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                      <span className="mt-0.5 w-5 h-5 flex-shrink-0 bg-[#FFF33D] border border-slate-900 flex items-center justify-center text-[10px] font-black text-slate-900">
                        {i + 1}
                      </span>
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Products & Services */}
            {division.productsAndServices &&
              division.productsAndServices.length > 0 && (
                <div className="border-2 border-slate-900 shadow-[6px_6px_0px_#FFF33D] p-6 bg-white">
                  <h2 className="font-black text-slate-900 text-xl mb-4 pb-2 border-b-2 border-slate-900">
                    Products & Services
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {division.productsAndServices.map((item, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 text-xs font-bold bg-[#FFF33D] border border-slate-900 text-slate-900"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Associated Websites */}
            {associatedWebsites.length > 0 && (
              <div className="border-2 border-slate-900 shadow-[6px_6px_0px_#FFF33D] p-6 bg-white">
                <h2 className="font-black text-slate-900 text-xl mb-4 pb-2 border-b-2 border-slate-900">
                  Associated Digital Properties
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {associatedWebsites.map((site) => (
                    <div
                      key={site.id}
                      className="border border-slate-200 p-4 hover:border-slate-900 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-black text-slate-900 text-sm">
                          {site.name}
                        </h3>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold uppercase border border-slate-900 ${
                            site.status === "live"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {site.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-3">
                        {site.shortDescription}
                      </p>
                      <Link
                        href={`/websites/${site.slug}`}
                        className="text-xs font-bold text-slate-900 underline"
                      >
                        View Profile →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="border-2 border-slate-900 shadow-[4px_4px_0px_#FFF33D] p-5 bg-slate-50">
              <h3 className="font-black text-slate-900 text-sm mb-3 uppercase tracking-wide">
                Quick Info
              </h3>
              <dl className="space-y-3 text-xs">
                <div>
                  <dt className="text-slate-500 font-bold">Category</dt>
                  <dd className="text-slate-900 font-black">{division.category}</dd>
                </div>
                <div>
                  <dt className="text-slate-500 font-bold">Status</dt>
                  <dd className="text-slate-900 font-black capitalize">
                    {division.status.replace(/_/g, " ")}
                  </dd>
                </div>
                {division.contactEmail && (
                  <div>
                    <dt className="text-slate-500 font-bold">Email</dt>
                    <dd className="text-slate-900 font-black break-all">
                      {division.contactEmail}
                    </dd>
                  </div>
                )}
                {division.contactPhone && (
                  <div>
                    <dt className="text-slate-500 font-bold">Phone</dt>
                    <dd className="text-slate-900 font-black">
                      {division.contactPhone}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
            <Link
              href="/contact"
              className="block text-center px-5 py-3 bg-slate-900 text-white font-bold border-2 border-slate-900 shadow-[4px_4px_0px_#FFF33D] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-sm"
            >
              Enquire About This Division
            </Link>
            <Link
              href="/businesses"
              className="block text-center px-5 py-3 bg-white text-slate-900 font-bold border-2 border-slate-900 shadow-[4px_4px_0px_#FFF33D] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-sm"
            >
              ← All Divisions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
