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
                <UserPlus className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h1 className="text-xl font-bold uppercase tracking-[0.18em] text-[#1D1C1C]">
                Create Developer Account
              </h1>
              <p className="font-editorial-serif italic text-sm text-[#595959]">
                Deploy static websites cleanly inside isolated preview sandboxes.
              </p>
            </div>

            {error && (
              <div className="bg-[#FFF5F5] border border-[#C10016]/40 p-3 text-xs font-semibold text-[#C10016]">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label
                  htmlFor="reg-name"
                  className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#595959] mb-1"
                >
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#767676] absolute left-2 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full pl-9 pr-3.5 py-2.5 border-b border-[#D5CEC5] text-xs text-[#1D1C1C] bg-transparent focus:border-[#1D1C1C] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="reg-email"
                  className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#595959] mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#767676] absolute left-2 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-email"
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
                <label
                  htmlFor="reg-phone"
                  className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#595959] mb-1"
                >
                  Telephone (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#767676] absolute left-2 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3.5 py-2.5 border-b border-[#D5CEC5] text-xs text-[#1D1C1C] bg-transparent focus:border-[#1D1C1C] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="reg-password"
                  className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#595959] mb-1"
                >
                  Password (min 6 chars)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#767676] absolute left-2 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
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
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account &amp; Host</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-[#E5DFD7] text-center text-xs text-[#595959] space-y-3">
              <p>
                Already registered?{" "}
                <Link
                  href="/login"
                  className="font-editorial-serif italic font-semibold text-[#C10016] underline"
                >
                  Sign In
                </Link>
              </p>
              <div className="flex items-center justify-between pt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#767676]">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C10016]" /> Instant Access
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
