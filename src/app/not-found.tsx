import React from "react";
import Link from "next/link";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";
import { ArrowLeft, Compass, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[82vh] bg-[#0B0A0C] samad-hero-grid flex items-center justify-center px-4 py-16 relative overflow-hidden text-white">
      <ThreeHeroCanvas variant="dark" className="opacity-75" />

      <div className="max-w-lg w-full relative z-10">
        <Card3D intensity={6}>
          <div className="samad-card-dark text-center space-y-6 p-10 border-[#C8A464]/45">
            <div className="font-editorial-serif italic text-5xl text-[#C8A464]">
              404
            </div>
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-[0.2em] text-white">
                Page Not Found
              </h1>
              <p className="font-editorial-serif italic text-base text-zinc-400 leading-relaxed">
                The requested destination could not be located within the Samad Expo digital maison.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/"
                className="btn-maison-light inline-flex items-center gap-2 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Return Home
              </Link>
              <Link
                href="/websites"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#C10016] hover:bg-[#9E0012] text-white text-[10px] font-bold uppercase tracking-[0.2em] transition"
              >
                <Compass className="w-3.5 h-3.5" />
                Catalogue
              </Link>
              <Link
                href="/ecosystem-search"
                className="inline-flex items-center gap-2 px-5 py-3 border border-white/25 hover:border-[#C8A464] text-zinc-200 text-[10px] font-bold uppercase tracking-[0.2em] transition"
              >
                <Search className="w-3.5 h-3.5" />
                Search
              </Link>
            </div>
          </div>
        </Card3D>
      </div>
    </div>
  );
}
