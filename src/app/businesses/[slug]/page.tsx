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
      w.isPublic !== false &&
      !w.slug.includes("sabir")
  );

  return (
    <div className="bg-white min-h-screen text-[#1D1C1C]">
      {division.banner && (
        <div className="w-full h-48 md:h-64 overflow-hidden border-b border-[#E5DFD7]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={division.banner}
            alt={division.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <section className="samad-hero-grid border-b border-[#C8A464]/25 pt-12 pb-14 relative overflow-hidden text-white">
        <ThreeHeroCanvas variant="dark" className="opacity-75" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <nav className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
            <Link href="/" className="hover:text-[#C8A464] transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/websites" className="hover:text-[#C8A464] transition">
              Catalogue
            </Link>
            <span>/</span>
            <span className="text-[#C8A464]">{division.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="flex items-center justify-center shrink-0">
              <img
                src={division.logo || "/images/primary-logo.png"}
                alt={division.name}
                className="h-16 w-16 object-contain border border-[#C8A464]/50 bg-[#151215] p-2"
              />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-[#C10016] text-white text-[10px] font-bold uppercase tracking-[0.2em]">
                  {division.category}
                </span>
                <span className="px-3 py-1 border border-[#C8A464]/50 text-[#C8A464] text-[10px] font-bold uppercase tracking-[0.2em]">
                  {division.status.replace(/_/g, " ")}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-[0.14em] text-white">
                {division.name}
              </h1>
              <p className="font-editorial-serif italic text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl">
                {division.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-[#FAF7F2] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {division.objectives && division.objectives.length > 0 && (
                <Card3D intensity={4}>
                  <div className="samad-card p-8 border-t-2 border-t-[#C10016]">
                    <h2 className="font-bold uppercase tracking-[0.18em] text-[#1D1C1C] text-base mb-5 pb-3 border-b border-[#E5DFD7]">
                      Objectives
                    </h2>
                    <ul className="space-y-3">
                      {division.objectives.map((obj, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 font-editorial-serif text-base text-[#595959]"
                        >
                          <span className="mt-1 w-5 h-5 shrink-0 bg-[#1D1C1C] text-[#C8A464] flex items-center justify-center text-[10px] font-bold">
                            {i + 1}
                          </span>
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card3D>
              )}

              {associatedWebsites.length > 0 && (
                <Card3D intensity={4}>
                  <div className="samad-card p-8">
                    <h2 className="font-bold uppercase tracking-[0.18em] text-[#1D1C1C] text-base mb-5 pb-3 border-b border-[#E5DFD7]">
                      Associated Platforms
                    </h2>
                    <div
                      className={`grid ${
                        associatedWebsites.length === 1
                          ? "grid-cols-1 max-w-md"
                          : "sm:grid-cols-2"
                      } gap-5`}
                    >
                      {associatedWebsites.map((site) => (
                        <div
                          key={site.id}
                          className="border border-[#E5DFD7] bg-white p-5 hover:border-[#C10016] transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold uppercase tracking-[0.12em] text-[#1D1C1C] text-xs">
                              {site.name}
                            </h3>
                            <span className="px-2 py-0.5 text-[9px] font-bold uppercase border border-[#C8A464]/50 text-[#C10016]">
                              {site.status.replace(/_/g, " ")}
                            </span>
                          </div>
                          <p className="font-editorial-serif text-sm text-[#595959] mb-3">
                            {site.shortDescription}
                          </p>
                          <Link
                            href={`/websites/${site.slug}`}
                            className="font-editorial-serif italic text-sm text-[#C10016] underline"
                          >
                            View Profile
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card3D>
              )}
            </div>

            <div className="space-y-6">
              <Card3D intensity={5}>
                <div className="samad-card p-6 border-t-2 border-t-[#C8A464]">
                  <h3 className="font-bold text-[#C10016] text-[10px] mb-4 uppercase tracking-[0.22em]">
                    Division Information
                  </h3>
                  <dl className="space-y-3 text-xs">
                    <div>
                      <dt className="text-[#767676] uppercase tracking-wider font-bold">
                        Category
                      </dt>
                      <dd className="text-[#1D1C1C] font-bold mt-0.5">
                        {division.category}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#767676] uppercase tracking-wider font-bold">
                        Status
                      </dt>
                      <dd className="text-[#1D1C1C] font-bold capitalize mt-0.5">
                        {division.status.replace(/_/g, " ")}
                      </dd>
                    </div>
                  </dl>
                </div>
              </Card3D>

              <Link
                href="/contact"
                className="btn-3d-yellow block text-center px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em]"
              >
                Enquire With Advisor
              </Link>
              <Link
                href="/websites"
                className="btn-3d-black block text-center px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em]"
              >
                Explore All Platforms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
