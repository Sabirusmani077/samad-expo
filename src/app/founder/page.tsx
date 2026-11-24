import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { Sparkles, Users, Award, ShieldCheck, Mail, Linkedin, Twitter, Globe, ArrowRight, Quote, CheckCircle2 } from "lucide-react";

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

  const founderName = founderMember?.name || profile?.founderName || "Sabir Usmani";
  const founderTitle = founderMember?.designation || profile?.founderDesignation || "Founder & Chief Executive";
  const founderPhoto = founderMember?.photo || profile?.founderPhoto || "";
  const founderBio = founderMember?.bio || profile?.founderBio || "System architect and entrepreneur driving digital platform development and cloud edge hosting at Samad Expo.";
  const founderBackground = founderMember?.professionalBackground || "";
  const founderPhilosophy = founderMember?.leadershipPhilosophy || "";
  const founderMessage =
    founderMember?.founderMessage ||
    profile?.founderMessage ||
    "At Samad Expo, our purpose is simple yet uncompromising: to engineer web technologies and instant hosting platforms that remove complexity, deliver world-class performance, and empower digital entrepreneurs globally.";

  const socialLinks = founderMember?.socialLinks || {
    linkedin: profile?.socialLinks?.linkedin || "https://www.linkedin.com/in/sabir-usmani-753195397",
    twitter: profile?.socialLinks?.twitter || "https://x.com/Mrsabirusmani07",
    instagram: profile?.socialLinks?.instagram || "https://www.instagram.com/sabir_usmani_077/",
    website: profile?.socialLinks?.website || "",
    email: "officialaadhakh@gmail.com",
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-900">
      
      {/* Athenura Obsidian Hero */}
      <section className="bg-[#040D12] text-white pt-14 pb-20 sm:pt-20 sm:pb-24 border-b border-teal-900/30 relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-teal-500/10 blur-[140px]" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <nav aria-label="Breadcrumb" className="text-xs text-zinc-400 flex items-center gap-2">
            <Link href="/" className="hover:text-teal-400 transition">Home</Link>
            <span>/</span>
            <span className="text-white font-bold">Leadership &amp; Founder</span>
          </nav>

          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-teal-500/30 bg-teal-950/50 text-xs font-bold text-teal-300">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Executive Stewardship</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-tight">
              Leadership &amp; <span className="text-gradient-teal">Vision.</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
              Guided by founder Sabir Usmani, Samad Expo connects software engineering with enterprise digital hosting to build systems that scale effortlessly.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
        
        {/* Founder Profile Hero Card */}
        <section className="athenura-card p-8 sm:p-12 space-y-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-slate-900 overflow-hidden shrink-0 flex items-center justify-center shadow-lg border border-teal-500/20">
              {founderPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={founderPhoto} alt={founderName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-slate-900 to-teal-950 flex flex-col items-center justify-center p-4 text-center">
                  <span className="text-5xl font-black text-white">{founderName.charAt(0)}</span>
                  <span className="text-[10px] uppercase font-bold text-teal-400 mt-2">Executive Desk</span>
                </div>
              )}
            </div>

            <div className="space-y-4 flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider border border-teal-100">
                <span>{founderTitle}</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                {founderName}
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {founderBio}
              </p>

              {/* Social and Profile links */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                <a
                  href={`mailto:${socialLinks.email || "officialaadhakh@gmail.com"}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-800 text-xs font-bold transition"
                >
                  <Mail className="w-3.5 h-3.5 text-teal-600" />
                  <span>Email Desk</span>
                </a>
                
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-800 text-xs font-bold transition"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-teal-600" />
                    <span>LinkedIn Profile</span>
                  </a>
                )}

                {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-800 text-xs font-bold transition"
                  >
                    <Twitter className="w-3.5 h-3.5 text-teal-600" />
                    <span>X / Twitter</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {(founderBackground || founderPhilosophy) && (
            <div className="pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
              {founderBackground && (
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-950">Professional Background</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {founderBackground}
                  </p>
                </div>
              )}
              {founderPhilosophy && (
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-950">Leadership Philosophy</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {founderPhilosophy}
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Message from the Founder (Athenura Quote Layout) */}
        {founderMessage && (
          <section className="athenura-card p-8 sm:p-12 space-y-6 bg-gradient-to-br from-slate-950 to-teal-950 text-white border-none shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-teal-300 flex items-center justify-center">
                <Quote className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-teal-400">
                  Official Statement
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Message from the Founder
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-zinc-300 leading-relaxed italic font-light">
              <p className="whitespace-pre-line">{founderMessage}</p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
              <div>
                <span className="font-bold text-white">{founderName}</span> &mdash; {founderTitle}
              </div>
              <span className="font-semibold text-teal-300">Samad Expo</span>
            </div>
          </section>
        )}

        {/* Leadership Team Grid */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Executive &amp; Operational Leadership
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              The engineers and operational leads driving digital excellence across Samad Expo.
            </p>
          </div>

          {leadership.length === 0 ? (
            <div className="athenura-card p-8 text-center text-xs text-slate-500">
              Additional executive appointments will be announced as divisions expand.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leadership.map((member) => (
                <div
                  key={member.id}
                  className="athenura-card p-6 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 font-black text-lg flex items-center justify-center">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-950">{member.name}</h3>
                      <div className="text-xs font-bold text-teal-700">{member.designation}</div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
