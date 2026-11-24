import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { Briefcase, CheckCircle2, ArrowRight, Sparkles, Zap, ShieldCheck, Globe, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Corporate Services & Solutions | Samad Expo",
  description:
    "Explore professional services, digital infrastructure, and technology solutions provided by Samad Expo and its operating divisions.",
};

export default function CorporateServicesPage() {
  const db = readDb();
  const services = (db.corporateServices || []).filter((s) => s.status !== "inactive");

  // Group by category
  const categories = Array.from(new Set(services.map((s) => s.category || "General Solutions")));

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-900">
      
      {/* Athenura Obsidian Hero */}
      <section className="bg-[#040D12] text-white pt-14 pb-20 sm:pt-20 sm:pb-24 border-b border-teal-900/30 relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-teal-500/10 blur-[140px]" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <nav aria-label="Breadcrumb" className="text-xs text-zinc-400 flex items-center gap-2">
            <Link href="/" className="hover:text-teal-400 transition">Home</Link>
            <span>/</span>
            <span className="text-white font-bold">Services &amp; Capabilities</span>
          </nav>

          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-teal-500/30 bg-teal-950/50 text-xs font-bold text-teal-300">
              <Zap className="w-3.5 h-3.5 text-teal-400" />
              <span>Enterprise Engineering &amp; Solutions</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-tight">
              Professional Services &amp; <span className="text-gradient-teal">Solutions.</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
              Samad Expo delivers multi-user instant website hosting, custom Next.js &amp; React application development, Model Context Protocol APIs, and enterprise cloud edge infrastructure.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-slate-950 hover:bg-teal-50 font-bold text-xs uppercase tracking-wider transition shadow-lg hover:scale-105 active:scale-95"
              >
                <span>Request Consultation</span>
                <ArrowRight className="w-4 h-4 text-teal-700" />
              </Link>

              <Link
                href="/websites"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition"
              >
                <Globe className="w-4 h-4 text-teal-400" />
                <span>Browse Live Tools</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Services Categories */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
        {services.length === 0 ? (
          <div className="athenura-card p-12 text-center text-slate-500">
            Corporate services offerings are currently being updated. Inquire directly for custom business solutions.
          </div>
        ) : (
          <div className="space-y-16">
            {categories.map((cat) => {
              const catServices = services.filter((s) => (s.category || "General Solutions") === cat);
              return (
                <div key={cat} className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-200/80 pb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                    <h2 className="text-2xl font-black text-slate-950 tracking-tight">{cat}</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {catServices.map((service, idx) => (
                      <div
                        key={service.id}
                        className="athenura-card p-7 sm:p-8 flex flex-col justify-between group"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100 group-hover:bg-[#20A9BB] group-hover:text-white transition duration-300">
                              <Sparkles className="w-5 h-5" />
                            </div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {service.status.replace("_", " ")}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold text-slate-950 group-hover:text-teal-700 transition">
                            {service.name}
                          </h3>

                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {service.description || service.shortDescription}
                          </p>

                          {service.features && service.features.length > 0 && (
                            <div className="pt-2 space-y-2">
                              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                                Deliverables &amp; Features:
                              </span>
                              <div className="space-y-1.5">
                                {service.features.map((feat, fidx) => (
                                  <div key={fidx} className="flex items-start gap-2 text-xs text-slate-700">
                                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                                    <span>{feat}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs">
                          <Link
                            href="/contact"
                            className="inline-flex items-center gap-1 font-bold text-teal-700 hover:text-teal-900 transition"
                          >
                            <span>Request Consultation</span>
                            <ChevronRight className="w-4 h-4" />
                          </Link>

                          <span className="text-[11px] font-medium text-slate-400">
                            Enterprise Ready
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Strategic CTA Banner */}
        <section className="athenura-card p-8 sm:p-14 text-center space-y-6 bg-gradient-to-br from-slate-900 to-teal-950 text-white border-none shadow-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-teal-400" />
            <span>Tailored Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Need a Bespoke Digital Platform?
          </h2>

          <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            From launching customized SaaS products to architecting high-traffic hosting infrastructure and autonomous AI protocols, our team is ready to build with you.
          </p>

          <div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-slate-950 hover:bg-teal-50 font-bold text-xs uppercase tracking-wider transition shadow-lg hover:scale-105 active:scale-95"
            >
              <span>Initiate Business Discussion</span>
              <ArrowRight className="w-4 h-4 text-teal-700" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
