import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  ChevronRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Corporate Services & Solutions | Samad Expo",
  description:
    "Explore multi-user website hosting, full-stack web engineering, and custom software solutions provided by Samad Expo.",
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
    <div className="bg-[#060608] min-h-screen text-white">
      {/* 3D Yellow & Black Hero */}
      <section className="samad-hero-grid border-b border-zinc-800/80 pt-10 pb-14 sm:pt-16 sm:pb-20 relative overflow-hidden">
        <ThreeHeroCanvas variant="dark" />
        <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-[#FFF33D]/15 blur-[120px]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <nav
            aria-label="Breadcrumb"
            className="text-xs text-zinc-400 flex items-center gap-2"
          >
            <Link href="/" className="hover:text-[#FFF33D] font-semibold transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#FFF33D] font-bold">
              Services &amp; Capabilities
            </span>
          </nav>

          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF33D]/10 border border-[#FFF33D]/30 text-xs font-bold text-[#FFF33D]">
              <Zap className="w-3.5 h-3.5" />
              <span>Enterprise Engineering &amp; Hosting</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              Professional Services &amp;{" "}
              <span className="samad-highlight">Solutions</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Samad Expo provides multi-user instant website hosting, responsive Next.js &amp; React web applications, and practical utility software.
            </p>

            <div className="pt-2 flex flex-wrap gap-3.5">
              <Link
                href="/contact"
                className="btn-3d-yellow inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-wider"
              >
                <span>Request Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/websites"
                className="btn-3d-black inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-wider"
              >
                <Globe className="w-4 h-4 text-[#FFF33D]" />
                <span>Browse Live Tools</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-[#0B0B0F] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {services.length === 0 ? (
            <div className="samad-card p-12 text-center text-zinc-400">
              Corporate services offerings are currently being updated. Contact us directly for custom software requirements.
            </div>
          ) : (
            <div className="space-y-12">
              {categories.map((cat) => {
                const catServices = services.filter(
                  (s) => (s.category || "General Solutions") === cat
                );
                return (
                  <div key={cat} className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFF33D] shadow-[0_0_10px_rgba(255,243,61,0.6)]" />
                      <h2 className="text-2xl font-black text-white tracking-tight">
                        {cat}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {catServices.map((service) => (
                        <Card3D key={service.id} intensity={9}>
                          <div className="samad-card p-7 sm:p-8 flex flex-col justify-between group h-full">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="w-11 h-11 rounded-2xl bg-[#FFF33D] text-black flex items-center justify-center shadow-md shadow-[#FFF33D]/20">
                                  <Sparkles className="w-5 h-5" />
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FFF33D]/10 text-[#FFF33D] border border-[#FFF33D]/30">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFF33D]" />
                                  {service.status.replace("_", " ")}
                                </span>
                              </div>

                              <h3 className="text-xl font-extrabold text-white">
                                {service.name}
                              </h3>

                              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                                {service.description || service.shortDescription}
                              </p>

                              {service.features && service.features.length > 0 && (
                                <div className="pt-2 space-y-2">
                                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                                    Deliverables &amp; Features:
                                  </span>
                                  <div className="space-y-1.5">
                                    {service.features.map((feat, fidx) => (
                                      <div
                                        key={fidx}
                                        className="flex items-start gap-2 text-xs text-zinc-200 font-medium"
                                      >
                                        <CheckCircle2 className="w-4 h-4 text-[#FFF33D] shrink-0 mt-0.5" />
                                        <span>{feat}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="pt-6 mt-6 border-t border-zinc-800 flex items-center justify-between text-xs">
                              <Link
                                href="/contact"
                                className="inline-flex items-center gap-1 font-extrabold text-[#FFF33D] hover:text-white transition"
                              >
                                <span>Request Consultation</span>
                                <ChevronRight className="w-4 h-4" />
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

          {/* Bottom CTA */}
          <Card3D intensity={5}>
            <section className="samad-card p-8 sm:p-12 text-center space-y-5 border-[#FFF33D]/35">
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Need a Custom <span className="text-[#FFF33D]">Web Platform?</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                From static web hosting to custom Next.js applications and digital tools, let us help bring your product online.
              </p>
              <div>
                <Link
                  href="/contact"
                  className="btn-3d-yellow inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs uppercase tracking-wider"
                >
                  <span>Start Discussion</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </Card3D>
        </div>
      </div>
    </div>
  );
}
