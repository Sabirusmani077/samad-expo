import React from "react";
import Link from "next/link";
import { ArrowLeft, Compass, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-6 p-8 rounded-3xl border border-slate-200 bg-white shadow-xl">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FFF33D] text-black font-black text-2xl border border-black/15">
          404
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            The page you requested could not be found. It may have been moved or
            removed from the Samad Expo digital ecosystem.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FFF33D] hover:bg-black hover:text-[#FFF33D] text-black font-extrabold text-sm border border-black/15 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Homepage
          </Link>
          <Link
            href="/websites"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm border border-slate-300 transition-colors"
          >
            <Compass className="w-4 h-4" />
            Explore Ecosystem
          </Link>
          <Link
            href="/ecosystem-search"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm border border-slate-300 transition-colors"
          >
            <Search className="w-4 h-4" />
            Search Ecosystem
          </Link>
        </div>
      </div>
    </div>
  );
}
