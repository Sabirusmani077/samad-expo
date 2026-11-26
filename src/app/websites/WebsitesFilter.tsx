"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { WebsiteListing, HostedProject } from "@/lib/types";
import { publicWebsiteUrl } from "@/lib/corporate-public";
import { Card3D } from "@/components/Card3D";
import { Rocket, ExternalLink, Search } from "lucide-react";

interface Props {
  websites: WebsiteListing[];
  hostedProjects?: HostedProject[];
}

const STATUS_BADGES: Record<string, string> = {
  live: "text-[#1D1C1C] border border-[#C8A464] bg-[#FAF7F2]",
  under_development: "text-[#C10016] border border-[#C10016]/40 bg-white",
  coming_soon: "text-[#595959] border border-[#E5DFD7] bg-white",
  temporarily_unavailable: "text-[#C10016] border border-[#C10016]/50 bg-[#FFF5F5]",
  maintenance: "text-[#767676] border border-[#D5CEC5] bg-white",
};

function symmetricCols(count: number): string {
  if (count <= 1) return "grid-cols-1 max-w-xl";
  if (count === 2 || count === 4) return "grid-cols-1 md:grid-cols-2";
  return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
}

export function WebsitesFilter({ websites, hostedProjects = [] }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(websites.map((w) => w.category)))],
    [websites]
  );
  const statuses = useMemo(
    () => ["all", ...Array.from(new Set(websites.map((w) => w.status)))],
    [websites]
  );

  const filtered = useMemo(
    () =>
      websites.filter((w) => {
        const matchSearch =
          !search ||
          w.name.toLowerCase().includes(search.toLowerCase()) ||
          w.shortDescription.toLowerCase().includes(search.toLowerCase());
        const matchCategory = category === "all" || w.category === category;
        const matchStatus = status === "all" || w.status === status;
        return matchSearch && matchCategory && matchStatus;
      }),
    [websites, search, category, status]
  );

  const websiteSlugs = useMemo(
    () => new Set(websites.map((w) => w.slug)),
    [websites]
  );

  const filteredHosted = useMemo(
    () =>
      hostedProjects.filter((p) => {
        if (
          websiteSlugs.has(p.slug) ||
          p.slug.includes("sabir") ||
          p.projectName.toLowerCase().includes("sabir")
        ) {
          return false;
        }
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          p.projectName.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
        );
      }),
    [hostedProjects, search, websiteSlugs]
  );

  const grouped = useMemo(() => {
    const groups: Record<string, WebsiteListing[]> = {};
    for (const site of filtered) {
      if (!groups[site.category]) groups[site.category] = [];
      groups[site.category].push(site);
    }
    return groups;
  }, [filtered]);

  return (
    <div className="space-y-12">
      {/* Hairline Search & Select Controls */}
      <div className="flex flex-col sm:flex-row gap-4 border-b border-[#E5DFD7] pb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#595959] absolute left-1 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search web creations, utilities, or hosted sites..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-7 pr-3 py-2 bg-transparent border-b border-[#D5CEC5] focus:border-[#1D1C1C] font-editorial-serif italic text-base text-[#1D1C1C] placeholder:text-[#888178] outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border border-[#D5CEC5] bg-white text-[11px] font-bold uppercase tracking-[0.16em] text-[#1D1C1C] focus:outline-none focus:border-[#1D1C1C] cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All Categories" : c}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 border border-[#D5CEC5] bg-white text-[11px] font-bold uppercase tracking-[0.16em] text-[#1D1C1C] focus:outline-none focus:border-[#1D1C1C] cursor-pointer"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Statuses" : s.replace(/_/g, " ").toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 1. Community Hosted Deployments */}
      {filteredHosted.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <Rocket className="w-4 h-4 text-[#C10016]" />
            <h2 className="text-base font-bold uppercase tracking-[0.18em] text-[#1D1C1C]">
              Live Static Cloud Deployments
            </h2>
            <span className="px-2.5 py-0.5 bg-[#1D1C1C] text-white text-[10px] font-bold">
              {filteredHosted.length}
            </span>
          </div>

          <div className={`grid ${symmetricCols(filteredHosted.length)} gap-6`}>
            {filteredHosted.map((proj) => {
              const liveUrl = `/sites/${proj.slug}`;
              return (
                <Card3D key={proj.id} intensity={5}>
                  <div className="samad-card p-7 flex flex-col justify-between h-full border-t-2 border-t-[#C10016]">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-0.5 bg-[#FAF7F2] border border-[#C8A464]/50 text-[#C10016] text-[9px] font-bold uppercase tracking-[0.2em]">
                          ● Live Site
                        </span>
                        <span className="text-[11px] font-mono text-[#767676]">
                          /sites/{proj.slug}
                        </span>
                      </div>
                      <h3 className="text-base font-bold uppercase tracking-[0.14em] text-[#1D1C1C] mb-2">
                        {proj.projectName}
                      </h3>
                      <p className="font-editorial-serif text-sm text-[#595959] leading-relaxed mb-5">
                        {proj.description ||
                          "Live static web deployment hosted on Samad Expo cloud infrastructure."}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#E5DFD7] flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#767676]">
                        Samad Cloud
                      </span>
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-3d-yellow px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] inline-flex items-center gap-1.5"
                      >
                        <span>Visit</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </Card3D>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Web Applications & Digital Tools */}
      {filtered.length === 0 && filteredHosted.length === 0 ? (
        <div className="samad-card text-center py-16 p-8">
          <h3 className="font-bold uppercase tracking-[0.18em] text-[#1D1C1C] text-base mb-2">
            No Creations Found
          </h3>
          <p className="font-editorial-serif italic text-[#595959] text-sm">
            Try clearing or adjusting your search filters above.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(grouped).map(([cat, sites]) => (
            <div key={cat} className="space-y-5">
              <div className="flex items-center gap-3 border-b border-[#E5DFD7] pb-3">
                <span className="inline-block px-3.5 py-1 bg-[#1D1C1C] text-white text-[10px] font-bold uppercase tracking-[0.2em]">
                  {cat}
                </span>
                <span className="font-editorial-serif italic text-[#595959] text-sm">
                  {sites.length} creation{sites.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className={`grid ${symmetricCols(sites.length)} gap-6`}>
                {sites.map((site) => (
                  <Card3D key={site.id} intensity={5}>
                    <div className="samad-card p-7 flex flex-col justify-between h-full group">
                      <div>
                        <div className="flex items-start justify-between mb-5">
                          <div className="flex items-center justify-center w-11 h-11 bg-[#FAF7F2] border border-[#E5DFD7] p-1.5 shrink-0">
                            {site.logo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={site.logo}
                                alt={site.name}
                                className="h-full w-full object-contain"
                              />
                            ) : (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src="/images/primary-logo.png"
                                alt={site.name}
                                className="h-full w-full object-contain"
                              />
                            )}
                          </div>
                          <span
                            className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] ${
                              STATUS_BADGES[site.status] ??
                              "text-[#595959] border border-[#E5DFD7] bg-white"
                            }`}
                          >
                            {site.status.replace(/_/g, " ")}
                          </span>
                        </div>

                        <h3 className="font-bold uppercase tracking-[0.14em] text-[#1D1C1C] text-sm sm:text-base mb-2 group-hover:text-[#C10016] transition-colors">
                          {site.name}
                        </h3>
                        <p className="font-editorial-serif text-sm text-[#595959] leading-relaxed mb-6">
                          {site.shortDescription}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 pt-4 border-t border-[#E5DFD7]">
                        <Link
                          href={`/websites/${site.slug}`}
                          className="flex-1 text-center px-3.5 py-2 border border-[#1D1C1C] text-[#1D1C1C] hover:bg-[#1D1C1C] hover:text-white font-bold text-[10px] uppercase tracking-[0.18em] transition-colors"
                        >
                          View Details
                        </Link>
                        {site.status === "live" && publicWebsiteUrl(site.url) && (
                          <a
                            href={publicWebsiteUrl(site.url) || undefined}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-3d-yellow px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] inline-flex items-center gap-1"
                          >
                            <span>Launch</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </Card3D>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
