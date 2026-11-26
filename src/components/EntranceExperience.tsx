"use client";

import React, { useEffect, useState } from "react";
import { X, Send, CheckCircle2, MessageSquare } from "lucide-react";

interface EntranceExperienceProps {
  onOpenAuth?: () => void;
}

export function EntranceExperience({ onOpenAuth }: EntranceExperienceProps) {
  const [showPreloader, setShowPreloader] = useState(false);
  const [preloaderFading, setPreloaderFading] = useState(false);
  const [preloadPct, setPreloadPct] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "Static Website Hosting",
    message: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadySeen = sessionStorage.getItem("samad_expo_intro_seen");

    if (!alreadySeen && !reduceMotion) {
      setShowPreloader(true);
      setPreloadPct(12);
      const step1 = setTimeout(() => setPreloadPct(48), 220);
      const step2 = setTimeout(() => setPreloadPct(86), 520);
      const step3 = setTimeout(() => setPreloadPct(100), 760);
      const fadeTimer = setTimeout(() => setPreloaderFading(true), 950);
      const hideTimer = setTimeout(() => {
        setShowPreloader(false);
      }, 1400);

      const popupTimer = setTimeout(() => {
        setShowPopup(true);
        sessionStorage.setItem("samad_expo_intro_seen", "1");
      }, 4200);

      return () => {
        clearTimeout(step1);
        clearTimeout(step2);
        clearTimeout(step3);
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
        clearTimeout(popupTimer);
      };
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showPopup) {
        setShowPopup(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showPopup]);

  const handleClosePopup = () => {
    setShowPopup(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("samad_expo_intro_seen", "1");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      const compiledMsg = form.message.trim()
        ? `${form.interest}: ${form.message.trim()}`
        : `Interested in ${form.interest}. Please share project details.`;

      const res = await fetch("/api/corporate/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          subject: `Consultation: ${form.interest}`,
          message: compiledMsg.length >= 10 ? compiledMsg : `${compiledMsg} (Maison inquiry)`,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMsg(data.error || "Please verify your details and retry.");
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
      setTimeout(() => {
        handleClosePopup();
      }, 2200);
    } catch {
      setErrorMsg("Network error. Please retry or email officialaadhakh@gmail.com.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* 1. Cartier Into-The-Wild Pure White Opening Veil with Percentage Telemetry */}
      {showPreloader && (
        <div
          aria-hidden="true"
          className={`fixed inset-0 z-[80] bg-white flex flex-col items-center justify-between py-12 px-6 transition-opacity duration-500 ${
            preloaderFading ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="font-editorial-serif italic text-xl text-[#1D1C1C]">
            Samad Expo
          </div>

          <div className="space-y-4 text-center max-w-md">
            <p className="font-editorial-serif text-xl sm:text-2xl text-[#1D1C1C] leading-snug">
              Follow the craft to discover{" "}
              <span className="italic">Samad Expo&apos;s</span> digital maison and cloud engine.
            </p>
            <div className="w-40 h-[1.5px] bg-[#E5DFD7] overflow-hidden mx-auto">
              <div className="h-full w-full bg-[#C10016] animate-samad-preload" />
            </div>
          </div>

          <div className="font-editorial-serif text-xs tracking-[0.25em] text-[#767676]">
            {preloadPct}
          </div>
        </div>
      )}

      {/* 2. Floating Atelier Quick-Contact & Concierge Control */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5">
        {onOpenAuth && (
          <button
            type="button"
            onClick={onOpenAuth}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 bg-white/95 border border-[#1D1C1C] text-[10px] font-bold uppercase tracking-[0.2em] text-[#1D1C1C] hover:bg-[#1D1C1C] hover:text-white backdrop-blur-md shadow-md transition cursor-pointer"
          >
            Console Sign In
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setErrorMsg("");
            setShowPopup((prev) => !prev);
          }}
          aria-label="Contact Maison Concierge"
          className="w-12 h-12 bg-[#1D1C1C] border border-[#C8A464]/70 text-white hover:bg-[#C10016] hover:border-[#C10016] flex items-center justify-center shadow-[0_12px_30px_rgba(29,28,28,0.28)] transition-all duration-300 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 stroke-[1.5]" />
        </button>
      </div>

      {/* 3. Cartier-Styled Split Maison Consultation Modal */}
      {showPopup && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Connect With Samad Expo"
          onClick={handleClosePopup}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-samad-modal relative w-full max-w-3xl overflow-hidden border border-[#C8A464]/45 bg-white shadow-2xl grid grid-cols-1 md:grid-cols-12"
          >
            {/* Left Atelier Panel (5 cols) */}
            <div className="md:col-span-5 relative bg-[#0B0A0C] text-white p-8 flex flex-col justify-between min-h-[240px] border-b md:border-b-0 md:border-r border-[#C8A464]/30 overflow-hidden">
              <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#C10016]/25 blur-[90px]" />

              <div className="relative z-10 space-y-1">
                <div className="font-editorial-serif italic text-2xl text-white">
                  Samad Expo
                </div>
                <div className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#C8A464]">
                  Digital Architecture &middot; Agra
                </div>
              </div>

              <div className="relative z-10 my-8 flex justify-center">
                <div className="w-28 h-28 bg-[#151215] border border-[#C8A464]/50 p-4 flex items-center justify-center shadow-[0_18px_40px_rgba(0,0,0,0.85)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/primary-logo.png"
                    alt="Samad Expo Crest"
                    className="w-full h-full object-contain invert"
                  />
                </div>
              </div>

              <div className="relative z-10 space-y-1 border-t border-white/10 pt-4">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-white">
                  Client Advisory Desk
                </div>
                <div className="font-editorial-serif italic text-sm text-[#C8A464]">
                  Dedicated deployment &amp; platform support
                </div>
              </div>
            </div>

            {/* Right Clean Gallery Form Panel (7 cols) */}
            <div className="md:col-span-7 p-7 sm:p-9 relative bg-white text-[#1D1C1C]">
              <button
                type="button"
                onClick={handleClosePopup}
                aria-label="Close modal"
                className="absolute top-4 right-4 p-2 text-[#595959] hover:text-[#C10016] transition cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>

              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-10 space-y-4">
                  <div className="w-12 h-12 border border-[#C10016] text-[#C10016] flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="text-base font-bold uppercase tracking-[0.18em] text-[#1D1C1C]">
                    Enquiry Received
                  </h3>
                  <p className="font-editorial-serif italic text-sm text-[#595959] max-w-xs">
                    Our client advisory desk in Agra will respond to your request shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1 pr-6">
                    <div className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#C10016]">
                      Private Consultation
                    </div>
                    <h3 className="text-lg font-bold uppercase tracking-[0.12em] text-[#1D1C1C]">
                      Contact an Advisor
                    </h3>
                    <p className="font-editorial-serif italic text-sm text-[#595959]">
                      Share your project vision to configure bespoke hosting or web software.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-2.5 border border-[#C10016]/40 bg-[#FFF5F5] text-xs text-[#C10016] font-medium">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#595959] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your Full Name"
                        className="w-full px-0 py-2 border-b border-[#D5CEC5] bg-transparent text-xs text-[#1D1C1C] placeholder:text-[#9A938A] focus:border-[#1D1C1C] outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#595959] mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full px-0 py-2 border-b border-[#D5CEC5] bg-transparent text-xs text-[#1D1C1C] placeholder:text-[#9A938A] focus:border-[#1D1C1C] outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#595959] mb-1">
                        Telephone
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 94582 04216"
                        className="w-full px-0 py-2 border-b border-[#D5CEC5] bg-transparent text-xs text-[#1D1C1C] placeholder:text-[#9A938A] focus:border-[#1D1C1C] outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#595959] mb-1">
                        Service Focus *
                      </label>
                      <select
                        value={form.interest}
                        onChange={(e) => setForm({ ...form, interest: e.target.value })}
                        className="w-full px-0 py-2 border-b border-[#D5CEC5] bg-white text-xs text-[#1D1C1C] focus:border-[#1D1C1C] outline-none transition"
                      >
                        <option value="Static Website Hosting">Static Website Hosting</option>
                        <option value="Custom Web Application">Custom Web Application</option>
                        <option value="Utility Tools & Ecosystem">Utility Tools &amp; Ecosystem</option>
                        <option value="MCP JSON-RPC Integration">MCP JSON-RPC Integration</option>
                        <option value="Strategic Partnership">Strategic Partnership</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#595959] mb-1">
                      Project Notes
                    </label>
                    <textarea
                      rows={2}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Brief outline of your web project or inquiry..."
                      className="w-full px-0 py-2 border-b border-[#D5CEC5] bg-transparent text-xs text-[#1D1C1C] placeholder:text-[#9A938A] focus:border-[#1D1C1C] outline-none transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-3d-yellow w-full py-3.5 text-[11px] font-bold uppercase tracking-[0.22em] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? "Sending..." : "Send Direct Enquiry"}</span>
                  </button>

                  <p className="text-center font-editorial-serif italic text-xs text-[#767676]">
                    Handled confidentially at officialaadhakh@gmail.com
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
