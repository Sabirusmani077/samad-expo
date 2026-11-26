"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, ShieldCheck, Mail, Lock, User as UserIcon, Phone, ArrowRight, Loader2 } from "lucide-react";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        setError(data.error || "Unable to create account.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error while creating account.");
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
              <UserPlus className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white">
              Create Developer Account
            </h1>
            <p className="text-xs text-zinc-400">
              Deploy static websites, access live preview environments, and manage public deployment URLs.
            </p>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-950/60 border border-rose-500/40 p-3 text-xs font-bold text-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="reg-name" className="block text-xs font-bold text-zinc-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sabir Usmani"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-800 text-xs text-white bg-zinc-900/90 focus:border-[#FFF33D] focus:ring-2 focus:ring-[#FFF33D]/25 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-xs font-bold text-zinc-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="reg-email"
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
              <label htmlFor="reg-phone" className="block text-xs font-bold text-zinc-300 mb-1">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="reg-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-800 text-xs text-white bg-zinc-900/90 focus:border-[#FFF33D] focus:ring-2 focus:ring-[#FFF33D]/25 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-xs font-bold text-zinc-300 mb-1">
                Password (min 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="reg-password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account &amp; Start Hosting</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-zinc-800 text-center text-xs text-zinc-400 space-y-3">
            <p>
              Already registered?{" "}
              <Link href="/login" className="font-extrabold text-[#FFF33D] underline hover:text-white">
                Sign In
              </Link>
            </p>
            <div className="flex items-center justify-between pt-2 text-[11px] text-zinc-500">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FFF33D]" /> Instant Activation
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
