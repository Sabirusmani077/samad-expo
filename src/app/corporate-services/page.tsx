import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { Briefcase, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

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
  const categories = Array.from(new Set(services.map((s) => s.category || "General Services")));

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-slate-900 font-medium">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">Services & Solutions</span>
        </nav>

        {/* Hero */}
        <section className="rounded-3xl border-2 border-slate-900 bg-white p-8 sm:p-12 shadow-[8px_8px_0px_#FFF33D] space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FFF33D] text-black font-extrabold font-extrabold text-xs uppercase tracking-wider border border-slate-900/20">
            <Briefcase className="w-3.5 h-3.5" />
            Corporate Capabilities
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 leading-tight max-w-3xl">
            Professional Services & Technology Solutions
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            Samad Expo provides multi-user website hosting, instant static deployments, responsive web applications, and custom full-stack web engineering.
          </p>
        </section>

        {services.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 p-12 text-center text-slate-500 bg-slate-50">
            Corporate services offerings are currently being updated. Inquire directly for custom business solutions.
          </div>
        ) : (
          <div className="space-y-12">
            {categories.map((cat) => {
              const catServices = services.filter((s) => (s.category || "General Services") === cat);
              return (
                <div key={cat} className="space-y-6">
                  <div className="border-b border-slate-200 pb-2">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950">{cat}</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {catServices.map((service) => (
                      <div
                        key={service.id}
                        className="rounded-2xl border-2 border-slate-200 p-6 bg-white hover:border-slate-900 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-[#FFF33D] flex items-center justify-center text-slate-950">
                              <Sparkles className="w-5 h-5" />
                            </div>
                            <span
                              className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                                service.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-zinc-100 text-zinc-900 border border-zinc-300"
                              }`}
                            >
                              {service.status.replace("_", " ").toUpperCase()}
                            </span>
                          </div>

                          <h3 className="text-lg font-black text-slate-950">{service.name}</h3>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {service.description || service.shortDescription}
                          </p>

                          {service.features && service.features.length > 0 && (
                            <div className="pt-3 space-y-1.5">
                              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                                Deliverables & Features:
                              </span>
                              {service.features.map((feat, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                                  <CheckCircle2 className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                                  <span>{feat}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="pt-6 mt-4 border-t border-slate-100">
                          <Link
                            href="/contact"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-black hover:underline transition-colors"
                          >
                            <span>Request Consultation</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <section className="rounded-3xl bg-slate-950 text-white p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black">Need a Custom Digital Solution?</h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            From launching customized digital products to architecting bespoke web platforms and APIs,
            our technical leadership is ready to partner with you.
          </p>
          <div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#FFF33D] text-black font-extrabold font-black text-xs uppercase tracking-wider hover:bg-black hover:text-[#FFF33D] transition-colors"
            >
              <span>Initiate Business Discussion</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
