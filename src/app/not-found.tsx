import React from "react";
import Link from "next/link";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";
import { ArrowLeft, Compass, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[82vh] bg-[#060608] samad-hero-grid flex items-center justify-center px-4 py-16 relative overflow-hidden text-white">
      <ThreeHeroCanvas variant="dark" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#FFF33D]/15 blur-[130px]" />

      <div className="max-w-lg w-full relative z-10">
        <Card3D intensity={10}>
          <div className="samad-card text-center space-y-6 p-8 sm:p-10 border-[#FFF33D]/35">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FFF33D] text-black font-black text-2xl shadow-lg shadow-[#FFF33D]/25">
              404
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Page Not Found
              </h1>
              <p className="text-sm text-zinc-400 leading-relaxed">
                The page you requested could not be found. It may have been moved or
                removed from the Samad Expo digital ecosystem.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/"
                className="btn-3d-yellow inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs uppercase tracking-wider"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Homepage
              </Link>
              <Link
                href="/websites"
                className="btn-3d-black inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs uppercase tracking-wider"
              >
                <Compass className="w-4 h-4 text-[#FFF33D]" />
                Explore Ecosystem
              </Link>
              <Link
                href="/ecosystem-search"
                className="btn-3d-black inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs uppercase tracking-wider"
              >
                <Search className="w-4 h-4 text-[#FFF33D]" />
                Search
              </Link>
            </div>
          </div>
        </Card3D>
      </div>
    </div>
  );
}
