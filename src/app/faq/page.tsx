"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";
import { ChevronDown, HelpCircle, Search, ArrowRight } from "lucide-react";

const CORPORATE_FAQS = [
  {
    id: "faq-1",
    category: "About Samad Expo",
    question: "What is Samad Expo?",
    answer:
      "Samad Expo is a modern digital technology platform and central hub founded by Sabir Usmani in Agra, India. It combines multi-user instant website hosting with practical web tools like MDK Chrono Age Calculator and MDK Convertor.",
  },
  {
    id: "faq-2",
    category: "Instant Hosting",
    question: "How does Samad Expo instant website hosting work?",
    answer:
      "Sign in or register through the Hosting Console, upload your static HTML/CSS/JS files or packaged ZIP archive, preview inside an isolated sandbox, and publish a fast live /sites/your-slug URL in seconds.",
  },
  {
    id: "faq-3",
    category: "Live Tools",
    question: "Where can I try the web tools and live websites?",
    answer:
      "You can browse and launch every active application right from the Homepage Live Tools section or the Public Directory (/websites), with instant preview modals and direct launch links.",
  },
  {
    id: "faq-4",
    category: "API & MCP",
    question: "What is the Model Context Protocol (MCP) API?",
    answer:
      "Samad Expo exposes a JSON-RPC 2.0 MCP endpoint (/api/mcp) allowing compatible AI assistants and tools to inspect public ecosystem data and corporate listings.",
  },
  {
    id: "faq-5",
    category: "Security",
    question: "How does Samad Expo protect accounts and hosted sites?",
    answer:
      "The platform enforces server-side authentication, cryptographic password hashing, login rate limiting, security headers (CSP, X-Frame-Options, nosniff), and path traversal protection—verified by 20/20 automated security tests.",
  },
  {
    id: "faq-6",
    category: "Contact & Support",
    question: "How can I reach Samad Expo directly?",
    answer:
      "Email us at officialaadhakh@gmail.com, call +91 94582 04216 (Bodla, Agra), or submit your message via the Contact Us page.",
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
    "Live Tools",
    "API & MCP",
    "Security",
    "Contact & Support",
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
    <div className="bg-[#060608] min-h-screen text-white">
      <section className="samad-hero-grid border-b border-zinc-800/80 pt-10 pb-12 sm:pt-14 sm:pb-14 relative overflow-hidden">
        <ThreeHeroCanvas
          variant="dark"
          className="absolute inset-0 w-full h-full z-0 opacity-75"
        />
        <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-[#FFF33D]/15 blur-[120px]" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-5">
          <nav
            aria-label="Breadcrumb"
            className="text-xs text-zinc-400 flex items-center gap-2"
          >
            <Link href="/" className="hover:text-[#FFF33D] font-semibold transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#FFF33D] font-bold">FAQ</span>
          </nav>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF33D]/10 border border-[#FFF33D]/30 text-[#FFF33D] text-xs font-extrabold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help &amp; Knowledge Base</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Frequently Asked <span className="samad-highlight">Questions</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            Clear answers about Samad Expo website hosting, live digital tools, security, and support.
          </p>

          <div className="pt-2 relative max-w-xl">
            <Search className="w-4 h-4 text-[#FFF33D] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-zinc-900/90 border border-zinc-800 text-sm text-white placeholder:text-zinc-500 focus:border-[#FFF33D] focus:ring-2 focus:ring-[#FFF33D]/25 outline-none transition"
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#FFF33D] text-zinc-950 shadow-[0_0_16px_rgba(255,243,61,0.3)]"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-[#FFF33D]/60 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-[#0B0B0F] py-14 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-3.5">
            {filtered.length === 0 ? (
              <div className="samad-card p-10 text-center space-y-2">
                <p className="text-sm font-bold text-white">
                  No matching questions found.
                </p>
                <p className="text-xs text-zinc-400">
                  Try clearing your search filter.
                </p>
              </div>
            ) : (
              filtered.map((item) => {
                const isOpen = openId === item.id;
                return (
                  <Card3D key={item.id} intensity={3} className="samad-card overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : item.id)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 cursor-pointer"
                    >
                      <div>
                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#FFF33D] mb-1">
                          {item.category}
                        </span>
                        <span className="text-sm sm:text-base font-bold text-white">
                          {item.question}
                        </span>
                      </div>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                          isOpen
                            ? "rotate-180 bg-[#FFF33D] text-zinc-950"
                            : "bg-zinc-900 border border-zinc-800 text-zinc-400"
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/80 pt-4">
                        {item.answer}
                      </div>
                    )}
                  </Card3D>
                );
              })
            )}
          </div>

          <Card3D intensity={4} className="samad-card p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t-4 border-t-[#FFF33D]">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-white">
                Still have questions?
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                Contact Samad Expo directly at officialaadhakh@gmail.com or +91 94582 04216.
              </p>
            </div>

            <Link
              href="/contact"
              className="btn-3d-yellow inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider shrink-0"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Card3D>
        </div>
      </div>
    </div>
  );
}
