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
          className="group inline-flex items-center gap-1.5 whitespace-nowrap border border-[#1D1C1C] bg-white px-2.5 sm:px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#1D1C1C] transition-all hover:bg-[#1D1C1C] hover:text-white cursor-pointer"
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
        >
          <UserIcon className="h-3.5 w-3.5 shrink-0 stroke-[1.5]" />
          <span className="max-w-[78px] sm:max-w-[110px] truncate">{user.name.split(" ")[0]}</span>
          <ChevronDown
            className={`h-3 w-3 transition-transform duration-200 ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-64 origin-top-right border border-[#E5DFD7] bg-white p-2 text-[#1D1C1C] shadow-2xl z-50 animate-fade-in">
            {/* User Info Header */}
            <div className="border-b border-[#E5DFD7] px-3 py-2.5">
              <p className="text-xs font-bold text-[#1D1C1C] truncate">{user.name}</p>
              <p className="text-[11px] text-[#595959] truncate">{user.email}</p>
              <div className="mt-1.5 inline-flex items-center gap-1 bg-[#FAF7F2] border border-[#C8A464]/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#C10016]">
                <Sparkles className="w-2.5 h-2.5" />
                <span>{user.role === "admin" ? "Maison Administrator" : "Developer Account"}</span>
              </div>
            </div>

            {/* Menu Links */}
            <div className="mt-1 space-y-0.5">
              <Link
                href="/dashboard"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#1D1C1C] transition-colors hover:bg-[#FAF7F2] hover:text-[#C10016]"
              >
                <LayoutDashboard className="h-4 w-4 text-[#C10016] stroke-[1.5]" />
                <span>Hosting Dashboard</span>
              </Link>

              <Link
                href="/dashboard?action=upload"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#1D1C1C] transition-colors hover:bg-[#FAF7F2] hover:text-[#C10016]"
              >
                <Upload className="h-4 w-4 text-[#C8A464] stroke-[1.5]" />
                <span>Deploy Website</span>
              </Link>

              {user.role === "admin" && (
                <Link
                  href="/admin/corporate"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#1D1C1C] transition-colors hover:bg-[#FAF7F2] hover:text-[#C10016]"
                >
                  <ShieldCheck className="h-4 w-4 text-[#1D1C1C] stroke-[1.5]" />
                  <span>Admin Management</span>
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#C10016] transition-colors hover:bg-[#FFF5F5] cursor-pointer"
              >
                <LogOut className="h-4 w-4 stroke-[1.5]" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // When Logged Out: Crisp minimal account trigger that fits desktop and mobile cleanly
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
            : `inline-flex items-center gap-1.5 whitespace-nowrap border border-[#1D1C1C] bg-white px-2.5 sm:px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#1D1C1C] hover:bg-[#C10016] hover:border-[#C10016] hover:text-white transition-colors cursor-pointer shrink-0 ${className}`
        }
        aria-label="Sign In or Create Account"
      >
        <UserIcon className="h-3.5 w-3.5 stroke-[1.5] sm:hidden" />
        <span className="hidden sm:inline">Sign In</span>
        <ArrowUpRight className="hidden sm:inline h-3.5 w-3.5" />
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
