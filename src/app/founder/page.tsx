import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { Sparkles, Users, Award, ShieldCheck, Mail, Linkedin, Twitter, Globe, ArrowRight, Quote } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Founder & Leadership | Samad Expo",
  description:
    "Meet the founder and leadership of Samad Expo. Read the founder's message, business philosophy, and corporate vision.",
};

export default function FounderPage() {
  const db = readDb();
  const profile = db.companyProfile;
  const founderMember = db.teamMembers?.find((m) => m.isFounder && m.isActive !== false);
  const leadership = (db.teamMembers || []).filter((m) => !m.isFounder && m.isActive !== false);

  const founderName = founderMember?.name || profile?.founderName || "Founder";
  const founderTitle = founderMember?.designation || profile?.founderDesignation || "Founder & Owner";
  const founderPhoto = founderMember?.photo || profile?.founderPhoto || "";
  const founderBio = founderMember?.bio || profile?.founderBio || "";
  const founderBackground = founderMember?.professionalBackground || "";
  const founderPhilosophy = founderMember?.leadershipPhilosophy || "";
  const founderMessage =
    founderMember?.founderMessage ||
    profile?.founderMessage ||
    "";

  const socialLinks = founderMember?.socialLinks || {
    linkedin: profile?.socialLinks?.linkedin || "",
    twitter: profile?.socialLinks?.twitter || "",
    instagram: profile?.socialLinks?.instagram || "",
    website: profile?.socialLinks?.website || "",
    email: profile?.contactEmail || "",
  };

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-slate-900 font-medium">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">Leadership & Founder</span>
        </nav>

        {/* Section A: Founder Profile Hero Card */}
        <section className="rounded-3xl border-2 border-slate-900 bg-white p-8 sm:p-12 shadow-[8px_8px_0px_#FFF33D] space-y-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-slate-100 border-2 border-slate-900 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-[4px_4px_0px_#FFF33D]">
              {founderPhoto ? (
                <img src={founderPhoto} alt={founderName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#FFF33D]/30 flex flex-col items-center justify-center p-4 text-center">
                  <span className="text-4xl font-black text-slate-950">{founderName.charAt(0)}</span>
                  <span className="text-xs font-bold text-slate-600 mt-2">Photo not published</span>
                </div>
              )}
            </div>

            <div className="space-y-4 flex-1 text-center md:text-left">
              <span className="inline-block px-3 py-1 rounded-md bg-[#FFF33D] text-black font-extrabold font-extrabold text-xs uppercase tracking-wider border border-slate-900/20">
                {founderTitle}
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-950 leading-tight">
                {founderName}
              </h1>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {founderBio}
              </p>

              {/* Social and Profile links */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                {socialLinks.email && (
                  <a
                    href={`mailto:${socialLinks.email}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Desk</span>
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                  >
                    <Twitter className="w-3.5 h-3.5" />
                    <span>Twitter / X</span>
                  </a>
                )}
                {socialLinks.website && (
                  <a
                    href={socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Official Profile</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Professional Background & Philosophy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-200">
            {founderBackground && (
              <div className="space-y-2">
                <h3 className="text-base font-black text-slate-950">Professional Background</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {founderBackground}
                </p>
              </div>
            )}
            {founderPhilosophy && (
              <div className="space-y-2">
                <h3 className="text-base font-black text-slate-950">Leadership Philosophy</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {founderPhilosophy}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Section B: Dedicated Founder Message */}
        {founderMessage && <section className="rounded-3xl bg-[#FFF33D]/20 border-2 border-slate-900 p-8 sm:p-12 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF33D] border border-slate-900/30 flex items-center justify-center text-slate-950">
              <Quote className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Official Statement
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
                Message from the Founder
              </h2>
            </div>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-800 leading-relaxed">
            <p className="whitespace-pre-line font-medium">{founderMessage}</p>
          </div>

          <div className="pt-4 border-t border-slate-900/10 flex items-center justify-between text-xs text-slate-600">
            <div>
              <span className="font-bold text-slate-900">{founderName}</span> — {founderTitle}
            </div>
            <span className="font-semibold">Samad Expo</span>
          </div>
        </section>}

        {/* Section C: Leadership Team */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
              Leadership & Executive Team
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              The people driving strategy, platform operations, and digital growth across Samad Expo.
            </p>
          </div>

          {leadership.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 p-8 text-center text-slate-500 bg-slate-50">
              Additional executive appointments and leadership members will be announced as divisions expand.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leadership.map((member) => (
                <div
                  key={member.id}
                  className="rounded-2xl border border-slate-200 p-6 bg-white hover:border-slate-900/40 transition-colors space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-300 overflow-hidden flex items-center justify-center font-bold text-lg text-slate-700">
                      {member.photo ? (
                        <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        member.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-950">{member.name}</h3>
                      <div className="text-xs font-bold text-black font-bold">{member.designation}</div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">{member.bio}</p>
                  </div>

                  {member.responsibilities && member.responsibilities.length > 0 && (
                    <div className="pt-3 border-t border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Responsibilities
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {member.responsibilities.map((r, i) => (
                          <span key={i} className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
