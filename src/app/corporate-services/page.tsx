import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";
import { CheckCircle2, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Services & Capabilities | Samad Expo",
  description:
    "Multi-user website hosting, full-stack web engineering, and custom software solutions provided by Samad Expo.",
};

export default function CorporateServicesPage() {
  const db = readDb();
  const services = (db.corporateServices || []).filter(
    (s) => s.status !== "inactive"
  );

  const categories = Array.from(
    new Set(services.map((s) => s.category || "General Solutions"))
  );

  return (
    <div className="bg-white min-h-screen text-[#1D1C1C]">
      {/* Cartier Nocturnal Header */}
      <section className="samad-hero-grid border-b border-[#C8A464]/25 pt-14 pb-16 sm:pt-20 sm:pb-24 relative overflow-hidden text-white">
        <ThreeHeroCanvas variant="dark" className="opacity-80" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0A0C] via-[#0B0A0C]/40 to-transparent z-[1]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <nav
            aria-label="Breadcrumb"
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2"
          >
            <Link href="/" className="hover:text-[#C8A464] transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#C8A464]">Services &amp; Capabilities</span>
          </nav>

          <div className="space-y-4 max-w-3xl">
            <div className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#C8A464]">
              Engineering Atelier &amp; Hosting
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-[0.14em] leading-tight text-white">
              Maison <span className="samad-highlight !text-[#E5C78E]">Services</span>
            </h1>

            <p className="font-editorial-serif italic text-base sm:text-xl text-zinc-300 leading-relaxed">
              Multi-user instant website hosting, bespoke Next.js architecture, and browser-native web utilities.
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-5">
              <Link
                href="/contact"
                className="btn-maison-light px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.22em]"
              >
                Request Consultation
              </Link>

              <Link
                href="/websites"
                className="font-editorial-serif italic text-base text-[#E5C78E] border-b border-[#C8A464]/50 hover:border-white hover:text-white pb-0.5 transition"
              >
                Browse Live Creations
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Services Body */}
      <div className="bg-[#FAF7F2] py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {services.length === 0 ? (
            <div className="samad-card p-12 text-center font-editorial-serif italic text-[#595959]">
              Service offerings are being updated. Please contact our Agra engineering desk directly.
            </div>
          ) : (
            <div className="space-y-14">
              {categories.map((cat) => {
                const catServices = services.filter(
                  (s) => (s.category || "General Solutions") === cat
                );
                return (
                  <div key={cat} className="space-y-8">
                    <div className="flex items-center gap-3 border-b border-[#E5DFD7] pb-3">
                      <span className="w-2 h-2 bg-[#C10016]" />
                      <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-[#1D1C1C]">
                        {cat}
                      </h2>
                    </div>

                    <div
                      className={`grid ${
                        catServices.length === 1
                          ? "grid-cols-1 max-w-2xl"
                          : "grid-cols-1 md:grid-cols-2"
                      } gap-8`}
                    >
                      {catServices.map((service) => (
                        <Card3D key={service.id} intensity={5}>
                          <div className="samad-card p-8 sm:p-10 flex flex-col justify-between h-full border-t-2 border-t-[#C10016]">
                            <div className="space-y-5">
                              <div className="flex items-center justify-between">
                                <div className="w-11 h-11 border border-[#C8A464] bg-white text-[#1D1C1C] flex items-center justify-center">
                                  <Sparkles className="w-5 h-5 stroke-[1.5]" />
                                </div>
                                <span className="px-3 py-1 text-[9px] font-bold uppercase tracking-[0.22em] border border-[#C8A464]/50 text-[#C10016] bg-white">
                                  {service.status.replace("_", " ")}
                                </span>
                              </div>

                              <h3 className="text-base sm:text-lg font-bold uppercase tracking-[0.14em] text-[#1D1C1C]">
                                {service.name}
                              </h3>

                              <p className="font-editorial-serif text-base text-[#595959] leading-relaxed">
                                {service.description || service.shortDescription}
                              </p>

                              {service.features && service.features.length > 0 && (
                                <div className="pt-2 space-y-2.5">
                                  <span className="text-[10px] font-bold text-[#767676] uppercase tracking-[0.2em] block">
                                    Deliverables
                                  </span>
                                  <div className="space-y-2">
                                    {service.features.map((feat, fidx) => (
                                      <div
                                        key={fidx}
                                        className="flex items-start gap-2.5 font-editorial-serif text-sm text-[#1D1C1C]"
                                      >
                                        <CheckCircle2 className="w-4 h-4 text-[#C10016] shrink-0 mt-0.5 stroke-[1.5]" />
                                        <span>{feat}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="pt-6 mt-6 border-t border-[#E5DFD7]">
                              <Link
                                href="/contact"
                                className="font-editorial-serif italic text-base text-[#1D1C1C] border-b border-[#1D1C1C] hover:text-[#C10016] hover:border-[#C10016] pb-0.5 transition"
                              >
                                Request Consultation
                              </Link>
                            </div>
                          </div>
                        </Card3D>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Nocturnal Bottom CTA */}
          <section className="samad-card-dark p-10 sm:p-14 text-center space-y-5 border-[#C8A464]/35">
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-[0.18em] text-white">
              Commission a <span className="samad-highlight !text-[#E5C78E]">Custom Build</span>
            </h2>
            <p className="font-editorial-serif italic text-base text-zinc-300 max-w-2xl mx-auto">
              From static web hosting to custom Next.js engineering and cloud APIs, connect with our technical desk.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="btn-maison-light inline-block px-9 py-3.5 text-[11px] font-bold uppercase tracking-[0.22em]"
              >
                Speak With an Advisor
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
