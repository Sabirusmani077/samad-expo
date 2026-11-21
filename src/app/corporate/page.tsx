import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Samad Expo — Corporate",
  description:
    "Samad Expo is a diversified corporate group with ventures spanning web platforms, technology, and digital services.",
};

export default function CorporateHomePage() {
  const db = readDb();
  const profile = db.companyProfile;
  const divisions = (db.businessDivisions ?? []).filter(
    (d) => d.status === "active"
  );
  const websites = (db.websiteListings ?? []).filter((w) => w.isPublic);
  const team = (db.teamMembers ?? []).filter((m) => m.isActive);
  const services = (db.corporateServices ?? []).filter(
    (s) => s.status === "active"
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-slate-900 font-medium">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">Corporate</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="bg-white border-b-2 border-slate-900 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-md bg-[#FFF33D] text-black font-extrabold font-extrabold text-[11px] uppercase border border-slate-900/20 mb-4">
              MDK Group of Companies
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-slate-950 leading-tight mb-6">
              {profile?.businessName ?? "Samad Expo"}
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl">
              {profile?.tagline ??
                "A diversified corporate group building tomorrow's businesses today."}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/about-company"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold border-2 border-slate-900 shadow-[4px_4px_0px_#FFF33D] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-sm"
              >
                Our Story
              </Link>
              <Link
                href="/businesses"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFF33D] text-slate-900 font-bold border-2 border-slate-900 shadow-[4px_4px_0px_#1e293b] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-sm"
              >
                Our Businesses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="border-b-2 border-slate-900 bg-[#FFF33D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x-2 divide-slate-900">
            {[
              { label: "Business Divisions", value: divisions.length || "5+" },
              { label: "Digital Properties", value: websites.length || "10+" },
              { label: "Team Members", value: team.length || "50+" },
              { label: "Services Offered", value: services.length || "20+" },
            ].map((stat) => (
              <div key={stat.label} className="p-6 md:p-8 text-center">
                <div className="text-3xl md:text-4xl font-black text-slate-950">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wide mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16 border-b-2 border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 rounded-md bg-[#FFF33D] text-black font-extrabold font-extrabold text-[11px] uppercase border border-slate-900/20 mb-4">
                Who We Are
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 mb-6">
                Building a Diversified Business Empire
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                {profile?.about ??
                  "Samad Expo is a forward-thinking corporate group committed to innovation, excellence, and sustainable growth across multiple sectors."}
              </p>
              <p className="text-slate-600 leading-relaxed">
                {profile?.mission ??
                  "Our mission is to create lasting value for our customers, partners, and communities through cutting-edge solutions and principled business practices."}
              </p>
              <Link
                href="/about-company"
                className="inline-block mt-6 px-5 py-2.5 bg-white text-slate-900 font-bold border-2 border-slate-900 shadow-[4px_4px_0px_#FFF33D] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-sm"
              >
                Read Our Full Story →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {(profile?.coreValues ?? []).slice(0, 4).map((val, i) => (
                <div
                  key={i}
                  className="p-5 border-2 border-slate-900 shadow-[4px_4px_0px_#FFF33D] bg-white"
                >
                  <div className="text-2xl mb-2">{val.icon || "✦"}</div>
                  <h3 className="font-black text-slate-900 text-sm mb-1">
                    {val.title}
                  </h3>
                  <p className="text-xs text-slate-500">{val.description}</p>
                </div>
              ))}
              {(profile?.coreValues ?? []).length === 0 &&
                ["Innovation", "Integrity", "Excellence", "Impact"].map(
                  (v) => (
                    <div
                      key={v}
                      className="p-5 border-2 border-slate-900 shadow-[4px_4px_0px_#FFF33D] bg-white"
                    >
                      <div className="text-2xl mb-2">✦</div>
                      <h3 className="font-black text-slate-900 text-sm">
                        {v}
                      </h3>
                    </div>
                  )
                )}
            </div>
          </div>
        </div>
      </section>

      {/* Business Divisions */}
      <section className="py-16 border-b-2 border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-block px-3 py-1 rounded-md bg-[#FFF33D] text-black font-extrabold font-extrabold text-[11px] uppercase border border-slate-900/20 mb-3">
                Our Businesses
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950">
                Business Divisions
              </h2>
            </div>
            <Link
              href="/businesses"
              className="hidden md:inline-block px-5 py-2.5 bg-slate-900 text-white font-bold border-2 border-slate-900 shadow-[4px_4px_0px_#FFF33D] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-sm"
            >
              View All →
            </Link>
          </div>
          {divisions.length === 0 ? (
            <div className="text-center py-16 border-2 border-slate-900 shadow-[8px_8px_0px_#FFF33D] bg-white">
              <p className="text-4xl mb-3">🏗️</p>
              <h3 className="font-black text-slate-900 text-xl mb-2">
                Coming Soon
              </h3>
              <p className="text-slate-500 text-sm">
                Our business divisions are being set up. Stay tuned!
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {divisions.slice(0, 6).map((div) => (
                <div
                  key={div.id}
                  className="border-2 border-slate-900 shadow-[6px_6px_0px_#FFF33D] bg-white p-6 hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">
                      {div.logo ? (
                        <img
                          src={div.logo}
                          alt={div.name}
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        "🏢"
                      )}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-[#FFF33D] border border-slate-900">
                      {div.category}
                    </span>
                  </div>
                  <h3 className="font-black text-slate-900 text-lg mb-2">
                    {div.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {div.shortDescription}
                  </p>
                  <Link
                    href={`/businesses/${div.slug}`}
                    className="text-xs font-bold text-slate-900 underline hover:text-slate-600"
                  >
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Digital Ecosystem Preview */}
      <section className="py-16 border-b-2 border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-block px-3 py-1 rounded-md bg-[#FFF33D] text-black font-extrabold font-extrabold text-[11px] uppercase border border-slate-900/20 mb-3">
                Digital Ecosystem
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950">
                Our Digital Properties
              </h2>
            </div>
            <Link
              href="/websites"
              className="hidden md:inline-block px-5 py-2.5 bg-slate-900 text-white font-bold border-2 border-slate-900 shadow-[4px_4px_0px_#FFF33D] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-sm"
            >
              Explore All →
            </Link>
          </div>
          {websites.length === 0 ? (
            <div className="text-center py-16 border-2 border-slate-900 shadow-[8px_8px_0px_#FFF33D] bg-white">
              <p className="text-4xl mb-3">🌐</p>
              <h3 className="font-black text-slate-900 text-xl mb-2">
                Coming Soon
              </h3>
              <p className="text-slate-500 text-sm">
                Our digital properties are launching soon!
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {websites.slice(0, 4).map((site) => (
                <div
                  key={site.id}
                  className="border-2 border-slate-900 shadow-[4px_4px_0px_#FFF33D] bg-white p-5"
                >
                  <div className="mb-3">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase border border-slate-900 ${
                        site.status === "live"
                          ? "bg-green-100 text-green-800"
                          : site.status === "under_development"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-zinc-100 text-zinc-900 border border-zinc-300"
                      }`}
                    >
                      {site.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <h3 className="font-black text-slate-900 text-sm mb-1">
                    {site.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-3">
                    {site.shortDescription}
                  </p>
                  {site.status === "live" && site.url && (
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-slate-900 underline"
                    >
                      Visit →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Services */}
      <section className="py-16 border-b-2 border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-block px-3 py-1 rounded-md bg-[#FFF33D] text-black font-extrabold font-extrabold text-[11px] uppercase border border-slate-900/20 mb-3">
                What We Offer
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950">
                Corporate Services
              </h2>
            </div>
            <Link
              href="/corporate-services"
              className="hidden md:inline-block px-5 py-2.5 bg-slate-900 text-white font-bold border-2 border-slate-900 shadow-[4px_4px_0px_#FFF33D] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-sm"
            >
              All Services →
            </Link>
          </div>
          {services.length === 0 ? (
            <div className="text-center py-16 border-2 border-slate-900 shadow-[8px_8px_0px_#FFF33D] bg-white">
              <p className="text-4xl mb-3">⚙️</p>
              <h3 className="font-black text-slate-900 text-xl mb-2">
                Services Coming Soon
              </h3>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.slice(0, 6).map((svc) => (
                <div
                  key={svc.id}
                  className="border-2 border-slate-900 shadow-[4px_4px_0px_#FFF33D] bg-white p-6"
                >
                  <div className="text-2xl mb-3">{svc.icon || "⚙️"}</div>
                  <span className="inline-block mb-2 px-2 py-0.5 text-[10px] font-bold uppercase bg-[#FFF33D] border border-slate-900">
                    {svc.category}
                  </span>
                  <h3 className="font-black text-slate-900 text-base mb-2">
                    {svc.name}
                  </h3>
                  <p className="text-xs text-slate-500">{svc.shortDescription}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Team Preview */}
      <section className="py-16 border-b-2 border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-block px-3 py-1 rounded-md bg-[#FFF33D] text-black font-extrabold font-extrabold text-[11px] uppercase border border-slate-900/20 mb-3">
                Our People
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950">
                Leadership Team
              </h2>
            </div>
            <Link
              href="/founder"
              className="hidden md:inline-block px-5 py-2.5 bg-slate-900 text-white font-bold border-2 border-slate-900 shadow-[4px_4px_0px_#FFF33D] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-sm"
            >
              Meet the Team →
            </Link>
          </div>
          {team.length === 0 ? (
            <div className="text-center py-16 border-2 border-slate-900 shadow-[8px_8px_0px_#FFF33D] bg-white">
              <p className="text-4xl mb-3">👥</p>
              <h3 className="font-black text-slate-900 text-xl mb-2">
                Team Profiles Coming Soon
              </h3>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.slice(0, 4).map((member) => (
                <div
                  key={member.id}
                  className="border-2 border-slate-900 shadow-[4px_4px_0px_#FFF33D] bg-white text-center p-6"
                >
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-slate-900"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-[#FFF33D] border-2 border-slate-900 mx-auto mb-4 flex items-center justify-center text-2xl font-black text-slate-900">
                      {member.name[0]}
                    </div>
                  )}
                  <h3 className="font-black text-slate-900 text-sm">
                    {member.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {member.designation}
                  </p>
                  {member.isFounder && (
                    <span className="mt-2 inline-block px-2 py-0.5 text-[10px] font-bold bg-[#FFF33D] border border-slate-900">
                      Founder
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 border-b-2 border-slate-200 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-md bg-[#FFF33D] text-black font-extrabold font-extrabold text-[11px] uppercase border border-slate-900/20 mb-3">
              Why MDK
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Why Choose Us
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🚀",
                title: "Innovation First",
                desc: "We embrace emerging technologies and innovative approaches to solve real problems.",
              },
              {
                icon: "🤝",
                title: "Trusted Partner",
                desc: "Built on trust and transparency, we forge long-lasting partnerships.",
              },
              {
                icon: "🌐",
                title: "Digital Native",
                desc: "Born in the digital era, we leverage technology for exponential growth.",
              },
              {
                icon: "📈",
                title: "Growth Oriented",
                desc: "Every decision is made with sustainable, long-term growth in mind.",
              },
              {
                icon: "🎯",
                title: "Focused Execution",
                desc: "We set ambitious goals and execute with precision and dedication.",
              },
              {
                icon: "💡",
                title: "Creative Solutions",
                desc: "Creative thinking drives our approach to every challenge we face.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="border-2 border-[#FFF33D] p-6 bg-transparent"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-black text-white text-base mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 rounded-md bg-[#FFF33D] text-black font-extrabold font-extrabold text-[11px] uppercase border border-slate-900/20 mb-4">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 mb-4">
            Ready to Work Together?
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto mb-8 text-sm leading-relaxed">
            Whether you&apos;re looking to partner, invest, or explore
            opportunities, we&apos;d love to hear from you.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-black border-2 border-slate-900 shadow-[6px_6px_0px_#FFF33D] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              Contact Us
            </Link>
            <Link
              href="/partnerships"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#FFF33D] text-slate-900 font-black border-2 border-slate-900 shadow-[6px_6px_0px_#1e293b] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              Partnerships
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
