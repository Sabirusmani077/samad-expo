"use client";

import React, { useState } from "react";
import {
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  ArrowRight,
  Loader2,
  ShieldCheck,
  KeyRound,
} from "lucide-react";
import { PublicUser } from "@/lib/types";
import { Card3D } from "@/components/Card3D";

interface HeroAuthCardProps {
  onSuccess?: (user: PublicUser) => void;
  dark?: boolean;
}

export function HeroAuthCard({ onSuccess, dark = true }: HeroAuthCardProps) {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed. Please check your credentials.");
        return;
      }
      if (onSuccess) onSuccess(data.user);
      const targetUrl =
        data.user?.role === "admin" ? "/admin/corporate" : "/dashboard";
      window.location.href = targetUrl;
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed.");
        return;
      }
      if (onSuccess) onSuccess(data.user);
      const targetUrl =
        data.user?.role === "admin" ? "/admin/corporate" : "/dashboard";
      window.location.href = targetUrl;
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Password reset request failed.");
        return;
      }
      setSuccessMsg(
        data.message || "Password reset instructions sent if email exists."
      );
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = dark
    ? "w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs font-medium bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:border-[#FFF33D] focus:ring-2 focus:ring-[#FFF33D]/25 outline-none transition"
    : "w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs font-medium bg-zinc-50/70 border border-zinc-200 text-zinc-950 placeholder-zinc-400 focus:bg-white focus:border-zinc-950 focus:ring-2 focus:ring-[#FFF33D] outline-none transition";

  return (
    <Card3D intensity={5} className="w-full max-w-[430px]">
      <div
        className={`hero-auth-card w-full rounded-[26px] p-6 sm:p-7 relative z-10 overflow-hidden transition-all duration-300 ${
          dark
            ? "bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 shadow-[0_28px_70px_rgba(0,0,0,0.5)] text-white"
            : "bg-white/95 backdrop-blur-xl border border-zinc-200/90 shadow-[0_28px_70px_-14px_rgba(9,9,11,0.16),0_12px_28px_-8px_rgba(234,179,8,0.18)] text-zinc-950 hover:border-amber-400/80"
        }`}
      >
      {/* Crisp Brand Yellow Top Accent Line */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-[#FFF33D]" />

      {/* Top Header Badge & Status */}
      <div className="flex items-center justify-between mb-4 pt-1">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
            dark
              ? "bg-[#FFF33D] text-zinc-950"
              : "bg-[#FEFCE8] border border-amber-300/70 text-zinc-950"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
          <span>Hosting Console</span>
        </div>

        <span
          className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
            dark
              ? "text-emerald-400 bg-emerald-950/40 border-emerald-500/30"
              : "text-emerald-700 bg-emerald-50 border-emerald-200"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Cloud</span>
        </span>
      </div>

      <div className="mb-5">
        <h3
          className={`text-xl sm:text-2xl font-black tracking-tight ${
            dark ? "text-white" : "text-zinc-950"
          }`}
        >
          {mode === "login" && "Sign In to Deploy"}
          {mode === "register" && "Create Free Account"}
          {mode === "forgot" && "Reset Password"}
        </h3>
        <p
          className={`text-xs mt-1 leading-relaxed ${
            dark ? "text-zinc-400" : "text-zinc-600"
          }`}
        >
          {mode === "login" &&
            "Access your dashboard to upload websites, preview sandboxes, and publish live URLs."}
          {mode === "register" &&
            "Start hosting static HTML & ZIP projects in seconds with instant routing."}
          {mode === "forgot" &&
            "Enter your registered email to receive password recovery instructions."}
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div
        className={`grid grid-cols-2 gap-1 p-1 rounded-xl mb-5 text-xs font-bold ${
          dark
            ? "bg-white/5 border border-white/10"
            : "bg-zinc-100 border border-zinc-200/80"
        }`}
      >
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setError("");
            setSuccessMsg("");
          }}
          className={`py-2 rounded-lg transition-all cursor-pointer ${
            mode === "login"
              ? "bg-[#FFF33D] text-zinc-950 shadow-xs font-extrabold"
              : dark
              ? "text-zinc-400 hover:text-white"
              : "text-zinc-600 hover:text-zinc-950"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("register");
            setError("");
            setSuccessMsg("");
          }}
          className={`py-2 rounded-lg transition-all cursor-pointer ${
            mode === "register"
              ? "bg-[#FFF33D] text-zinc-950 shadow-xs font-extrabold"
              : dark
              ? "text-zinc-400 hover:text-white"
              : "text-zinc-600 hover:text-zinc-950"
          }`}
        >
          Register
        </button>
      </div>

      {error && (
        <div
          className={`mb-4 p-3 rounded-xl text-xs font-semibold border ${
            dark
              ? "bg-rose-950/60 border-rose-500/40 text-rose-300"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {error}
        </div>
      )}

      {successMsg && (
        <div
          className={`mb-4 p-3 rounded-xl text-xs font-semibold border ${
            dark
              ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          {successMsg}
        </div>
      )}

      {/* LOGIN FORM */}
      {mode === "login" && (
        <form onSubmit={handleLogin} className="space-y-3.5">
          <div>
            <label
              className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${
                dark ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  dark ? "text-zinc-300" : "text-zinc-700"
                }`}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setMode("forgot");
                  setError("");
                }}
                className={`text-[11px] font-bold hover:underline cursor-pointer ${
                  dark ? "text-[#FFF33D]" : "text-amber-700 hover:text-zinc-950"
                }`}
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-3d-yellow w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider cursor-pointer disabled:opacity-70 mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Enter Hosting Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* REGISTER FORM */}
      {mode === "register" && (
        <form onSubmit={handleRegister} className="space-y-3">
          <div>
            <label
              className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${
                dark ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Full Name"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label
              className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${
                dark ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label
              className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${
                dark ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              Mobile Number (Optional)
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label
              className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${
                dark ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              Password (Min 8 Characters)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-3d-yellow w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider cursor-pointer disabled:opacity-70 mt-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account &amp; Deploy</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* FORGOT PASSWORD FORM */}
      {mode === "forgot" && (
        <form onSubmit={handleForgot} className="space-y-3.5">
          <div>
            <label
              className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${
                dark ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              Registered Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-3d-yellow w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider cursor-pointer disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending Link...</span>
              </>
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
              setSuccessMsg("");
            }}
            className="w-full text-center text-xs font-bold text-zinc-500 hover:text-zinc-950 pt-1 cursor-pointer"
          >
            Back to Sign In
          </button>
        </form>
      )}

      {/* Footer Assurance */}
      <div
        className={`mt-5 pt-4 border-t flex items-center justify-between text-[11px] ${
          dark
            ? "border-white/10 text-zinc-400"
            : "border-zinc-100 text-zinc-500"
        }`}
      >
        <span className="flex items-center gap-1.5 font-medium">
          <KeyRound className="w-3.5 h-3.5 text-amber-600" />
          <span>Unified Access</span>
        </span>
        <span
          className={`font-bold ${
            dark ? "text-[#FFF33D]" : "text-zinc-800"
          }`}
        >
          Instant Console Redirect
        </span>
      </div>
    </div>
    </Card3D>
  );
}
