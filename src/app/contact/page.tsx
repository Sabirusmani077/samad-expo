"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";
import {
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    setSubmitted(false);

    try {
      const res = await fetch("/api/corporate/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          subject: subject || "Corporate Inquiry",
          inquiryType: "business",
          message,
          consent: true,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Unable to submit inquiry.");
        return;
      }

      setSubmitted(true);
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setSubject("");
      setMessage("");
    } catch {
      setError("Network error while submitting your inquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-zinc-800 text-sm text-white bg-zinc-900/90 placeholder:text-zinc-500 focus:border-[#FFF33D] focus:ring-2 focus:ring-[#FFF33D]/25 outline-none transition";

  return (
    <div className="bg-[#060608] min-h-screen text-white">
      <section className="samad-hero-grid border-b border-zinc-800/80 pt-10 pb-14 sm:pt-14 sm:pb-16 relative overflow-hidden">
        <ThreeHeroCanvas
          variant="dark"
          className="absolute inset-0 w-full h-full z-0 opacity-75"
        />
        <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-[#FFF33D]/15 blur-[120px]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-5">
          <nav
            aria-label="Breadcrumb"
            className="text-xs text-zinc-400 flex items-center gap-2"
          >
            <Link href="/" className="hover:text-[#FFF33D] font-semibold transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#FFF33D] font-bold">Contact Us</span>
          </nav>

          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF33D]/10 border border-[#FFF33D]/30 text-[#FFF33D] text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Corporate &amp; Support Desk</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Connect with <span className="samad-highlight">Samad Expo</span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Reach out for website hosting assistance, custom full-stack software projects, or corporate partnership inquiries.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-[#0B0B0F] py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            <div className="lg:col-span-5 space-y-6">
              <Card3D intensity={5} className="samad-card p-7 space-y-6">
                <h2 className="text-lg font-black text-white tracking-tight">
                  Direct Contact Details
                </h2>

                <div className="space-y-4 text-sm">
                  <a
                    href="mailto:officialaadhakh@gmail.com"
                    className="flex items-start gap-3.5 group p-2.5 rounded-2xl hover:bg-white/5 transition"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#FFF33D] text-zinc-950 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase font-bold text-[#FFF33D]">
                        Official Email
                      </p>
                      <p className="font-bold text-white break-all group-hover:underline">
                        officialaadhakh@gmail.com
                      </p>
                    </div>
                  </a>

                  <a
                    href="tel:+919458204216"
                    className="flex items-start gap-3.5 group p-2.5 rounded-2xl hover:bg-white/5 transition"
                  >
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-[#FFF33D]/30 group-hover:bg-[#FFF33D] text-[#FFF33D] group-hover:text-zinc-950 flex items-center justify-center shrink-0 transition">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase font-bold text-[#FFF33D]">
                        Phone Number
                      </p>
                      <p className="font-bold text-white group-hover:underline">
                        +91 94582 04216
                      </p>
                    </div>
                  </a>

                  <a
                    href="https://maps.app.goo.gl/UnzqY6kZ3i2BRieKA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3.5 group p-2.5 rounded-2xl hover:bg-white/5 transition"
                  >
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-[#FFF33D]/30 group-hover:bg-[#FFF33D] text-[#FFF33D] group-hover:text-zinc-950 flex items-center justify-center shrink-0 transition">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase font-bold text-[#FFF33D]">
                        Headquarters
                      </p>
                      <p className="font-bold text-white inline-flex items-center gap-1 group-hover:underline">
                        <span>Bodla, Agra, Uttar Pradesh 282010</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </p>
                    </div>
                  </a>
                </div>

                <div className="pt-4 border-t border-zinc-800/80 flex items-center gap-2.5 text-xs text-zinc-400 font-medium">
                  <Clock className="w-4 h-4 text-[#FFF33D] shrink-0" />
                  <span>Mon &ndash; Sat &middot; Direct Leadership Review</span>
                </div>
              </Card3D>

              <Card3D intensity={5} className="samad-card p-6 space-y-3 border-t-2 border-t-[#FFF33D]">
                <div className="flex items-center gap-2 text-[#FFF33D] text-xs font-extrabold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Executive Desk</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  All inquiries sent through this form are stored securely and reviewed directly by Samad Expo founder Sabir Usmani.
                </p>
              </Card3D>
            </div>

            <div className="lg:col-span-7">
              <Card3D intensity={3} className="samad-card p-7 sm:p-10 relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1.5 bg-[#FFF33D]" />

                <div className="mb-6 space-y-1 pt-1">
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    Send an Inquiry
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    Share your project details or partnership brief below.
                  </p>
                </div>

                {submitted && (
                  <div className="mb-6 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm font-semibold flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>
                      Thank you! Your inquiry has been received and logged for review.
                    </span>
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs sm:text-sm font-semibold">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-bold text-zinc-300 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        id="contact-name"
                        required
                        minLength={2}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-bold text-zinc-300 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-phone" className="block text-xs font-bold text-zinc-300 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        id="contact-phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 ..."
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-company" className="block text-xs font-bold text-zinc-300 mb-1.5">
                        Company / Organization
                      </label>
                      <input
                        id="contact-company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Organization name"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-bold text-zinc-300 mb-1.5">
                      Subject *
                    </label>
                    <input
                      id="contact-subject"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Website Hosting, Custom Software, or Partnership"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-bold text-zinc-300 mb-1.5">
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      minLength={10}
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your project, partnership idea, or support request..."
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-3d-yellow w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-extrabold text-xs uppercase tracking-wider disabled:opacity-60 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? "Sending..." : "Submit Message"}</span>
                  </button>
                </form>
              </Card3D>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
