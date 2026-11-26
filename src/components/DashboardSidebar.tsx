"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Upload,
  Globe,
  Search,
  Plus,
  ShieldCheck,
  HardDrive,
  LayoutDashboard,
  Menu,
  LogOut,
  ChevronRight,
  X,
  ExternalLink,
  LogIn,
  User as UserIcon,
} from "lucide-react";
import { HostedProject, PublicUser } from "@/lib/types";

export interface DashboardSidebarProps {
  currentTab: "projects" | "upload" | "websites" | "search" | "profile";
  onTabChange?: (tab: "projects" | "upload" | "profile") => void;
  onUploadClick?: () => void;
  projectCount?: number;
}

export function DashboardSidebar({
  currentTab,
  onTabChange,
  onUploadClick,
  projectCount,
}: DashboardSidebarProps) {
  const router = useRouter();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [projects, setProjects] = useState<HostedProject[]>([]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchUserData = async () => {
      try {
        const userRes = await fetch("/api/auth/me");
        if (userRes.ok) {
          const userData = await userRes.json();
          if (isMounted && userData.user) {
            setUser(userData.user);
          }
        }

        const projRes = await fetch("/api/projects");
        if (projRes.ok) {
          const projData = await projRes.json();
          if (isMounted && projData.userProjects) {
            setProjects(projData.userProjects);
          }
        }
      } catch {
        // ignore
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchUserData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      window.location.href = "/";
    } catch {
      window.location.reload();
    }
  };

  const totalStorageBytes = projects.reduce(
    (acc, p) => acc + (p.storageUsedBytes || 0),
    0
  );

  const displayProjectCount =
    typeof projectCount === "number" ? projectCount : projects.length;

  const handleUploadAction = () => {
    setMobileSidebarOpen(false);
    if (onUploadClick) {
      onUploadClick();
    } else if (onTabChange) {
      onTabChange("upload");
    } else {
      router.push("/dashboard?action=upload");
    }
  };

  const handleProjectsAction = () => {
    setMobileSidebarOpen(false);
    if (onTabChange) {
      onTabChange("projects");
    } else {
      router.push("/dashboard");
    }
  };

  const handleProfileAction = () => {
    setMobileSidebarOpen(false);
    if (onTabChange) {
      onTabChange("profile");
    } else {
      router.push("/dashboard?tab=profile");
    }
  };

  return (
    <>
      {/* Mobile Top Header (lg:hidden) */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/90 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/primary-logo.png"
              alt="Samad Expo"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="font-extrabold text-sm text-white">Hosting Console</span>
          </Link>
        </div>

        <button
          type="button"
          onClick={handleUploadAction}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C10016] text-white text-xs font-bold cursor-pointer hover:bg-[#9E0012] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload</span>
        </button>
      </div>

      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Vertical Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 flex-col border-r border-[#C8A464]/20 bg-[#0B0A0C]/95 backdrop-blur-xl text-white p-5 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0 flex" : "-translate-x-full hidden lg:flex"
        }`}
      >
        {/* Brand / Logo Header */}
        <div className="flex items-center justify-between pb-5 border-b border-zinc-800/80">
          <Link
            href="/dashboard"
            onClick={() => setMobileSidebarOpen(false)}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-10 h-10 overflow-hidden border border-[#C8A464]/40 bg-[#151215] p-1 shrink-0 group-hover:scale-105 transition-transform">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/primary-logo.png"
                alt="Samad Expo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="block font-editorial-serif italic text-lg text-white tracking-tight">
                Samad Expo
              </span>
              <span className="block text-[10px] uppercase tracking-[0.18em] font-semibold text-[#C8A464]">
                Hosting Console
              </span>
            </div>
          </Link>

          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold bg-[#C10016]/20 text-[#E5C78E] border border-[#C8A464]/35">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C10016] animate-pulse" />
            Live
          </span>
        </div>

        {/* User Profile Card */}
        {user ? (
          <button
            type="button"
            onClick={handleProfileAction}
            className="mt-4 w-full p-3.5 border border-zinc-800/80 hover:border-[#C8A464]/50 bg-[#151215]/80 hover:bg-[#191519] text-left transition-all group cursor-pointer"
            title="Click to view full developer profile"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#C10016] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-extrabold text-white truncate group-hover:text-[#C8A464] transition-colors">{user.name}</p>
                <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
            </div>
            <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-zinc-800/60 text-[10px]">
              <span className="font-bold text-zinc-400">Account Role</span>
              <span className="font-extrabold text-[#C8A464]">
                {user.role === "admin" ? "Maison Admin" : "Developer"}
              </span>
            </div>
          </button>
        ) : (
          <div className="mt-4 p-3.5 border border-zinc-800/80 bg-[#151215]/80 backdrop-blur-sm space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
              <LogIn className="w-4 h-4 text-[#C8A464]" />
              <span>Developer Workspace</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Sign in to manage and deploy hosted websites.
            </p>
            <Link
              href="/login?next=/dashboard"
              onClick={() => setMobileSidebarOpen(false)}
              className="block w-full py-2 px-3 bg-[#C10016] hover:bg-[#9E0012] text-center text-xs font-bold text-white transition-colors"
            >
              Sign In to Account
            </Link>
          </div>
        )}

        {/* Primary Action Button */}
        <div className="mt-5">
          <button
            type="button"
            onClick={handleUploadAction}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#C10016] hover:bg-[#9E0012] text-white text-xs font-bold uppercase tracking-[0.18em] cursor-pointer transition"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Website</span>
          </button>
        </div>

        {/* Vertical Navigation Links */}
        <nav
          className="mt-6 flex-1 space-y-1.5 overflow-y-auto pr-1"
          aria-label="Dashboard Sidebar Navigation"
        >
          <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Workspace
          </div>

          {/* Profile Tab (Prominently above My Projects) */}
          <button
            type="button"
            onClick={handleProfileAction}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 border text-xs font-bold transition text-left cursor-pointer group ${
              currentTab === "profile"
                ? "border-[#C8A464]/50 bg-[#C10016]/25 text-white shadow-xs"
                : "border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <UserIcon className={`w-4 h-4 ${currentTab === "profile" ? "text-[#C8A464]" : "text-zinc-400 group-hover:text-white"}`} />
              <span>Developer Profile</span>
            </div>
            <span
              className={`px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                currentTab === "profile"
                  ? "bg-[#C10016] text-white"
                  : "bg-zinc-800 text-zinc-400 group-hover:text-zinc-200"
              }`}
            >
              {user?.role === "admin" ? "Admin" : "Dev"}
            </span>
          </button>

          <button
            type="button"
            onClick={handleProjectsAction}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 border text-xs font-bold transition text-left cursor-pointer ${
              currentTab === "projects"
                ? "border-[#C8A464]/50 bg-[#C10016]/25 text-white"
                : "border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4 text-[#C8A464]" />
              <span>My Projects</span>
            </div>
            <span
              className={`px-2 py-0.5 text-[10px] font-black ${
                currentTab === "projects"
                  ? "bg-[#C10016] text-white"
                  : "bg-zinc-800 text-zinc-300"
              }`}
            >
              {displayProjectCount}
            </span>
          </button>

          <button
            type="button"
            onClick={handleUploadAction}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 border text-xs font-bold transition text-left cursor-pointer group ${
              currentTab === "upload"
                ? "border-[#C8A464]/50 bg-[#C10016]/25 text-white"
                : "border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Upload className="w-4 h-4 text-[#C8A464] group-hover:scale-110 transition-transform" />
              <span>Upload File</span>
            </div>
            <span className="px-2 py-0.5 bg-zinc-900 text-[#C8A464] border border-[#C8A464]/40 text-[9px] font-extrabold uppercase">
              + ZIP
            </span>
          </button>

          <Link
            href="/websites"
            onClick={() => setMobileSidebarOpen(false)}
            className={`flex items-center justify-between px-3.5 py-2.5 border text-xs font-bold transition ${
              currentTab === "websites"
                ? "border-[#C8A464]/50 bg-[#C10016]/25 text-white"
                : "border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4" />
              <span>Public Directory</span>
            </div>
            {currentTab !== "websites" && (
              <ExternalLink className="w-3.5 h-3.5 text-zinc-600" />
            )}
          </Link>

          <Link
            href="/ecosystem-search"
            onClick={() => setMobileSidebarOpen(false)}
            className={`flex items-center justify-between px-3.5 py-2.5 border text-xs font-bold transition ${
              currentTab === "search"
                ? "border-[#C8A464]/50 bg-[#C10016]/25 text-white"
                : "border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4" />
              <span>Ecosystem Search</span>
            </div>
          </Link>

          {user?.role === "admin" && (
            <>
              <div className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Administration
              </div>
              <Link
                href="/admin/corporate"
                onClick={() => setMobileSidebarOpen(false)}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 text-xs font-bold transition border border-amber-500/20"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Admin Console</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
              </Link>
            </>
          )}

          <div className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Session Actions
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs font-bold transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out / Log Out</span>
          </button>
        </nav>

        {/* Quota & Storage Widget */}
        <div className="mt-auto pt-4 border-t border-zinc-800/80 space-y-3">
          {user && (
            <div className="p-3 border border-[#C8A464]/25 bg-zinc-900/70 text-xs">
              <div className="flex items-center justify-between text-zinc-400 font-bold mb-1.5">
                <span className="flex items-center gap-1.5 text-[11px]">
                  <HardDrive className="w-3.5 h-3.5 text-[#C8A464]" />
                  <span>Storage Allocation</span>
                </span>
                <span className="text-[#C8A464] text-[11px]">
                  {(totalStorageBytes / (1024 * 1024)).toFixed(1)} / 500 MB
                </span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 overflow-hidden">
                <div
                  className="bg-[#C10016] h-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      Math.max(
                        ((totalStorageBytes / (1024 * 1024)) / 500) * 100,
                        2
                      ),
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-zinc-800 hover:border-red-900/60 bg-zinc-900/40 hover:bg-red-950/30 text-xs font-bold text-zinc-400 hover:text-red-400 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <Link
              href="/login?next=/dashboard"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-zinc-800 bg-zinc-900 text-xs font-bold text-zinc-300 hover:text-white transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
