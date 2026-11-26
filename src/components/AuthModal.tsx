"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { PublicUser } from "@/lib/types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: PublicUser) => void;
  initialMode?: "login" | "register" | "forgot";
}

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  initialMode = "login",
}: AuthModalProps) {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<"login" | "register" | "forgot">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

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
        setError(data.error || "Login failed. Please check credentials.");
        return;
      }
      if (onSuccess) onSuccess(data.user);
      onClose();
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
      onClose();
      const targetUrl =
        data.user?.role === "admin" ? "/admin/corporate" : "/dashboard";
      window.location.href = targetUrl;
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setSuccessMsg(data.message || "Password reset instructions sent.");
    } catch {
      setError("Failed to request password reset.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border-b border-[#D5CEC5] bg-transparent pl-9 pr-4 py-2.5 text-sm text-[#1D1C1C] placeholder:text-[#9A938A] focus:outline-none focus:border-[#1D1C1C] transition";

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md border border-[#C8A464]/50 bg-white p-7 sm:p-9 text-[#1D1C1C] shadow-2xl overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-[#C10016]" />

        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-[#595959] hover:text-[#C10016] transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 stroke-[1.5]" />
        </button>

        <div className="mb-6 text-center pt-1">
          <div className="font-editorial-serif italic text-3xl text-[#1D1C1C] mb-2">
            Samad Expo
          </div>
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#1D1C1C]">
            {mode === "login" && "Client Console Access"}
            {mode === "register" && "Create Developer Profile"}
            {mode === "forgot" && "Password Recovery"}
          </h2>
          <p className="mt-1.5 font-editorial-serif italic text-sm text-[#595959]">
            {mode === "login" &&
              "Sign in to manage and deploy live web applications"}
            {mode === "register" &&
              "Deploy static websites with dedicated public links"}
            {mode === "forgot" &&
              "Enter your registered email for recovery guidance"}
          </p>
        </div>

        {error && (
          <div className="mb-4 border border-[#C10016]/40 bg-[#FFF5F5] p-3 text-xs font-semibold text-[#C10016]">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 border border-emerald-700/30 bg-emerald-50 p-3 text-xs font-semibold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#595959] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#767676]" />
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
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#595959]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setSuccessMsg("");
                    setMode("forgot");
                  }}
                  className="font-editorial-serif italic text-xs text-[#C10016] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#767676]" />
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
              className="btn-3d-yellow w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-3.5 text-[11px] font-bold uppercase tracking-[0.22em] disabled:opacity-50 cursor-pointer"
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

            <div className="pt-2 text-center text-xs text-[#595959]">
              New to Samad Expo?{" "}
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setSuccessMsg("");
                  setMode("register");
                }}
                className="font-editorial-serif italic font-semibold text-[#C10016] hover:underline cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </form>
        )}

        {mode === "register" && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#595959] mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#767676]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#595959] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#767676]" />
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
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#595959] mb-1">
                Telephone (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#767676]" />
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
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#595959] mb-1">
                Password (min 8 chars)
              </label>
              <div className="relative">
                <Lock className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#767676]" />
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
              className="btn-3d-yellow w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-3.5 text-[11px] font-bold uppercase tracking-[0.22em] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center text-xs text-[#595959]">
              Already registered?{" "}
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setSuccessMsg("");
                  setMode("login");
                }}
                className="font-editorial-serif italic font-semibold text-[#C10016] hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {mode === "forgot" && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#595959] mb-1">
                Account Email
              </label>
              <div className="relative">
                <Mail className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#767676]" />
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
              className="btn-3d-yellow w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 text-[11px] font-bold uppercase tracking-[0.22em] disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Sending..." : "Request Recovery Link"}
            </button>

            <div className="pt-2 text-center text-xs text-[#595959]">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setSuccessMsg("");
                  setMode("login");
                }}
                className="font-editorial-serif italic font-semibold text-[#C10016] hover:underline cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
