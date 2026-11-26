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
    "w-full py-2.5 border-b border-[#D5CEC5] bg-transparent text-sm text-[#1D1C1C] placeholder:text-[#9A938A] focus:border-[#1D1C1C] outline-none transition";

  return (
    <div className="bg-white min-h-screen text-[#1D1C1C]">
      <section className="samad-hero-grid border-b border-[#C8A464]/25 pt-14 pb-16 relative overflow-hidden text-white">
        <ThreeHeroCanvas variant="dark" className="opacity-80" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0A0C] via-[#0B0A0C]/40 to-transparent z-[1]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-5">
          <nav
            aria-label="Breadcrumb"
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2"
          >
            <Link href="/" className="hover:text-[#C8A464] transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#C8A464]">Contact Advisor</span>
          </nav>

          <div className="space-y-3 max-w-3xl">
            <div className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#C8A464]">
              Client &amp; Advisory Desk
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-[0.14em] text-white leading-tight">
              Connect With{" "}
              <span className="samad-highlight !text-[#E5C78E]">Samad Expo</span>
            </h1>
            <p className="font-editorial-serif italic text-base sm:text-xl text-zinc-300 leading-relaxed">
              Speak directly with our Agra engineering desk for hosting support, bespoke web development, or alliances.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-[#FAF7F2] py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            <div className="lg:col-span-5 space-y-6">
              <Card3D intensity={4}>
                <div className="samad-card p-8 space-y-6 border-t-2 border-t-[#C10016]">
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#1D1C1C]">
                    Direct Client Channels
                  </h2>

                  <div className="space-y-4 text-sm">
                    <a
                      href="mailto:officialaadhakh@gmail.com"
                      className="flex items-start gap-3.5 group py-2 hover:text-[#C10016] transition"
                    >
                      <div className="w-10 h-10 bg-[#1D1C1C] text-[#C8A464] flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 stroke-[1.5]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C10016]">
                          Official Email
                        </p>
                        <p className="font-bold text-[#1D1C1C] break-all group-hover:text-[#C10016]">
                          officialaadhakh@gmail.com
                        </p>
                      </div>
                    </a>

                    <a
                      href="tel:+919458204216"
                      className="flex items-start gap-3.5 group py-2 transition"
                    >
                      <div className="w-10 h-10 border border-[#C8A464] bg-white text-[#1D1C1C] group-hover:bg-[#1D1C1C] group-hover:text-white flex items-center justify-center shrink-0 transition">
                        <Phone className="w-4 h-4 stroke-[1.5]" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C10016]">
                          Telephone
                        </p>
                        <p className="font-bold text-[#1D1C1C] group-hover:text-[#C10016]">
                          +91 94582 04216
                        </p>
                      </div>
                    </a>

                    <a
                      href="https://maps.app.goo.gl/UnzqY6kZ3i2BRieKA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3.5 group py-2 transition"
                    >
                      <div className="w-10 h-10 border border-[#C8A464] bg-white text-[#1D1C1C] group-hover:bg-[#1D1C1C] group-hover:text-white flex items-center justify-center shrink-0 transition">
                        <MapPin className="w-4 h-4 stroke-[1.5]" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C10016]">
                          Maison HQ
                        </p>
                        <p className="font-bold text-[#1D1C1C] inline-flex items-center gap-1 group-hover:text-[#C10016]">
                          <span>Bodla, Agra, Uttar Pradesh 282010</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </p>
                      </div>
                    </a>
                  </div>

                  <div className="pt-4 border-t border-[#E5DFD7] flex items-center gap-2.5 text-xs text-[#595959]">
                    <Clock className="w-4 h-4 text-[#C10016] shrink-0" />
                    <span className="font-editorial-serif italic text-sm">
                      Monday &ndash; Saturday &middot; Dedicated Advisory Review
                    </span>
                  </div>
                </div>
              </Card3D>

              <Card3D intensity={4}>
                <div className="samad-card p-7 space-y-3">
                  <div className="flex items-center gap-2 text-[#C10016] text-[10px] font-bold uppercase tracking-[0.22em]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verified Engineering Desk</span>
                  </div>
                  <p className="font-editorial-serif text-sm text-[#595959] leading-relaxed">
                    Every submission is logged directly for confidential review by the Samad Expo technical advisory desk.
                  </p>
                </div>
              </Card3D>
            </div>

            <div className="lg:col-span-7">
              <Card3D intensity={3}>
                <div className="samad-card p-8 sm:p-10 relative overflow-hidden border-t-2 border-t-[#C10016]">
                  <div className="mb-8 space-y-1.5">
                    <h2 className="text-lg font-bold uppercase tracking-[0.18em] text-[#1D1C1C]">
                      Send an Inquiry
                    </h2>
                    <p className="font-editorial-serif italic text-sm text-[#595959]">
                      Share your project requirements or consultation brief below.
                    </p>
                  </div>

                  {submitted && (
                    <div className="mb-6 p-4 border border-emerald-700/30 bg-emerald-50 text-emerald-900 text-xs font-semibold flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                      <span>
                        Thank you. Your inquiry has been received cleanly by our advisory desk.
                      </span>
                    </div>
                  )}

                  {error && (
                    <div className="mb-6 p-4 border border-[#C10016]/40 bg-[#FFF5F5] text-[#C10016] text-xs font-semibold">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#595959] mb-1"
                        >
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
                        <label
                          htmlFor="contact-email"
                          className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#595959] mb-1"
                        >
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="contact-phone"
                          className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#595959] mb-1"
                        >
                          Telephone
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
                        <label
                          htmlFor="contact-company"
                          className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#595959] mb-1"
                        >
                          Organization
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
                      <label
                        htmlFor="contact-subject"
                        className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#595959] mb-1"
                      >
                        Subject *
                      </label>
                      <input
                        id="contact-subject"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Website Hosting, Custom Engineering, or Alliance"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#595959] mb-1"
                      >
                        Message *
                      </label>
                      <textarea
                        id="contact-message"
                        required
                        minLength={10}
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Share project objectives, hosting volume, or inquiry details..."
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-3d-yellow w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-3.5 text-[11px] font-bold uppercase tracking-[0.22em] disabled:opacity-60 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submitting ? "Sending..." : "Submit Inquiry"}</span>
                    </button>
                  </form>
                </div>
              </Card3D>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
