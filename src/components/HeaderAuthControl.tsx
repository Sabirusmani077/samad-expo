"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  User as UserIcon,
  Upload,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  ChevronDown,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { PublicUser } from "@/lib/types";
import { AuthModal } from "./AuthModal";

interface HeaderAuthControlProps {
  className?: string;
  isHeroHeader?: boolean;
}

export function HeaderAuthControl({ className = "", isHeroHeader = false }: HeaderAuthControlProps) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch current user
  useEffect(() => {
    let mounted = true;
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        if (mounted) {
          setUser(data.user || null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setDropdownOpen(false);
      window.location.href = "/";
    } catch {
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className={`h-10 w-28 animate-pulse rounded-full bg-zinc-800/40 ${className}`} />
    );
  }

  // When Logged In: Show User Profile Avatar & Menu
  if (user) {
    return (
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-black/15 bg-[#FFF33D] px-3.5 py-2 text-xs font-extrabold text-zinc-950 shadow-xs transition-all hover:bg-zinc-950 hover:text-[#FFF33D] active:scale-95 cursor-pointer"
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
        >
          <UserIcon className="h-3.5 w-3.5 shrink-0" />
          <span className="max-w-[120px] truncate">{user.name.split(" ")[0]}</span>
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-64 origin-top-right rounded-2xl border border-zinc-800 bg-zinc-950 p-2 text-white shadow-2xl backdrop-blur-xl z-50 animate-fade-in">
            {/* User Info Header */}
            <div className="border-b border-zinc-800/80 px-3 py-2.5">
              <p className="text-xs font-extrabold text-white truncate">{user.name}</p>
              <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
              <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#FFF33D]/10 px-2 py-0.5 text-[10px] font-bold text-[#FFF33D]">
                <Sparkles className="w-2.5 h-2.5" />
                <span>{user.role === "admin" ? "Platform Administrator" : "Active Developer"}</span>
              </div>
            </div>

            {/* Menu Links */}
            <div className="mt-1 space-y-0.5">
              <Link
                href="/dashboard"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
              >
                <LayoutDashboard className="h-4 w-4 text-[#FFF33D]" />
                <span>My Projects Dashboard</span>
              </Link>

              <Link
                href="/dashboard?action=upload"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
              >
                <Upload className="h-4 w-4 text-emerald-400" />
                <span>Upload New Website</span>
              </Link>

              {user.role === "admin" && (
                <Link
                  href="/admin/corporate"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
                >
                  <ShieldCheck className="h-4 w-4 text-amber-400" />
                  <span>Admin Management</span>
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-400 transition-colors hover:bg-red-950/40 hover:text-red-300"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // When Logged Out: Show "Login / Sign Up" button that replaces "Start a project"
  return (
    <>
      <button
        type="button"
        onClick={() => {
          setAuthMode("login");
          setAuthModalOpen(true);
        }}
        className={
          isHeroHeader
            ? "home-nav-cta whitespace-nowrap"
            : `btn-3d-yellow inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-xs font-extrabold cursor-pointer shrink-0 ${className}`
        }
        aria-label="Sign In or Create Account"
      >
        <span>Sign In</span>
        <ArrowUpRight className="h-3.5 w-3.5" />
      </button>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onSuccess={(u) => setUser(u)}
      />
    </>
  );
}
