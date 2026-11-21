"use client";

import React, { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";

interface AdminLogoutButtonProps {
  className?: string;
  variant?: "header" | "sidebar";
}

export function AdminLogoutButton({ className = "", variant = "header" }: AdminLogoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/";
    } catch {
      window.location.reload();
    }
  };

  if (variant === "sidebar") {
    return (
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        className={`w-full flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-xs font-extrabold text-rose-300 transition hover:bg-rose-600 hover:text-white hover:border-rose-600 active:scale-95 cursor-pointer shadow-xs disabled:opacity-50 ${className}`}
        title="Sign Out from Admin Control Center"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-rose-300" />
            <span>Signing Out...</span>
          </>
        ) : (
          <>
            <LogOut className="h-4 w-4" />
            <span>Sign Out / Log Out</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-600 hover:text-white hover:border-rose-600 rounded-xl transition cursor-pointer active:scale-95 disabled:opacity-50 ${className}`}
      title="Sign Out from Admin Control Center"
    >
      {loading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Signing Out...</span>
        </>
      ) : (
        <>
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </>
      )}
    </button>
  );
}
