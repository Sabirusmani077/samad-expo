"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, Search } from "lucide-react";

const CORPORATE_FAQS = [
  {
    id: "faq-1",
    category: "About Samad Expo",
    question: "What is Samad Expo?",
    answer:
      "Samad Expo is the parent corporate brand and central digital headquarters behind our independent websites, web applications, business divisions, and professional technology platforms.",
  },
  {
    id: "faq-2",
    category: "Digital Ecosystem",
    question: "How do individual websites operate under Samad Expo?",
    answer:
      "Each website and web application maintains its own dedicated identity, purpose, and user experience while being backed by Samad Expo' corporate vision, engineering, and governance.",
  },
  {
    id: "faq-3",
    category: "Digital Ecosystem",
    question: "Where can I explore all live websites and projects?",
    answer:
      "You can browse every active and upcoming platform in our Digital Ecosystem directory under the Websites tab, complete with live links, feature summaries, and division details.",
  },
  {
    id: "faq-4",
    category: "Services & Partnerships",
    question: "How can I collaborate or partner with Samad Expo?",
    answer:
      "Visit our Partnerships or Contact page and submit your project brief or collaboration proposal. Our leadership desk reviews all business inquiries directly.",
  },
  {
    id: "faq-5",
    category: "Services & Partnerships",
    question: "What professional services does Samad Expo offer?",
    answer:
      "Through our business divisions, we deliver platform engineering, modern web applications, digital brand strategy, and scalable cloud systems.",
  },
  {
    id: "faq-6",
    category: "Careers & Support",
    question: "How can I reach Samad Expo directly?",
    answer:
      "You can email us at sabirusmani159@gmail.com, call +91 94582 04216, or submit an inquiry via the Contact page.",
  },
];

export default function FAQPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openId, setOpenId] = useState<string | null>(CORPORATE_FAQS[0].id);

  const categories = [
    "All",
    "About Samad Expo",
    "Digital Ecosystem",
    "Services & Partnerships",
    "Careers & Support",
  ];

  const filtered = CORPORATE_FAQS.filter((f) => {
    const matchesCat =
      selectedCategory === "All" || f.category === selectedCategory;
    const matchesQuery =
      !query.trim() ||
      f.question.toLowerCase().includes(query.toLowerCase()) ||
      f.answer.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-slate-500 flex items-center gap-2"
        >
          <Link href="/" className="hover:text-slate-900 font-medium">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">
            Frequently Asked Questions
          </span>
        </nav>

        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF33D]/25 text-black font-extrabold text-[11px] uppercase border border-black/15">
            <HelpCircle className="w-3.5 h-3.5" /> Corporate Knowledge Base
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-950">
            Frequently Asked Questions
          </h1>
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions about Samad Expo, platforms, or partnerships..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:border-black focus:ring-2 focus:ring-[#FFF33D] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  selectedCategory === cat
                    ? "bg-[#FFF33D] text-black"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left gap-4"
                >
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-black mb-0.5">
                      {item.category}
                    </span>
                    <span className="text-sm font-bold text-slate-950">
                      {item.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-black text-slate-950">Still have questions?</h2>
            <p className="text-xs text-slate-600 mt-1">
              Get in touch with the Samad Expo corporate desk directly.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-xl bg-[#FFF33D] hover:bg-black hover:text-[#FFF33D] text-black text-xs font-extrabold border border-black/15 transition-colors"
          >
            Contact Us →
          </Link>
        </div>
      </div>
    </div>
  );
}
