"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  Award,
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

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-14 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-slate-500 flex items-center gap-2"
        >
          <Link href="/" className="hover:text-teal-700 font-semibold transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">Contact Headquarters</span>
        </nav>

        {/* Athenura Editorial Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-50 text-teal-800 text-xs font-bold uppercase tracking-wider border border-cyan-100">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Corporate Communications</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-tight">
            Connect with <span className="text-gradient-teal">Samad Expo</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Reach out for enterprise partnerships, digital platform collaborations, instant hosting support, or corporate advisory.
          </p>
        </div>

        {/* 2-Column Athenura Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Left Column: Direct Details & Trust Badges (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="athenura-card p-7 space-y-6">
              <h2 className="text-lg font-black text-slate-950 tracking-tight">
                Direct Contact Points
              </h2>

              <div className="space-y-5 text-sm">
                {/* Email */}
                <a
                  href="mailto:officialaadhakh@gmail.com"
                  className="flex items-start gap-3.5 group p-2 rounded-2xl hover:bg-slate-50 transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 group-hover:bg-[#20A9BB] group-hover:text-white transition duration-300">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-slate-400">Official Email</p>
                    <p className="font-bold text-slate-900 group-hover:text-teal-700 transition break-all">
                      officialaadhakh@gmail.com
                    </p>
                  </div>
                </a>

                {/* Phone */}
                <a
                  href="tel:+919170230159"
                  className="flex items-start gap-3.5 group p-2 rounded-2xl hover:bg-slate-50 transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition duration-300">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-slate-400">Headquarters Phone</p>
                    <p className="font-bold text-slate-900 group-hover:text-teal-700 transition">
                      +91 91702 30159
                    </p>
                  </div>
                </a>

                {/* Location */}
                <a
                  href="https://maps.app.goo.gl/UnzqY6kZ3i2BRieKA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 group p-2 rounded-2xl hover:bg-slate-50 transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0 group-hover:bg-cyan-600 group-hover:text-white transition duration-300">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-slate-400">Central Node</p>
                    <p className="font-bold text-slate-900 group-hover:text-teal-700 transition">
                      Samad Expo Digital Hub, India
                    </p>
                  </div>
                </a>
              </div>

              {/* Operating Hours */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-500 font-medium">
                <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Typical Response Time: Under 2 Hours (Mon &ndash; Sat)</span>
              </div>
            </div>

            {/* Trust Assurance Card */}
            <div className="athenura-card p-6 space-y-3 bg-gradient-to-br from-teal-950 to-slate-950 text-white border-none shadow-xl">
              <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Enterprise Privacy Commitment</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                All communications and partnership proposals sent to Samad Expo are strictly encrypted and reviewed directly by executive leadership.
              </p>
              <div className="pt-2 flex items-center gap-2 text-[10px] text-teal-400 font-semibold">
                <Award className="w-3.5 h-3.5 text-[#FFF33D]" />
                <span>Startup India Registered Entity</span>
              </div>
            </div>

          </div>

          {/* Right Column: High-Converting Form (Span 7) */}
          <div className="lg:col-span-7">
            <div className="athenura-card p-7 sm:p-10">
              
              <div className="mb-6 space-y-1">
                <h2 className="text-2xl font-black text-slate-950 tracking-tight">
                  Send a Direct Message
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Fill in your details below and our team will get back to you promptly.
                </p>
              </div>

              {submitted && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-3 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Thank you! Your message has been received. Our team will contact you shortly.</span>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold animate-in fade-in">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-bold text-slate-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      id="contact-name"
                      required
                      minLength={2}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-phone" className="block text-xs font-bold text-slate-700 mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      id="contact-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 ..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-company" className="block text-xs font-bold text-slate-700 mb-1.5">
                      Company / Organization
                    </label>
                    <input
                      id="contact-company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Organization name"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Subject / Area of Interest *
                  </label>
                  <input
                    id="contact-subject"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Website Hosting, Custom Development, or Venture Partnership"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Project Details or Inquiry *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    minLength={10}
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your requirements, project scope, or timeline..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-slate-950 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "Sending Inquiry..." : "Submit Message"}</span>
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
