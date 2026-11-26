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
    <div className="relative bg-[#0B0A0C] samad-hero-grid min-h-[85vh] py-14 px-4 flex items-center justify-center overflow-hidden">
      <ThreeHeroCanvas
        variant="dark"
        className="absolute inset-0 w-full h-full z-0 opacity-70"
      />
      <div className="relative z-10 max-w-md w-full space-y-6">
        <Card3D intensity={4}>
          <div className="bg-white border border-[#C8A464]/50 p-7 sm:p-10 space-y-6 relative overflow-hidden shadow-2xl text-[#1D1C1C]">
            <div className="absolute inset-x-0 top-0 h-1 bg-[#C10016]" />
            <div className="space-y-2 text-center pt-1">
              <div className="w-11 h-11 mx-auto bg-[#1D1C1C] flex items-center justify-center text-[#C8A464]">
                <Lock className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h1 className="text-xl font-bold uppercase tracking-[0.18em] text-[#1D1C1C]">
                Client Console Sign In
              </h1>
              <p className="font-editorial-serif italic text-sm text-[#595959]">
                Access your hosting studio, manage deployments, or administer platform properties.
              </p>
            </div>

            {error && (
              <div className="bg-[#FFF5F5] border border-[#C10016]/40 p-3 text-xs font-semibold text-[#C10016]">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#595959] mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#767676] absolute left-2 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="developer@example.com"
                    className="w-full pl-9 pr-3.5 py-2.5 border-b border-[#D5CEC5] text-xs text-[#1D1C1C] bg-transparent focus:border-[#1D1C1C] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="login-password"
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#595959]"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="font-editorial-serif italic text-xs text-[#C10016] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#767676] absolute left-2 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-3.5 py-2.5 border-b border-[#D5CEC5] text-xs text-[#1D1C1C] bg-transparent focus:border-[#1D1C1C] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-3d-yellow w-full py-3.5 font-bold text-[11px] uppercase tracking-[0.22em] flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
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

            <div className="pt-4 border-t border-[#E5DFD7] text-center text-xs text-[#595959] space-y-3">
              <p>
                New to Samad Expo?{" "}
                <Link
                  href="/register"
                  className="font-editorial-serif italic font-semibold text-[#C10016] underline"
                >
                  Create Developer Account
                </Link>
              </p>
              <div className="flex items-center justify-between pt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#767676]">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C10016]" /> Verified Auth
                </span>
                <Link href="/" className="text-[#1D1C1C] hover:text-[#C10016] underline">
                  ← Return Home
                </Link>
              </div>
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
