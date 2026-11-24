"use client";

import React, { useState } from "react";
import { Lock, Mail, User as UserIcon, Phone, ArrowRight, Loader2, CheckCircle2, ShieldCheck, Sparkles, KeyRound } from "lucide-react";
import { PublicUser } from "@/lib/types";

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
      const targetUrl = data.user?.role === "admin" ? "/admin/corporate" : "/dashboard";
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
      const targetUrl = data.user?.role === "admin" ? "/admin/corporate" : "/dashboard";
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
      setSuccessMsg(data.message || "Password reset instructions sent if email exists.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`hero-auth-card w-full max-w-[430px] rounded-[28px] p-6 sm:p-7 relative z-10 transition-all duration-300 ${
        dark
          ? "bg-[#091519]/90 backdrop-blur-xl border border-teal-500/20 shadow-[0_24px_70px_rgba(0,0,0,0.6)] text-white hover:border-teal-500/40"
          : "bg-white/95 backdrop-blur-md border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.12)] text-slate-900"
      }`}
    >
      {/* Top Header Badge & Title */}
      <div className="flex items-center justify-between mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/30 text-teal-300 text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>Console Authentication</span>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live Auth</span>
        </span>
      </div>

      <div className="mb-5">
        <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${dark ? "text-white" : "text-slate-950"}`}>
          {mode === "login" && "Sign In to Workspace"}
          {mode === "register" && "Create Developer Account"}
          {mode === "forgot" && "Reset Password"}
        </h3>
        <p className={`text-xs mt-1 leading-relaxed ${dark ? "text-zinc-400" : "text-slate-600"}`}>
          {mode === "login" && "Enter your credentials to access hosting dashboard and live projects."}
          {mode === "register" && "Join Samad Expo to deploy and host web applications instantly."}
          {mode === "forgot" && "Enter your registered email to receive account recovery instructions."}
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className={`grid grid-cols-2 gap-1 p-1 rounded-xl mb-5 text-xs font-bold ${dark ? "bg-white/5 border border-white/5" : "bg-slate-100 border border-slate-200"}`}>
        <button
          type="button"
          onClick={() => { setMode("login"); setError(""); setSuccessMsg(""); }}
          className={`py-2 rounded-lg transition-all cursor-pointer ${
            mode === "login"
              ? "bg-[#20A9BB] text-white shadow-xs font-black"
              : dark ? "text-zinc-400 hover:text-white" : "text-slate-600 hover:text-slate-950"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => { setMode("register"); setError(""); setSuccessMsg(""); }}
          className={`py-2 rounded-lg transition-all cursor-pointer ${
            mode === "register"
              ? "bg-[#20A9BB] text-white shadow-xs font-black"
              : dark ? "text-zinc-400 hover:text-white" : "text-slate-600 hover:text-slate-950"
          }`}
        >
          Register
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-medium animate-in fade-in">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-medium animate-in fade-in">
          {successMsg}
        </div>
      )}

      {/* LOGIN FORM */}
      {mode === "login" && (
        <form onSubmit={handleLogin} className="space-y-3.5">
          <div>
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${dark ? "text-zinc-300" : "text-slate-700"}`}>
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs font-medium outline-none transition ${
                  dark
                    ? "bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                    : "bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-black focus:ring-1 focus:ring-black"
                }`}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={`text-[11px] font-bold uppercase tracking-wider ${dark ? "text-zinc-300" : "text-slate-700"}`}>
                Password
              </label>
              <button
                type="button"
                onClick={() => { setMode("forgot"); setError(""); }}
                className="text-[11px] text-teal-400 hover:underline cursor-pointer"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs font-medium outline-none transition ${
                  dark
                    ? "bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                    : "bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-black focus:ring-1 focus:ring-black"
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#20A9BB] hover:bg-[#1A8D9D] text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer disabled:opacity-70 mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Console</span>
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
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${dark ? "text-zinc-300" : "text-slate-700"}`}>
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Developer Name"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs font-medium outline-none transition ${
                  dark
                    ? "bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                    : "bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-black focus:ring-1 focus:ring-black"
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${dark ? "text-zinc-300" : "text-slate-700"}`}>
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs font-medium outline-none transition ${
                  dark
                    ? "bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                    : "bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-black focus:ring-1 focus:ring-black"
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${dark ? "text-zinc-300" : "text-slate-700"}`}>
              Mobile Number (Optional)
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs font-medium outline-none transition ${
                  dark
                    ? "bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                    : "bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-black focus:ring-1 focus:ring-black"
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${dark ? "text-zinc-300" : "text-slate-700"}`}>
              Password (Min 8 Characters)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs font-medium outline-none transition ${
                  dark
                    ? "bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                    : "bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-black focus:ring-1 focus:ring-black"
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#20A9BB] hover:bg-[#1A8D9D] text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer disabled:opacity-70 mt-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account &amp; Enter</span>
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
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${dark ? "text-zinc-300" : "text-slate-700"}`}>
              Enter Registered Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs font-medium outline-none transition ${
                  dark
                    ? "bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                    : "bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-black focus:ring-1 focus:ring-black"
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#20A9BB] hover:bg-[#1A8D9D] text-white text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending Reset Link...</span>
              </>
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* Footer Assurance */}
      <div className={`mt-5 pt-4 border-t flex items-center justify-between text-[10px] ${dark ? "border-white/10 text-zinc-400" : "border-slate-200 text-slate-500"}`}>
        <span className="flex items-center gap-1">
          <KeyRound className="w-3 h-3 text-teal-400" />
          <span>Unified Access</span>
        </span>
        <span className={`font-semibold ${dark ? "text-teal-300" : "text-slate-700"}`}>
          Instant Redirect to Console
        </span>
      </div>
    </div>
  );
}
