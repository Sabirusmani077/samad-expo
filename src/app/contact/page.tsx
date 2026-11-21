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
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-slate-500 flex items-center gap-2"
        >
          <Link href="/" className="hover:text-slate-900 font-medium">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">Contact Us</span>
        </nav>

        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-sm space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-[#FFF33D]/25 text-black border border-black/10 font-bold text-[11px] uppercase tracking-wider border border-zinc-200">
            Corporate &amp; Partnership Inquiries
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Connect with Samad Expo
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            Reach out for business partnerships, digital platform collaborations, corporate services, or general inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-5 shadow-sm">
              <h2 className="text-lg font-black text-slate-950">Direct Contact Details</h2>
              <div className="space-y-4 text-sm text-slate-700">
                <a
                  href="mailto:sabirusmani159@gmail.com"
                  className="flex items-start gap-3 hover:text-black hover:underline transition-colors"
                >
                  <Mail className="w-5 h-5 text-black mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-900">Email</p>
                    <p className="text-slate-600">sabirusmani159@gmail.com</p>
                  </div>
                </a>

                <a
                  href="tel:+919458204216"
                  className="flex items-start gap-3 hover:text-black hover:underline transition-colors"
                >
                  <Phone className="w-5 h-5 text-black mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-900">Phone</p>
                    <p className="text-slate-600">+91 94582 04216</p>
                  </div>
                </a>

                <a
                  href="https://maps.app.goo.gl/UnzqY6kZ3i2BRieKA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 hover:text-black hover:underline transition-colors group"
                >
                  <MapPin className="w-5 h-5 text-black mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-bold text-slate-900 group-hover:text-black hover:underline transition-colors">Headquarters &amp; Business Address</p>
                    <p className="text-slate-600">Bodla, Agra, Uttar Pradesh 282010, India</p>
                    <span className="text-xs text-black font-semibold inline-flex items-center gap-1 mt-0.5">
                      View on Google Maps ↗
                    </span>
                  </div>
                </a>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-black mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-900">Response Hours</p>
                    <p className="text-slate-600">Monday – Saturday, 10:00 AM – 6:30 PM IST</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-950">Send a Message</h2>
                <p className="text-xs text-slate-600 mt-1">
                  Your message is delivered directly to the Samad Expo corporate desk.
                </p>
              </div>

              {submitted && (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3 text-emerald-900">
                  <CheckCircle2 className="w-5 h-5 text-black shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold">Inquiry Submitted Successfully</p>
                    <p>Thank you for reaching out to Samad Expo. Our team will review your message and respond shortly.</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-xs font-bold text-red-900">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-bold text-slate-800 mb-1">
                      Full Name *
                    </label>
                    <input
                      id="contact-name"
                      required
                      minLength={2}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:border-black focus:ring-2 focus:ring-[#FFF33D] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-bold text-slate-800 mb-1">
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:border-black focus:ring-2 focus:ring-[#FFF33D] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-phone" className="block text-xs font-bold text-slate-800 mb-1">
                      Phone Number
                    </label>
                    <input
                      id="contact-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 ..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:border-black focus:ring-2 focus:ring-[#FFF33D] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-company" className="block text-xs font-bold text-slate-800 mb-1">
                      Company / Organization
                    </label>
                    <input
                      id="contact-company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Organization name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:border-black focus:ring-2 focus:ring-[#FFF33D] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-bold text-slate-800 mb-1">
                    Subject *
                  </label>
                  <input
                    id="contact-subject"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Partnership, Platform Inquiry, or Services"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:border-black focus:ring-2 focus:ring-[#FFF33D] focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-bold text-slate-800 mb-1">
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    minLength={10}
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your project, partnership idea, or inquiry..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:border-black focus:ring-2 focus:ring-[#FFF33D] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FFF33D] hover:bg-black hover:text-[#FFF33D] text-black font-extrabold text-sm border border-black/15 transition-colors disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "Submitting..." : "Send Message"}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
