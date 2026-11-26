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
                <KeyRound className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h1 className="text-xl font-bold uppercase tracking-[0.18em] text-[#1D1C1C]">
                Reset Password
              </h1>
              <p className="font-editorial-serif italic text-sm text-[#595959]">
                Enter your registered account email to configure a new password.
              </p>
            </div>

            {error && (
              <div className="bg-[#FFF5F5] border border-[#C10016]/40 p-3 text-xs font-semibold text-[#C10016]">
                {error}
              </div>
            )}

            {resetCompleted ? (
              <div className="text-center space-y-4">
                <div className="w-12 h-12 mx-auto border border-emerald-700/30 bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-[#1D1C1C]">
                  Your password has been updated successfully.
                </p>
                <Link
                  href="/login"
                  className="btn-3d-yellow inline-flex items-center justify-center gap-2 w-full py-3.5 font-bold text-[11px] uppercase tracking-[0.22em]"
                >
                  Sign In Now
                </Link>
              </div>
            ) : !token ? (
              <form onSubmit={handleRequestToken} className="space-y-4">
                <div>
                  <label
                    htmlFor="fp-email"
                    className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#595959] mb-1"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#767676] absolute left-2 top-1/2 -translate-y-1/2" />
                    <input
                      id="fp-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="developer@example.com"
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
                <div className="bg-emerald-50 border border-emerald-700/30 p-3 text-xs text-emerald-900 font-semibold">
                  Reset verification token issued. Enter your new password below.
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#595959] mb-1">
                    New Password (min 6 chars)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 border-b border-[#D5CEC5] text-xs text-[#1D1C1C] bg-transparent focus:border-[#1D1C1C] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-3d-yellow w-full py-3.5 font-bold text-[11px] uppercase tracking-[0.22em] flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                {loading ? "Updating Password..." : "Update Password"}
              </button>
            </form>
          )}

            <div className="pt-4 border-t border-[#E5DFD7] text-center text-xs text-[#595959]">
              Remembered your credentials?{" "}
              <Link
                href="/login"
                className="font-editorial-serif italic font-semibold text-[#C10016] underline"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </Card3D>
      </div>
    </div>
  );
}
