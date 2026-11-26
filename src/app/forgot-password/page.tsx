"use client";

import React, { useState } from "react";
import Link from "next/link";
import { KeyRound, Mail, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetCompleted, setResetCompleted] = useState(false);

  const handleRequestToken = async (e: React.FormEvent) => {
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
      setSuccessMsg(data.message || "Reset instructions generated.");
      if (data.resetToken) {
        setToken(data.resetToken);
      }
    } catch {
      setError("Failed to request password reset.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update password.");
        return;
      }
      setResetCompleted(true);
    } catch {
      setError("Error while updating password.");
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
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white">
              Reset Password
            </h1>
            <p className="text-xs text-zinc-400">
              Enter your registered developer or administrator email to set a new password.
            </p>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-950/60 border border-rose-500/40 p-3 text-xs font-bold text-rose-200">
              {error}
            </div>
          )}

          {resetCompleted ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-white">
                Your password has been reset successfully!
              </p>
              <Link
                href="/login"
                className="btn-3d-yellow inline-flex items-center justify-center gap-2 w-full py-3 rounded-full font-extrabold text-xs uppercase tracking-wider"
              >
                Sign In Now
              </Link>
            </div>
          ) : !token ? (
            <form onSubmit={handleRequestToken} className="space-y-4">
              <div>
                <label htmlFor="fp-email" className="block text-xs font-bold text-zinc-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="fp-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="developer@example.com"
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
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Token</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSetNewPassword} className="space-y-4">
              <div className="rounded-xl bg-emerald-950/60 border border-emerald-500/40 p-3 text-xs text-emerald-200 font-semibold">
                Reset verification token generated. Please enter your new password below.
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  New Password (min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-800 text-xs text-white bg-zinc-900/90 focus:border-[#FFF33D] focus:ring-2 focus:ring-[#FFF33D]/25 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-3d-yellow w-full py-3 rounded-full font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {loading ? "Updating Password..." : "Update Password"}
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-zinc-800 text-center text-xs text-zinc-400">
            Remembered your credentials?{" "}
            <Link href="/login" className="font-extrabold text-[#FFF33D] underline hover:text-white">
              Back to Sign In
            </Link>
          </div>
        </Card3D>
      </div>
    </div>
  );
}
