"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { WebsiteListing, HostedProject } from "@/lib/types";
import { publicWebsiteUrl } from "@/lib/corporate-public";
import { Rocket, Eye, ExternalLink, Globe, Search, Filter } from "lucide-react";

interface Props {
  websites: WebsiteListing[];
  hostedProjects?: HostedProject[];
}

const STATUS_BADGES: Record<string, string> = {
  live: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  under_development: "bg-[#FFF33D]/10 text-[#FFF33D] border border-[#FFF33D]/30",
  coming_soon: "bg-zinc-800/80 text-zinc-400 border border-zinc-700/60",
  temporarily_unavailable: "bg-red-500/10 text-red-400 border border-red-500/20",
  maintenance: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
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

  const filteredHosted = useMemo(
    () =>
      hostedProjects.filter((p) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          p.projectName.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.userName && p.userName.toLowerCase().includes(q))
        );
      }),
    [hostedProjects, search]
  );

  // Group corporate websites by category
  const grouped = useMemo(() => {
    const groups: Record<string, WebsiteListing[]> = {};
    for (const site of filtered) {
      if (!groups[site.category]) groups[site.category] = [];
      groups[site.category].push(site);
    }
    return groups;
  }, [filtered]);

  return (
    <div className="space-y-8">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search public websites, hosted web apps, and platforms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/90 text-sm font-medium text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFF33D] focus:ring-1 focus:ring-[#FFF33D] transition-colors"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-sm font-semibold text-zinc-300 focus:outline-none focus:border-[#FFF33D] transition-colors cursor-pointer"
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
            className="px-3.5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-sm font-semibold text-zinc-300 focus:outline-none focus:border-[#FFF33D] transition-colors cursor-pointer"
          >
            {statuses.map((s) => (
              <option key={s} value={s} className="bg-zinc-950 text-white">
                {s === "all" ? "All Statuses" : s.replace(/_/g, " ").toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 1. Live Deployed Websites & Applications */}
      {filteredHosted.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
                <Rocket className="w-3.5 h-3.5" />
                Live Deployed Websites &amp; Applications
              </span>
              <span className="text-zinc-500 text-xs font-semibold">
                {filteredHosted.length} deployed
              </span>
            </div>
            <Link
              href="/dashboard?action=upload"
              className="text-xs font-bold text-[#FFF33D] hover:underline flex items-center gap-1"
            >
              <span>Upload your website</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHosted.map((project) => {
              const visitUrl = project.deploymentUrl || `/sites/${project.slug}`;
              return (
                <div
                  key={project.id}
                  className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5 flex flex-col hover:border-[#FFF33D]/40 hover:bg-zinc-900/90 transition-all shadow-xl backdrop-blur-md group"
                >
                  <div className="flex items-start justify-between mb-3.5">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-zinc-800/90 border border-zinc-700/80 text-[#FFF33D] font-extrabold text-base shadow-inner">
                      {project.projectName.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      ● {project.deploymentStatus}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-white text-base mb-1 group-hover:text-[#FFF33D] transition-colors truncate">
                    {project.projectName}
                  </h3>
                  <p className="text-[11px] font-semibold text-zinc-400 mb-2">
                    Developer: <span className="text-zinc-200">{project.userName || "Sabir Usmani"}</span>
                  </p>
                  <p className="text-xs text-zinc-400 leading-relaxed flex-1 mb-4 line-clamp-3">
                    {project.description || "Active web platform deployed on Samad Expo hosting infrastructure."}
                  </p>

                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80">
                    <Link
                      href={`/preview/${project.id}`}
                      className="flex-1 text-center px-3 py-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 font-bold border border-zinc-700 text-xs rounded-xl transition-colors inline-flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Preview</span>
                    </Link>
                    <a
                      href={visitUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#FFF33D] hover:bg-black hover:text-[#FFF33D] text-black font-extrabold border border-black/20 text-xs rounded-xl transition-all shadow-sm inline-flex items-center gap-1.5 active:scale-95"
                    >
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Corporate Portals & Web Platforms */}
      {filtered.length === 0 && filteredHosted.length === 0 ? (
        <div className="text-center py-16 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 shadow-xl">
          <p className="text-4xl mb-3">🔍</p>
          <h3 className="font-extrabold text-white text-xl mb-2">
            No Websites Found
          </h3>
          <p className="text-zinc-400 text-sm">
            Try adjusting your search query or category filters.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([cat, sites]) => (
            <div key={cat} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="inline-block px-3 py-1 bg-zinc-800/90 text-zinc-200 border border-zinc-700 text-xs font-bold uppercase tracking-wider rounded-lg">
                  {cat}
                </span>
                <span className="text-zinc-500 text-xs font-semibold">
                  {sites.length} site{sites.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sites.map((site) => (
                  <div
                    key={site.id}
                    className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5 flex flex-col hover:border-[#FFF33D]/40 hover:bg-zinc-900/90 transition-all shadow-xl backdrop-blur-md group"
                  >
                    <div className="flex items-start justify-between mb-3.5">
                      <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-zinc-800/90 border border-zinc-700/80 p-1.5 shrink-0">
                        {site.logo ? (
                          <img
                            src={site.logo}
                            alt={site.name}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <img
                            src="/images/primary-logo.png"
                            alt={site.name}
                            className="h-full w-full rounded-md object-cover"
                          />
                        )}
                      </div>
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                          STATUS_BADGES[site.status] ?? "bg-zinc-800 text-zinc-400 border border-zinc-700"
                        }`}
                      >
                        ● {site.status.replace(/_/g, " ")}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-white text-base mb-1 group-hover:text-[#FFF33D] transition-colors truncate">
                      {site.name}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed flex-1 mb-4 line-clamp-3">
                      {site.shortDescription}
                    </p>

                    <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80">
                      <Link
                        href={`/websites/${site.slug}`}
                        className="flex-1 text-center px-3.5 py-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 font-bold border border-zinc-700 text-xs rounded-xl transition-colors"
                      >
                        View Profile
                      </Link>
                      {site.status === "live" && publicWebsiteUrl(site.url) && (
                        <a
                          href={publicWebsiteUrl(site.url) || undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-[#FFF33D] hover:bg-black hover:text-[#FFF33D] text-black font-extrabold border border-black/20 text-xs rounded-xl transition-all shadow-sm active:scale-95 inline-flex items-center gap-1"
                        >
                          <span>Visit</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
