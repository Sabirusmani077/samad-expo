"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  FileText,
  Globe2,
  GraduationCap,
  Handshake,
  Image,
  LayoutDashboard,
  MessageSquare,
  Newspaper,
  Settings2,
  Users,
} from "lucide-react";

const groups = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", href: "/admin/corporate", icon: LayoutDashboard },
      { label: "Registered Users", href: "/admin/corporate/users", icon: Users },
      { label: "Hosting & Deployments", href: "/admin/corporate/hosting", icon: Globe2 },
      { label: "Company profile", href: "/admin/corporate/company", icon: Building2 },
      { label: "Inquiries & messages", href: "/admin/corporate/inquiries", icon: MessageSquare },
    ],
  },
  {
    label: "Ecosystem",
    items: [
      { label: "Business divisions", href: "/admin/corporate/businesses", icon: BriefcaseBusiness },
      { label: "Websites & projects", href: "/admin/corporate/websites", icon: Globe2 },
      { label: "Founder & leadership", href: "/admin/corporate/team", icon: Users },
      { label: "Services", href: "/admin/corporate/services", icon: Settings2 },
      { label: "Portfolio", href: "/admin/corporate/portfolio", icon: FileText },
      { label: "Careers & jobs", href: "/admin/corporate/jobs", icon: GraduationCap },
      { label: "Partnerships", href: "/admin/corporate/partnerships", icon: Handshake },
    ],
  },
  {
    label: "Insights & operations",
    items: [
      { label: "News & blog", href: "/admin/corporate/blog", icon: Newspaper },
      { label: "Analytics", href: "/admin/corporate/analytics", icon: BarChart3 },
      { label: "Integrations", href: "/admin/corporate/integrations", icon: Globe2 },
      { label: "Media library", href: "/admin/corporate/media", icon: Image },
      { label: "Activity history", href: "/admin/corporate/activity", icon: Activity },
    ],
  },
];

function isActive(pathname: string, href: string) {
  return href === "/admin/corporate"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function CorporateAdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-white/10 bg-slate-950 px-4 py-6 text-white lg:flex">
        <Link href="/admin/corporate" className="mb-7 flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-white/5">
          <span className="shrink-0 overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/primary-logo.png" alt="Samad Expo" className="h-9 w-9 object-cover" />
          </span>
          <span>
            <span className="block text-base font-black tracking-tight">Samad Expo</span>
            <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Corporate workspace</span>
          </span>
        </Link>

        <nav aria-label="Corporate administration" className="space-y-6 overflow-y-auto pr-1">
          {groups.map((group) => (
            <div key={group.label}>
              <h2 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                {group.label}
              </h2>
              <div className="space-y-1">
                {group.items.map(({ label, href, icon: Icon }) => {
                  const active = isActive(pathname, href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${active
                        ? "border-[#FFF33D]/40 bg-[#FFF33D]/15 text-[#FFF33D] font-bold"
                        : "border-transparent text-slate-300 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{label}</span>
                      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#FFF33D]" aria-hidden="true" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-auto space-y-2 pt-4">
          <a
            href="/api/admin/export-excel?type=all"
            download
            className="flex items-center justify-center gap-2 rounded-xl bg-[#FFF33D] px-3 py-2.5 text-xs font-bold text-black shadow-sm transition hover:bg-white active:scale-95"
            title="Export all database records to Excel (.xlsx)"
          >
            <span>📥 Export All Data (Excel)</span>
          </a>

          <Link
            href="/"
            className="block text-center rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            ← Back to website
          </Link>
        </div>
      </aside>

      <nav aria-label="Corporate admin sections" className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white p-3 lg:hidden">
        {groups.flatMap((group) => group.items).map(({ label, href }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition ${active ? "bg-black text-[#FFF33D] font-bold" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
