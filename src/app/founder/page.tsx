import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";
import {
  Sparkles,
  Mail,
  Linkedin,
  Twitter,
  Quote,
  MapPin,
  ArrowRight,
  Phone,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Founder & Leadership | Samad Expo",
  description:
    "Meet Sabir Usmani, founder of Samad Expo. Read the founder's message, engineering philosophy, and vision.",
};

export default function FounderPage() {
  const db = readDb();
  const profile = db.companyProfile;
  const founderMember = db.teamMembers?.find(
    (m) => m.isFounder && m.isActive !== false
  );
  const leadership = (db.teamMembers || []).filter(
    (m) => !m.isFounder && m.isActive !== false
  );

  const founderName =
    founderMember?.name || profile?.founderName || "Sabir Usmani";
  const founderTitle =
    founderMember?.designation || profile?.founderDesignation || "Founder & Owner";
  const founderPhoto =
    founderMember?.photo || profile?.founderPhoto || "/images/founder-portrait.jpg";
  const founderBio =
    founderMember?.bio ||
    profile?.founderBio ||
    "Entrepreneur and systems architect behind Samad Expo.";
  const founderBackground = founderMember?.professionalBackground || "";
  const founderPhilosophy = founderMember?.leadershipPhilosophy || "";
  const founderMessage =
    founderMember?.founderMessage ||
    profile?.founderMessage ||
    "Welcome to Samad Expo. Our journey began with a fundamental belief: great digital platforms are built on robust architecture, continuous technological innovation, and exceptional user value.";

  const socialLinks = founderMember?.socialLinks || {
    linkedin: profile?.socialLinks?.linkedin || "",
    twitter: profile?.socialLinks?.twitter || "",
    instagram: profile?.socialLinks?.instagram || "",
    website: profile?.socialLinks?.website || "",
    email: profile?.contactEmail || "officialaadhakh@gmail.com",
  };

  return (
    <div className="bg-[#060608] min-h-screen text-white">
      {/* 3D Yellow & Black Hero */}
      <section className="samad-hero-grid border-b border-zinc-800/80 pt-10 pb-14 sm:pt-16 sm:pb-20 relative overflow-hidden">
        <ThreeHeroCanvas variant="dark" />
        <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-[#FFF33D]/15 blur-[120px]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-5">
          <nav
            aria-label="Breadcrumb"
            className="text-xs text-zinc-400 flex items-center gap-2"
          >
            <Link href="/" className="hover:text-[#FFF33D] font-semibold transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#FFF33D] font-bold">Founder &amp; Leadership</span>
          </nav>

          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF33D]/10 border border-[#FFF33D]/30 text-xs font-bold text-[#FFF33D]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Leadership &amp; Engineering</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              Founder &amp; <span className="samad-highlight">Vision</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Guided by founder Sabir Usmani from Agra, India — uniting instant website hosting with practical everyday web tools.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-[#0B0B0F] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Founder Profile Card */}
          <Card3D intensity={6}>
            <section className="samad-card p-8 sm:p-10 space-y-8 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-[#FFF33D]" />

              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 pt-2">
                <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-3xl bg-[#141419] overflow-hidden shrink-0 flex items-center justify-center border-4 border-[#FFF33D] shadow-[0_15px_40px_rgba(255,243,61,0.18)]">
                  {founderPhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={founderPhoto}
                      alt={founderName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl font-black text-[#FFF33D]">
                      {founderName.charAt(0)}
                    </span>
                  )}
                </div>

                <div className="space-y-4 flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF33D] text-black text-xs font-extrabold uppercase tracking-wider">
                    <span>{founderTitle}</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {founderName}
                  </h2>

                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                    {founderBio}
                  </p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-1 text-xs">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#18181F] border border-zinc-800 text-zinc-200 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-[#FFF33D]" />
                      <span>{profile?.headquarters || "Bodla, Agra, UP"}</span>
                    </span>

                    <a
                      href={`mailto:${socialLinks.email || "officialaadhakh@gmail.com"}`}
                      className="btn-3d-yellow inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{socialLinks.email || "officialaadhakh@gmail.com"}</span>
                    </a>

                    <a
                      href={`tel:${(profile?.contactPhone || "+919458204216").replace(/\s+/g, "")}`}
                      className="btn-3d-black inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#FFF33D]" />
                      <span>{profile?.contactPhone || "+91 94582 04216"}</span>
                    </a>

                    {socialLinks.linkedin && (
                      <a
                        href={socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-3d-black inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs"
                      >
                        <Linkedin className="w-3.5 h-3.5 text-[#FFF33D]" />
                        <span>LinkedIn</span>
                      </a>
                    )}

                    {socialLinks.twitter && (
                      <a
                        href={socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-3d-black inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs"
                      >
                        <Twitter className="w-3.5 h-3.5 text-[#FFF33D]" />
                        <span>X / Twitter</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {(founderBackground || founderPhilosophy) && (
                <div className="pt-8 border-t border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {founderBackground && (
                    <div className="space-y-2">
                      <h3 className="text-base font-extrabold text-[#FFF33D]">
                        Professional Background
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                        {founderBackground}
                      </p>
                    </div>
                  )}
                  {founderPhilosophy && (
                    <div className="space-y-2">
                      <h3 className="text-base font-extrabold text-[#FFF33D]">
                        Leadership Philosophy
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                        {founderPhilosophy}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </section>
          </Card3D>

          {/* Message from Founder */}
          {founderMessage && (
            <Card3D intensity={6}>
              <section className="samad-card p-8 sm:p-10 space-y-5 border-[#FFF33D]/30 relative overflow-hidden">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF33D] text-black flex items-center justify-center shadow-md shadow-[#FFF33D]/20">
                    <Quote className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFF33D]">
                      Official Statement
                    </span>
                    <h2 className="text-2xl font-black text-white">
                      Message from the Founder
                    </h2>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed italic whitespace-pre-line">
                  &ldquo;{founderMessage}&rdquo;
                </p>

                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                  <div>
                    <span className="font-bold text-white">{founderName}</span> &mdash;{" "}
                    {founderTitle}
                  </div>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1 text-[#FFF33D] font-bold hover:underline"
                  >
                    <span>Connect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </section>
            </Card3D>
          )}

          {/* Additional Leadership */}
          {leadership.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Leadership <span className="samad-highlight">Team</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {leadership.map((member) => (
                  <Card3D key={member.id} intensity={9}>
                    <div className="samad-card p-6 flex flex-col justify-between space-y-4 h-full">
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#FFF33D] text-black font-black text-lg flex items-center justify-center shadow-md shadow-[#FFF33D]/20">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-extrabold text-white">
                            {member.name}
                          </h3>
                          <div className="text-xs font-bold text-[#FFF33D]">
                            {member.designation}
                          </div>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                          {member.bio}
                        </p>
                      </div>
                    </div>
                  </Card3D>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
