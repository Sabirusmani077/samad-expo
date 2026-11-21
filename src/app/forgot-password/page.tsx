"use client";

import React, { useState } from "react";
import Link from "next/link";
import { KeyRound, Mail, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

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
    <div className="bg-slate-50 min-h-[85vh] py-14 px-4 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl space-y-6">
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FFF33D] flex items-center justify-center text-black border border-black/15 shadow-md">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-950">
              Reset Password
            </h1>
            <p className="text-xs text-slate-600">
              Enter your registered developer or administrator email to set a new password.
            </p>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-bold text-red-900">
              {error}
            </div>
          )}

          {resetCompleted ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-900">
                Your password has been reset successfully!
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#FFF33D] hover:bg-black hover:text-[#FFF33D] text-black font-extrabold text-xs uppercase tracking-wider border border-black/15 transition-all"
              >
                Sign In Now
              </Link>
            </div>
          ) : !token ? (
            <form onSubmit={handleRequestToken} className="space-y-4">
              <div>
                <label htmlFor="fp-email" className="block text-xs font-bold text-slate-800 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="fp-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="developer@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:border-black focus:ring-2 focus:ring-[#FFF33D] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#FFF33D] hover:bg-black hover:text-[#FFF33D] text-black font-extrabold text-xs uppercase tracking-wider border border-black/15 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
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
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900 font-semibold">
                Reset verification token generated. Please enter your new password below.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  New Password (min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:border-black focus:ring-2 focus:ring-[#FFF33D] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#FFF33D] hover:bg-black hover:text-[#FFF33D] text-black font-extrabold text-xs uppercase tracking-wider border border-black/15 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? "Updating Password..." : "Update Password"}
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-600">
            Remembered your credentials?{" "}
            <Link href="/login" className="font-extrabold text-black underline hover:text-slate-600">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
