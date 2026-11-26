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
  live: "bg-emerald-950/70 text-emerald-300 border border-emerald-500/30",
  under_development: "bg-[#FFF33D]/15 text-[#FFF33D] border border-[#FFF33D]/35",
  coming_soon: "bg-zinc-900 text-zinc-400 border border-zinc-700",
  temporarily_unavailable: "bg-rose-950/60 text-rose-300 border border-rose-500/30",
  maintenance: "bg-orange-950/60 text-orange-300 border border-orange-500/30",
};

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
        if (websiteSlugs.has(p.slug)) return false;
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          p.projectName.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.userName && p.userName.toLowerCase().includes(q))
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
    <div className="space-y-10">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#FFF33D] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search websites, utilities, or hosted sites..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-full border border-zinc-800 bg-zinc-900/90 text-sm font-medium text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFF33D] focus:ring-2 focus:ring-[#FFF33D]/25 transition"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 rounded-full border border-zinc-800 bg-zinc-900 text-xs sm:text-sm font-bold text-white focus:outline-none focus:border-[#FFF33D] cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c} className="bg-zinc-950 text-white">
                {c === "all" ? "All Categories" : c}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2.5 rounded-full border border-zinc-800 bg-zinc-900 text-xs sm:text-sm font-bold text-white focus:outline-none focus:border-[#FFF33D] cursor-pointer"
          >
            {statuses.map((s) => (
              <option key={s} value={s} className="bg-zinc-950 text-white">
                {s === "all"
                  ? "All Statuses"
                  : s.replace(/_/g, " ").toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 1. Community Hosted Deployments */}
      {filteredHosted.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <Rocket className="w-4 h-4 text-[#FFF33D]" />
            <h2 className="text-lg font-black text-white tracking-tight">
              Live User-Hosted Deployments
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFF33D] text-zinc-950 text-[11px] font-extrabold">
              {filteredHosted.length}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredHosted.map((proj) => {
              const liveUrl = `/sites/${proj.slug}`;
              return (
                <Card3D
                  key={proj.id}
                  intensity={6}
                  className="samad-card p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase">
                        ● Live Site
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400">
                        /sites/{proj.slug}
                      </span>
                    </div>
                    <h3 className="text-lg font-extrabold text-white mb-1.5">
                      {proj.projectName}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 mb-5">
                      {proj.description ||
                        `Live static deployment by ${proj.userName || "Creator"}.`}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400 font-medium">
                      By {proj.userName || "Creator"}
                    </span>
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-3d-yellow px-4 py-1.5 text-xs rounded-full font-extrabold inline-flex items-center gap-1.5"
                    >
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
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
          <h3 className="font-extrabold text-white text-xl mb-2">
            No Websites Found
          </h3>
          <p className="text-zinc-400 text-sm">
            Try adjusting your search query or category filters.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(grouped).map(([cat, sites]) => (
            <div key={cat} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-zinc-800 pb-2.5">
                <span className="inline-block px-3 py-1 bg-[#FFF33D] text-zinc-950 text-xs font-extrabold uppercase tracking-wider rounded-full">
                  {cat}
                </span>
                <span className="text-zinc-400 text-xs font-bold">
                  {sites.length} platform{sites.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {sites.map((site) => (
                  <Card3D
                    key={site.id}
                    intensity={6}
                    className="samad-card p-6 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-zinc-900 border border-[#FFF33D]/25 p-1.5 shrink-0">
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
                              className="h-full w-full rounded-md object-cover"
                            />
                          )}
                        </div>
                        <span
                          className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                            STATUS_BADGES[site.status] ??
                            "bg-zinc-900 text-zinc-400 border border-zinc-700"
                          }`}
                        >
                          ● {site.status.replace(/_/g, " ")}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-white text-lg mb-1.5 group-hover:text-[#FFF33D] transition-colors truncate">
                        {site.name}
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed mb-5 line-clamp-3">
                        {site.shortDescription}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-zinc-800/80">
                      <Link
                        href={`/websites/${site.slug}`}
                        className="flex-1 text-center px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-bold text-xs rounded-full transition-colors"
                      >
                        View Profile
                      </Link>
                      {site.status === "live" && publicWebsiteUrl(site.url) && (
                        <a
                          href={publicWebsiteUrl(site.url) || undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-3d-yellow px-4 py-2 text-xs font-extrabold rounded-full inline-flex items-center gap-1"
                        >
                          <span>Launch</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
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
