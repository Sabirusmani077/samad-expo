"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";
import { ChevronDown, Search } from "lucide-react";

const CORPORATE_FAQS = [
  {
    id: "faq-1",
    category: "About Samad Expo",
    question: "What is Samad Expo?",
    answer:
      "Samad Expo is a modern digital technology house and central web platform operating from Agra, India. It combines multi-user instant website hosting with browser-native utilities like MDK Chrono Age Calculator and MDK Convertor.",
  },
  {
    id: "faq-2",
    category: "Instant Hosting",
    question: "How does instant static website hosting work?",
    answer:
      "Sign in or create an account via the Hosting Console, upload static HTML/CSS/JS or a packaged ZIP archive, preview inside an isolated multi-device sandbox, and publish a clean public /sites/your-slug link in seconds.",
  },
  {
    id: "faq-3",
    category: "Live Tools",
    question: "Where can I launch live web applications?",
    answer:
      "Browse and launch every active application from the Homepage Catalogue or Public Directory (/websites), featuring live interactive sandbox inspection before opening.",
  },
  {
    id: "faq-4",
    category: "API & MCP",
    question: "What is the Model Context Protocol (MCP) API?",
    answer:
      "Samad Expo exposes a JSON-RPC 2.0 MCP endpoint (/api/mcp) allowing compatible AI agents and workflows to discover public ecosystem creations safely.",
  },
  {
    id: "faq-5",
    category: "Security",
    question: "How are accounts and deployments protected?",
    answer:
      "The platform enforces server-side authorization checks, PBKDF2 cryptographic password hashing, login rate limiting, hardened HTTP security headers (CSP, X-Frame-Options, nosniff), and path traversal validation.",
  },
  {
    id: "faq-6",
    category: "Contact & Support",
    question: "How can I connect with Client Care directly?",
    answer:
      "Email officialaadhakh@gmail.com, call +91 94582 04216 (Bodla, Agra), or submit a consultation message via Contact Advisor.",
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
    <div className="bg-white min-h-screen text-[#1D1C1C]">
      <section className="samad-hero-grid border-b border-[#C8A464]/25 pt-14 pb-16 relative overflow-hidden text-white">
        <ThreeHeroCanvas variant="dark" className="opacity-80" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0A0C] via-[#0B0A0C]/40 to-transparent z-[1]" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-5">
          <nav
            aria-label="Breadcrumb"
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2"
          >
            <Link href="/" className="hover:text-[#C8A464] transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#C8A464]">FAQ</span>
          </nav>

          <div className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#C8A464]">
            Client Knowledge Base
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-[0.14em] text-white leading-tight">
            Frequently Asked{" "}
            <span className="samad-highlight !text-[#E5C78E]">Questions</span>
          </h1>

          <p className="font-editorial-serif italic text-base sm:text-xl text-zinc-300 leading-relaxed">
            Clear answers on website hosting, curated utilities, platform security, and support.
          </p>

          <div className="pt-2 relative max-w-xl">
            <Search className="w-4 h-4 text-[#C8A464] absolute left-1 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter questions..."
              className="w-full pl-7 pr-4 py-2.5 bg-transparent border-b border-white/40 font-editorial-serif italic text-base text-white placeholder:text-zinc-500 focus:border-[#C8A464] outline-none transition"
            />
          </div>

          <div className="flex flex-wrap gap-5 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`pb-1 text-[10px] font-bold uppercase tracking-[0.18em] border-b transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "text-[#C8A464] border-[#C8A464]"
                    : "text-zinc-400 border-transparent hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-[#FAF7F2] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="samad-card p-10 text-center space-y-2">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1D1C1C]">
                  No matching questions found
                </p>
                <p className="font-editorial-serif italic text-sm text-[#595959]">
                  Clear your filter query to browse all answers.
                </p>
              </div>
            ) : (
              filtered.map((item) => {
                const isOpen = openId === item.id;
                return (
                  <Card3D key={item.id} intensity={3}>
                    <div className="samad-card overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenId(isOpen ? null : item.id)}
                        className="w-full px-7 py-6 flex items-center justify-between text-left gap-4 cursor-pointer"
                      >
                        <div>
                          <span className="block text-[9px] font-bold uppercase tracking-[0.24em] text-[#C10016] mb-1">
                            {item.category}
                          </span>
                          <span className="text-sm sm:text-base font-bold uppercase tracking-[0.1em] text-[#1D1C1C]">
                            {item.question}
                          </span>
                        </div>
                        <div
                          className={`w-8 h-8 border flex items-center justify-center shrink-0 transition-all duration-200 ${
                            isOpen
                              ? "rotate-180 bg-[#1D1C1C] border-[#1D1C1C] text-white"
                              : "bg-white border-[#E5DFD7] text-[#595959]"
                          }`}
                        >
                          <ChevronDown className="w-4 h-4 stroke-[1.5]" />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-7 pb-7 font-editorial-serif text-base text-[#595959] leading-relaxed border-t border-[#E5DFD7] pt-5">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  </Card3D>
                );
              })
            )}
          </div>

          <Card3D intensity={4}>
            <div className="samad-card p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t-2 border-t-[#C10016]">
              <div className="space-y-1">
                <h2 className="text-base font-bold uppercase tracking-[0.18em] text-[#1D1C1C]">
                  Require Further Assistance?
                </h2>
                <p className="font-editorial-serif italic text-sm text-[#595959]">
                  Contact Client Care directly at officialaadhakh@gmail.com or +91 94582 04216.
                </p>
              </div>

              <Link
                href="/contact"
                className="btn-3d-yellow px-7 py-3 text-[11px] font-bold uppercase tracking-[0.2em] shrink-0"
              >
                Contact Advisor
              </Link>
            </div>
          </Card3D>
        </div>
      </div>
    </div>
  );
}
