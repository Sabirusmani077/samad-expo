"use client";

import React, { useState } from "react";
import {
  PieChart as PieIcon,
  Users,
  Globe2,
  Building2,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export interface PieSlice {
  label: string;
  value: number;
  color: string;
  sublabel?: string;
}

interface SinglePieChartProps {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  slices: PieSlice[];
  totalLabel: string;
  unit?: string;
  linkHref?: string;
  linkLabel?: string;
}

export function SinglePieChart({
  title,
  subtitle,
  icon: Icon,
  slices,
  totalLabel,
  unit = "",
  linkHref,
  linkLabel = "View Details",
}: SinglePieChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = slices.reduce((acc, s) => acc + s.value, 0);

  // SVG Donut Calculations
  const radius = 38;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  // Active highlighted slice (or overall total if none hovered)
  const activeSlice = hoveredIndex !== null ? slices[hoveredIndex] : null;
  const activeValue = activeSlice ? activeSlice.value : total;
  const activeLabel = activeSlice ? activeSlice.label : totalLabel;
  const activePercent =
    total > 0 && activeSlice ? ((activeSlice.value / total) * 100).toFixed(1) : null;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-[#FFF33D] flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 tracking-tight">{title}</h3>
          </div>
          {linkHref && (
            <Link
              href={linkHref}
              className="text-[11px] font-bold text-slate-500 hover:text-black inline-flex items-center gap-0.5"
            >
              <span>{linkLabel}</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          )}
        </div>
        <p className="text-[11px] text-slate-500 mb-4">{subtitle}</p>
      </div>

      {/* Donut Chart Visual & Center Metrics */}
      <div className="relative flex items-center justify-center my-3">
        <svg
          viewBox="0 0 100 100"
          className="w-44 h-44 -rotate-90 transform transition-transform"
          aria-hidden="true"
        >
          {/* Background circle if total is 0 */}
          {total === 0 ? (
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#e2e8f0"
              strokeWidth={strokeWidth}
            />
          ) : (
            slices.map((slice, index) => {
              if (slice.value <= 0) return null;
              const percent = slice.value / total;
              const dashLength = percent * circumference;
              const dashOffset = -cumulativePercent * circumference;
              cumulativePercent += percent;

              const isHovered = hoveredIndex === index;

              return (
                <circle
                  key={slice.label}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                  strokeDasharray={`${dashLength} ${circumference}`}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-300 cursor-pointer"
                  style={{
                    filter: isHovered ? "drop-shadow(0px 2px 6px rgba(0,0,0,0.25))" : "none",
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })
          )}
        </svg>

        {/* Center Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          <span className="text-2xl font-black text-slate-900 tracking-tight transition-all">
            {activeValue}
            {unit && <span className="text-xs font-normal text-slate-500 ml-0.5">{unit}</span>}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 max-w-[85px] truncate">
            {activeLabel}
          </span>
          {activePercent && (
            <span className="mt-0.5 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200">
              {activePercent}%
            </span>
          )}
        </div>
      </div>

      {/* Legend & Breakdown */}
      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
        {slices.map((slice, index) => {
          const percent = total > 0 ? ((slice.value / total) * 100).toFixed(0) : "0";
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={slice.label}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex items-center justify-between text-xs p-1.5 rounded-xl cursor-pointer transition-colors ${
                isHovered ? "bg-slate-100 font-bold" : "hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-slate-700 truncate font-medium">{slice.label}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="font-black text-slate-900">{slice.value}</span>
                <span className="text-[10px] font-semibold text-slate-400 w-8 text-right">
                  {percent}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface AdminPieChartsProps {
  userStats: {
    developers: number;
    vendors: number;
    admins: number;
    total: number;
  };
  hostingStats: {
    live: number;
    building: number;
    draft: number;
    total: number;
  };
  divisionStats: {
    items: { name: string; count: number; color: string }[];
    total: number;
  };
  inquiryStats: {
    newCount: number;
    inProgress: number;
    resolved: number;
    total: number;
  };
}

export function AdminPieCharts({
  userStats,
  hostingStats,
  divisionStats,
  inquiryStats,
}: AdminPieChartsProps) {
  // 1. User Roles Slices
  const userSlices: PieSlice[] = [
    { label: "Developers & Users", value: userStats.developers, color: "#3B82F6" }, // Blue
    { label: "Vendor Partners", value: userStats.vendors, color: "#8B5CF6" }, // Purple
    { label: "Platform Admins", value: userStats.admins, color: "#F59E0B" }, // Amber
  ];

  // 2. Hosting Deployments Slices
  const hostingSlices: PieSlice[] = [
    { label: "Live Deployments", value: hostingStats.live, color: "#10B981" }, // Emerald
    { label: "Building / Compiling", value: hostingStats.building, color: "#06B6D4" }, // Cyan
    {
      label: "Drafts / Offline",
      value: hostingStats.draft > 0 ? hostingStats.draft : hostingStats.total === 0 ? 0 : 0,
      color: "#94A3B8", // Slate
    },
  ];

  // 3. Business Divisions Portfolio Slices
  const divisionColors = ["#EAB308", "#06B6D4", "#10B981", "#EC4899", "#8B5CF6", "#F97316"];
  const divisionSlices: PieSlice[] = divisionStats.items.map((item, idx) => ({
    label: item.name,
    value: item.count || 1, // At least 1 unit representation per sector
    color: item.color || divisionColors[idx % divisionColors.length],
  }));

  // 4. Client Inquiries Slices
  const inquirySlices: PieSlice[] = [
    { label: "New / Unread", value: inquiryStats.newCount, color: "#EF4444" }, // Rose
    { label: "In Review", value: inquiryStats.inProgress, color: "#F59E0B" }, // Amber
    { label: "Resolved", value: inquiryStats.resolved, color: "#10B981" }, // Emerald
  ];

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-[#FFF33D] mb-1.5">
            <PieIcon className="w-3 h-3" />
            <span>Interactive Visual Analytics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Corporate Ecosystem Distribution</span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time visual breakdown of user sign-ups, website hosting deployment status, conglomerate sectors, and customer inquiries.
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-400">Hover slices to inspect details</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Pie Chart 1: Users & Accounts */}
        <SinglePieChart
          title="User Accounts & Roles"
          subtitle="Signed-up users by access tier"
          icon={Users}
          slices={userSlices}
          totalLabel="Total Users"
          linkHref="/admin/corporate/users"
          linkLabel="Audit Users"
        />

        {/* Pie Chart 2: Hosting Deployments */}
        <SinglePieChart
          title="Website Deployments"
          subtitle="Platform deployment health"
          icon={Globe2}
          slices={hostingSlices}
          totalLabel="Total Sites"
          linkHref="/admin/corporate/hosting"
          linkLabel="Hosting Engine"
        />

        {/* Pie Chart 3: Business Divisions */}
        <SinglePieChart
          title="Conglomerate Sectors"
          subtitle="Division portfolio allocation"
          icon={Building2}
          slices={divisionSlices}
          totalLabel="Divisions"
          linkHref="/admin/corporate/businesses"
          linkLabel="Divisions"
        />

        {/* Pie Chart 4: Client Inquiries */}
        <SinglePieChart
          title="Inquiries & Leads"
          subtitle="Inbound requests by status"
          icon={MessageSquare}
          slices={inquirySlices}
          totalLabel="Inquiries"
          linkHref="/admin/corporate/inquiries"
          linkLabel="Inbox"
        />
      </div>
    </section>
  );
}
