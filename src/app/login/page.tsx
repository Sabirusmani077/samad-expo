"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ShieldCheck, Mail, ArrowRight, Loader2 } from "lucide-react";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next") || searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        setError(data.error || "Invalid login credentials.");
        return;
      }

      let redirectTarget = data.user?.role === "admin" ? "/admin/corporate" : "/dashboard";
      if (nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")) {
        redirectTarget = nextParam;
      }

      router.push(redirectTarget);
      router.refresh();
    } catch {
      setError("Network error while signing in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-[#060608] samad-hero-grid min-h-[85vh] py-14 px-4 flex items-center justify-center overflow-hidden">
      <ThreeHeroCanvas
        variant="dark"
        className="absolute inset-0 w-full h-full z-0 opacity-65"
      />
      <div className="relative z-10 max-w-md w-full space-y-6">
        <Card3D intensity={5} className="samad-card p-6 sm:p-8 space-y-6 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-[#FFF33D]" />
          <div className="space-y-2 text-center pt-1">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FFF33D] flex items-center justify-center text-black border border-black/15 shadow-[0_6px_18px_rgba(255,243,61,0.3)]">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white">
              Sign In to Samad Expo
            </h1>
            <p className="text-xs text-zinc-400">
              Access your hosting dashboard, deploy web apps, or manage administrative systems.
            </p>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-950/60 border border-rose-500/40 p-3 text-xs font-bold text-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-bold text-zinc-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-800 text-xs text-white bg-zinc-900/90 focus:border-[#FFF33D] focus:ring-2 focus:ring-[#FFF33D]/25 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="login-password" className="text-xs font-bold text-zinc-300">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#FFF33D] underline font-semibold hover:text-white"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-800 text-xs text-white bg-zinc-900/90 focus:border-[#FFF33D] focus:ring-2 focus:ring-[#FFF33D]/25 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-3d-yellow w-full py-3 rounded-full font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-zinc-800 text-center text-xs text-zinc-400 space-y-3">
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-extrabold text-[#FFF33D] underline hover:text-white">
                Register as Developer
              </Link>
            </p>
            <div className="flex items-center justify-between pt-2 text-[11px] text-zinc-500">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FFF33D]" /> Secure Session Auth
              </span>
              <Link href="/" className="font-semibold text-[#FFF33D] underline">
                ← Back to Home
              </Link>
            </div>
          </div>
        </Card3D>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center text-sm text-slate-500">
          Loading sign in...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
