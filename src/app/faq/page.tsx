"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, Search, Sparkles, MessageSquare, ArrowRight, ShieldCheck, Mail } from "lucide-react";

const CORPORATE_FAQS = [
  {
    id: "faq-1",
    category: "About Samad Expo",
    question: "What is Samad Expo?",
    answer:
      "Samad Expo is the parent corporate brand and central digital headquarters operating our independent websites, web applications, instant edge hosting services, and technology platforms.",
  },
  {
    id: "faq-2",
    category: "Instant Hosting",
    question: "How does Samad Expo instant website hosting work?",
    answer:
      "Our edge platform lets developers and creators upload static HTML, CSS, JavaScript, or packaged zip archives. Our automated build engine unpacks, configures HTTPS, provisions edge routing, and issues a live global URL in under 3 seconds.",
  },
  {
    id: "faq-3",
    category: "Web Ecosystem",
    question: "Where can I explore all live websites and tools?",
    answer:
      "You can browse every active and upcoming platform in our Public Directory under the Projects & Tools tab, complete with live preview iframes, launch links, and technical specifications.",
  },
  {
    id: "faq-4",
    category: "Services & APIs",
    question: "What is the Model Context Protocol (MCP) API in Samad Expo?",
    answer:
      "Samad Expo features a full JSON-RPC 2.0 MCP endpoint (/api/mcp) that enables AI assistants and autonomous agents to query our corporate database, inspect live hosted websites, and interact with our ecosystem programmatically.",
  },
  {
    id: "faq-5",
    category: "Security & Auth",
    question: "What cybersecurity and data protection measures are implemented?",
    answer:
      "Samad Expo has undergone a rigorous 20/20 cyber audit. It enforces OWASP Top 10 defenses, token-bucket rate limiting, CSRF verification, cryptographic password hashing, strict HTTP security headers, and edge isolation for hosted user code.",
  },
  {
    id: "faq-6",
    category: "Partnerships & Support",
    question: "How can I collaborate or partner with Samad Expo?",
    answer:
      "Visit our Contact page or reach out directly to executive leadership at officialaadhakh@gmail.com. We collaborate on enterprise web applications, venture incubation, and cloud infrastructure.",
  },
];

export default function FAQPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openId, setOpenId] = useState<string | null>(CORPORATE_FAQS[0].id);

  const categories = [
    "All",
    "About Samad Expo",
    "Instant Hosting",
    "Web Ecosystem",
    "Services & APIs",
    "Security & Auth",
    "Partnerships & Support",
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
    <div className="bg-[#F8FAFC] min-h-screen py-14 sm:py-20 text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-slate-500 flex items-center gap-2"
        >
          <Link href="/" className="hover:text-teal-700 font-semibold transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">Frequently Asked Questions</span>
        </nav>

        {/* Athenura Editorial Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-50 text-teal-800 text-xs font-bold uppercase tracking-wider border border-cyan-100">
            <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
            <span>Corporate Knowledge Base</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-tight">
            Frequently Asked <span className="text-gradient-teal">Questions.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Find answers to common questions about our digital ecosystem, instant hosting architecture, MCP AI API, and corporate ventures.
          </p>

          {/* Instant Search Bar */}
          <div className="pt-2 relative max-w-xl">
            <Search className="w-4 h-4 text-teal-600 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by keyword, hosting feature, or API..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 shadow-xs outline-none transition"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#20A9BB] text-white shadow-xs font-black"
                    : "bg-white border border-slate-200 text-slate-600 hover:text-teal-800 hover:border-teal-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Athenura Accordion List */}
        <div className="space-y-3.5">
          {filtered.length === 0 ? (
            <div className="athenura-card p-10 text-center space-y-2">
              <p className="text-sm font-bold text-slate-700">No matching questions found.</p>
              <p className="text-xs text-slate-500">Try adjusting your search query or select another category.</p>
            </div>
          ) : (
            filtered.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className="athenura-card overflow-hidden transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 cursor-pointer"
                  >
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-teal-600 mb-1">
                        {item.category}
                      </span>
                      <span className="text-sm sm:text-base font-bold text-slate-950">
                        {item.question}
                      </span>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 bg-teal-50 text-teal-700" : "bg-slate-100 text-slate-500"}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 animate-in fade-in duration-200">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Contact Help Card */}
        <div className="athenura-card p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-gradient-to-br from-slate-900 to-teal-950 text-white border-none shadow-xl">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Still have questions?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300">
              Reach out directly to executive leadership at officialaadhakh@gmail.com
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-slate-950 hover:bg-teal-50 text-xs font-bold uppercase tracking-wider transition shadow-md hover:scale-105 active:scale-95 shrink-0"
          >
            <span>Contact Headquarters</span>
            <ArrowRight className="w-4 h-4 text-teal-700" />
          </Link>
        </div>

      </div>
    </div>
  );
}
