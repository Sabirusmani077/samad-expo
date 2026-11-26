import { readDb } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { AdminPieCharts } from "@/components/admin/AdminPieCharts";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import {
  Building2,
  Globe,
  Users,
  Briefcase,
  FileText,
  BookOpen,
  GraduationCap,
  Handshake,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Download,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Corporate Admin Control Center — Samad Expo" };

export default function CorporateAdminDashboard() {
  const db = readDb();
  const profile = db.companyProfile || {};
  const divisions = db.businessDivisions || [];
  const websites = db.websiteListings || [];
  const team = db.teamMembers || [];
  const services = db.corporateServices || [];
  const portfolio = db.portfolioEntries || [];
  const blog = db.blogPosts || [];
  const jobs = db.jobListings || [];
  const partnerships = db.partnerships || [];
  const inquiries = db.corporateInquiries || [];
  const newInquiries = inquiries.filter((i) => i.status === "new");

  const userStats = {
    developers: (db.users || []).filter((u) => u.role !== "admin" && u.role !== "vendor").length,
    vendors: (db.users || []).filter((u) => u.role === "vendor").length,
    admins: (db.users || []).filter((u) => u.role === "admin").length,
    total: (db.users || []).length,
  };

  const hostingStats = {
    live: (db.hostedProjects || []).filter((p) => p.deploymentStatus === "live").length,
    building: (db.hostedProjects || []).filter((p) => p.deploymentStatus === "building").length,
    draft: (db.hostedProjects || []).filter((p) => p.deploymentStatus === "pending" || p.deploymentStatus === "failed").length,
    total: (db.hostedProjects || []).length,
  };

  const divisionColors = ["#EAB308", "#06B6D4", "#10B981", "#EC4899", "#8B5CF6", "#F97316"];
  const divisionStats = {
    items: (db.businessDivisions || []).map((d, idx) => ({
      name: d.name,
      count: (db.websiteListings || []).filter((w) => w.businessDivisionId === d.id).length || 1,
      color: divisionColors[idx % divisionColors.length],
    })),
    total: (db.businessDivisions || []).length,
  };

  const inquiryStats = {
    newCount: (db.corporateInquiries || []).filter((i) => i.status === "new").length,
    inProgress: (db.corporateInquiries || []).filter((i) => i.status === "in_progress").length,
    resolved: (db.corporateInquiries || []).filter((i) => i.status === "resolved").length,
    total: (db.corporateInquiries || []).length,
  };

  const stats = [
    {
      label: "Registered Users & Sign-Ups",
      value: (db.users || []).length,
      icon: Users,
      href: "/admin/corporate/users",
      color: "bg-blue-500/15 text-blue-300 border-blue-500/30",
      description: "Platform accounts & sign-up audit",
      badge: `${(db.users || []).filter((u) => u.role !== "admin" && u.role !== "vendor").length} Developers`,
    },
    {
      label: "Business Divisions",
      value: divisions.length,
      icon: Building2,
      href: "/admin/corporate/businesses",
      color: "bg-[#FFF33D]/20 text-[#FFF33D] border-[#FFF33D]/40",
      description: "Core corporate sectors",
    },
    {
      label: "Websites & Web Apps",
      value: websites.length,
      icon: Globe,
      href: "/admin/corporate/websites",
      color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      description: `${websites.filter((w) => w.status === "live").length} Live in ecosystem`,
    },
    {
      label: "Leadership & Team",
      value: team.length,
      icon: Users,
      href: "/admin/corporate/team",
      color: "bg-purple-500/15 text-purple-300 border-purple-500/30",
      description: "Executive profiles",
    },
    {
      label: "Corporate Services",
      value: services.length,
      icon: Briefcase,
      href: "/admin/corporate/services",
      color: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      description: "Active solutions",
    },
    {
      label: "Portfolio Showcase",
      value: portfolio.length,
      icon: FileText,
      href: "/admin/corporate/portfolio",
      color: "bg-pink-500/15 text-pink-300 border-pink-500/30",
      description: "Flagship deployments",
    },
    {
      label: "News & Articles",
      value: blog.length,
      icon: BookOpen,
      href: "/admin/corporate/blog",
      color: "bg-[#FFF33D]/15 text-[#FFF33D] border-[#FFF33D]/30",
      description: "Published updates",
    },
    {
      label: "Inquiries & Messages",
      value: inquiries.length,
      badge: newInquiries.length > 0 ? `${newInquiries.length} New` : undefined,
      icon: MessageSquare,
      href: "/admin/corporate/inquiries",
      color: "bg-rose-500/15 text-rose-300 border-rose-500/30",
      description: "Customer & business reachouts",
    },
    {
      label: "Careers & Openings",
      value: jobs.length,
      icon: GraduationCap,
      href: "/admin/corporate/jobs",
      color: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
      description: "Active hiring positions",
    },
    {
      label: "Strategic Partnerships",
      value: partnerships.length,
      icon: Handshake,
      href: "/admin/corporate/partnerships",
      color: "bg-teal-500/15 text-teal-300 border-teal-500/30",
      description: "Collaborations & alliances",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <span>Admin Console</span>
              <span>/</span>
              <span className="text-black font-bold font-bold">Executive Overview</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Samad Expo Corporate Workspace</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Online
              </span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="/api/admin/export-excel?type=all"
              download
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-black bg-[#FFF33D] hover:bg-black hover:text-[#FFF33D] rounded-xl shadow-xs transition active:scale-95 border border-black/15"
              title="Download Master Excel Spreadsheet with all database tables and sign-ups"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Excel Export (.xlsx)</span>
            </a>

            <Link
              href="/admin/corporate/users"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition"
            >
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>View Users ({db.users?.length || 0})</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>View Website</span>
            </Link>

            <AdminLogoutButton variant="header" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Company & Founder Spotlight Banner */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-[#073822] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#66FF00]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Founder Photo & Info */}
            <div className="lg:col-span-4 flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border-2 border-[#FFF33D]/60 shadow-md bg-slate-800">
                {profile.founderPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.founderPhoto}
                    alt={profile.founderName || "Founder"}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-black text-[#FFF33D]">
                    SU
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#FFF33D] mb-1">
                  Founder & Leadership
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white truncate">
                  {profile.founderName || "Sabir Usmani"}
                </h2>
                <p className="text-xs text-slate-300 font-medium">
                  {profile.founderDesignation || "Founder & Owner"}
                </p>
                <Link
                  href="/admin/corporate/team"
                  className="mt-2 text-[11px] font-bold text-[#FFF33D] hover:underline inline-flex items-center gap-1"
                >
                  Manage Leadership →
                </Link>
              </div>
            </div>

            {/* Right: Company Credentials */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#FFF33D] text-black font-extrabold">
                    Parent Brand
                  </span>
                  <span className="text-xs text-slate-400">
                    Est. {profile.founded || "2024"}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
                  {profile.businessName || "Samad Expo"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  {profile.tagline ||
                    "Parent Corporate Brand & Central Digital Headquarters for web applications, technology platforms, and business divisions."}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                <a
                  href="https://maps.app.goo.gl/UnzqY6kZ3i2BRieKA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 truncate hover:text-[#FFF33D] transition group"
                  title="View on Google Maps"
                >
                  <MapPin className="w-4 h-4 text-[#FFF33D] shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="truncate">{profile.contactAddress || "Bodla, Agra, Uttar Pradesh 282010, India"}</span>
                </a>
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-4 h-4 text-[#FFF33D] shrink-0" />
                  <span className="truncate">{profile.contactEmail || "officialaadhakh@gmail.com"}</span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <Phone className="w-4 h-4 text-[#FFF33D] shrink-0" />
                  <span className="truncate">{profile.contactPhone || "+91 94582 04216"}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 9 Key Stats Grid */}
        <section aria-label="Ecosystem Metrics">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-black" />
              <span>Real-Time Corporate Ecosystem</span>
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              Live database counts
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.map((stat) => (
              <Link
                key={stat.label}
                href={stat.href}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 hover:border-slate-400 hover:shadow-md transition-all group relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center border ${stat.color}`}
                  >
                    <stat.icon className="w-5 h-5" />
                  </div>
                  {stat.badge && (
                    <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full bg-rose-100 text-rose-700 border border-rose-200 animate-bounce">
                      {stat.badge}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-baseline justify-between">
                  <div className="text-3xl font-black text-slate-900 group-hover:text-black hover:underline transition-colors">
                    {stat.value}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                </div>

                <div className="mt-1 font-bold text-sm text-slate-900">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {stat.description}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Enterprise Data Center & Excel Exports Card */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 mb-2">
                <span>Excel Spreadsheet Engine</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Enterprise Data &amp; Sign-Up Records Export</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Download verified real-time spreadsheets of user accounts, sign-ups, hosted websites, and enterprise leads.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href="/api/admin/export-excel?type=all"
                download
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#FFF33D] hover:text-black active:scale-95"
              >
                <Download className="w-4 h-4 text-[#FFF33D]" />
                <span>Download Master Excel (.xlsx)</span>
              </a>

              <a
                href="/api/admin/export-excel?type=users"
                download
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-900 shadow-sm transition hover:bg-slate-50 active:scale-95"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Export Users &amp; Sign-Ups (.xlsx)</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
              <span className="text-[10px] font-bold uppercase text-slate-400">Total User Sign-Ups</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{(db.users || []).length}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {(db.users || []).filter((u) => u.role !== "admin" && u.role !== "vendor").length} active developer accounts
              </p>
              <Link href="/admin/corporate/users" className="mt-2 text-[11px] font-bold text-blue-600 hover:underline inline-block">
                View User Directory →
              </Link>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
              <span className="text-[10px] font-bold uppercase text-slate-400">Hosted Websites</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{(db.hostedProjects || []).length}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {(db.hostedProjects || []).filter((p) => p.deploymentStatus === "live").length} live and serving traffic
              </p>
              <Link href="/admin/corporate/hosting" className="mt-2 text-[11px] font-bold text-emerald-600 hover:underline inline-block">
                Hosting Management →
              </Link>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
              <span className="text-[10px] font-bold uppercase text-slate-400">Client Inquiries</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{(db.corporateInquiries || []).length}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {(db.corporateInquiries || []).filter((i) => i.status === "new").length} new unread submissions
              </p>
              <Link href="/admin/corporate/inquiries" className="mt-2 text-[11px] font-bold text-rose-600 hover:underline inline-block">
                View Inquiries →
              </Link>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
              <span className="text-[10px] font-bold uppercase text-slate-400">Multi-Sheet Coverage</span>
              <p className="text-2xl font-black text-slate-900 mt-1">11 Sheets</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Users, hosting, divisions, services, team</p>
              <a href="/api/admin/export-excel?type=all" download className="mt-2 text-[11px] font-bold text-slate-900 hover:underline inline-block">
                Download Master (.xlsx) →
              </a>
            </div>
          </div>
        </section>

        {/* Interactive Pie Charts Section */}
        <AdminPieCharts
          userStats={userStats}
          hostingStats={hostingStats}
          divisionStats={divisionStats}
          inquiryStats={inquiryStats}
        />

        {/* Main Content: Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (8 cols): Websites & Divisions */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. Websites & Platforms Directory */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                    <Globe className="w-4 h-4 text-black" />
                    <span>Digital Ecosystem & Websites</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {websites.length} platforms registered under Samad Expo
                  </p>
                </div>
                <Link
                  href="/admin/corporate/websites"
                  className="text-xs font-bold text-black font-bold hover:text-emerald-800"
                >
                  Manage All →
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {websites.slice(0, 6).map((site) => {
                  const division = divisions.find(
                    (d) => d.id === site.businessDivisionId
                  );
                  return (
                    <div
                      key={site.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 rounded-xl px-2 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0 font-black text-xs">
                          {site.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 truncate">
                              {site.name}
                            </span>
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                site.status === "live"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : site.status === "under_development"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-zinc-100 text-zinc-900 border border-zinc-300"
                              }`}
                            >
                              {site.status.replace("_", " ")}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>{site.category}</span>
                            {division && (
                              <>
                                <span>•</span>
                                <span className="text-slate-600 truncate">
                                  {division.name}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <Link
                          href={`/admin/corporate/websites/${site.id}/edit`}
                          className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-lg transition"
                        >
                          Edit
                        </Link>
                        {site.url && (
                          <a
                            href={site.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-slate-900 transition"
                            title="Open URL"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-500">
                  Showing top {Math.min(6, websites.length)} of {websites.length} websites
                </span>
                <Link
                  href="/admin/corporate/websites/new"
                  className="font-bold text-slate-900 hover:text-black hover:underline"
                >
                  + Add New Website
                </Link>
              </div>
            </div>

            {/* 2. Business Divisions Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-black" />
                    <span>Business Divisions</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {divisions.length} active sectors operating under parent governance
                  </p>
                </div>
                <Link
                  href="/admin/corporate/businesses"
                  className="text-xs font-bold text-black hover:text-black hover:underline"
                >
                  Manage All →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {divisions.map((division) => {
                  const linkedWebsitesCount = websites.filter(
                    (w) => w.businessDivisionId === division.id
                  ).length;

                  return (
                    <div
                      key={division.id}
                      className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            {division.category}
                          </span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 leading-snug mb-1">
                          {division.name}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {division.shortDescription}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-600">
                          {linkedWebsitesCount} Projects
                        </span>
                        <Link
                          href={`/admin/corporate/businesses/${division.id}/edit`}
                          className="font-bold text-black underline hover:text-zinc-600"
                        >
                          Edit →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Inquiries & Quick Actions */}
          <div className="lg:col-span-4 space-y-8">
            {/* Recent Corporate Inquiries Feed */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-rose-600" />
                  <span>Recent Inquiries</span>
                </h3>
                <Link
                  href="/admin/corporate/inquiries"
                  className="text-xs font-bold text-rose-700 hover:underline"
                >
                  View All ({inquiries.length})
                </Link>
              </div>

              {inquiries.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No inquiries received yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.slice(0, 3).map((inquiry) => (
                    <div
                      key={inquiry.id}
                      className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900 truncate">
                          {inquiry.name}
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            inquiry.status === "new"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {inquiry.status}
                        </span>
                      </div>
                      <p className="font-medium text-slate-700 truncate mb-1">
                        {inquiry.subject || "General Inquiry"}
                      </p>
                      <p className="text-slate-500 line-clamp-2 italic mb-2">
                        &quot;{inquiry.message}&quot;
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/50">
                        <span>{inquiry.email}</span>
                        <Link
                          href="/admin/corporate/inquiries"
                          className="font-bold text-slate-900 hover:underline"
                        >
                          Reply →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white rounded-2xl border-2 border-slate-900 p-6 shadow-sm">
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider mb-4">
                Corporate Quick Actions
              </h3>
              <div className="space-y-2">
                {[
                  {
                    label: "Edit Company Profile",
                    href: "/admin/corporate/company",
                    badge: "Master Info",
                  },
                  {
                    label: "Add Business Division",
                    href: "/admin/corporate/businesses/new",
                    badge: "Sector",
                  },
                  {
                    label: "Add Website Listing",
                    href: "/admin/corporate/websites/new",
                    badge: "Ecosystem",
                  },
                  {
                    label: "Add Team / Leadership",
                    href: "/admin/corporate/team/new",
                    badge: "Personnel",
                  },
                  {
                    label: "Manage Blog & Press Articles",
                    href: "/admin/corporate/blog",
                    badge: "News",
                  },
                  {
                    label: "Manage Career Openings",
                    href: "/admin/corporate/jobs",
                    badge: "Hiring",
                  },
                  {
                    label: "Manage Strategic Partnerships",
                    href: "/admin/corporate/partnerships",
                    badge: "Network",
                  },
                  {
                    label: "Central Analytics & Reports",
                    href: "/admin/corporate/analytics",
                    badge: "Insights",
                  },
                ].map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-[#FFF33D]/30 transition text-xs font-semibold text-slate-800 group"
                  >
                    <span>{action.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-700">
                        {action.badge}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* System Status Card */}
            <div className="bg-slate-950 text-white rounded-2xl p-5 border border-slate-800 text-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFF33D]">
                  System Integrity
                </span>
                <span className="w-2 h-2 rounded-full bg-[#FFF33D] animate-ping" />
              </div>
              <div className="space-y-2 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Framework</span>
                  <span className="font-bold text-white">Next.js 15 App Router</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">React Core</span>
                  <span className="font-bold text-white">React 19 (Server Engine)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Local Port</span>
                  <span className="font-bold text-[#FFF33D]">http://localhost:3000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Admin Account</span>
                  <span className="font-bold text-white truncate max-w-[150px]">
                    officialaadhakh@gmail.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
