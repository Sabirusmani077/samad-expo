"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Youtube,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Award,
} from "lucide-react";
import { Logo } from "@/components/Logo";

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sabir-usmani-753195397", icon: "linkedin" },
  { label: "Instagram", href: "https://www.instagram.com/sabir_usmani_077/", icon: "instagram" },
  { label: "X / Twitter", href: "https://x.com/Mrsabirusmani07", icon: "x" },
  { label: "GitHub", href: "https://github.com/Sabirusmani077", icon: "github" },
  { label: "YouTube", href: "https://www.youtube.com/@Sabirusmani07", icon: "youtube" },
  { label: "Facebook", href: "https://www.facebook.com/share/18oqDsbATK/", icon: "facebook" },
];

function SocialIcon({ icon }: { icon: string }) {
  if (icon === "instagram") return <Instagram className="h-4 w-4" aria-hidden="true" />;
  if (icon === "facebook") return <Facebook className="h-4 w-4" aria-hidden="true" />;
  if (icon === "youtube") return <Youtube className="h-4 w-4" aria-hidden="true" />;
  if (icon === "github") return <Github className="h-4 w-4" aria-hidden="true" />;
  if (icon === "linkedin") return <Linkedin className="h-4 w-4" aria-hidden="true" />;
  return <span className="text-sm font-bold leading-none" aria-hidden="true">𝕏</span>;
}

export function Footer() {
  const pathname = usePathname();

  // Exclude admin pages
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="relative isolate overflow-hidden bg-[#071317] text-white pt-16 pb-10 border-t border-teal-900/40">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(32,169,187,0.15),rgba(0,0,0,0))]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 5-Column Athenura Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          
          {/* Column 1: Brand & Identity (Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <Logo size="md" showTagline inverted />
            <p className="max-w-sm text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Next-gen software engineering, instant web hosting, and corporate digital ecosystem for modern enterprises. We build and operate systems that power the digital world.
            </p>

            {/* Social Pill Links */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-teal-400/90 mb-3">
                Connect With Headquarters
              </div>
              <div className="flex flex-wrap gap-2.5">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition-all duration-300 hover:-translate-y-1 hover:border-[#20A9BB] hover:bg-[#20A9BB] hover:text-white shadow-xs"
                  >
                    <SocialIcon icon={item.icon} />
                  </a>
                ))}
              </div>
            </div>

            {/* Verified Security Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-500/20 bg-teal-950/40 text-[11px] text-teal-300">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Enterprise Grade Security &amp; Audit Certified</span>
            </div>
          </div>

          {/* Column 2: Company Links (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-teal-400">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link href="/about-company" className="hover:text-white transition">About Us</Link>
              </li>
              <li>
                <Link href="/founder" className="hover:text-white transition">Founder &amp; Leadership</Link>
              </li>
              <li>
                <Link href="/businesses" className="hover:text-white transition">Ventures &amp; Brands</Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition">Careers &amp; Opportunities</Link>
              </li>
              <li>
                <Link href="/partnerships" className="hover:text-white transition">Partnerships</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition">Frequently Asked</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-teal-400">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link href="/corporate-services" className="hover:text-white transition">Custom Software</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition">Instant Web Hosting</Link>
              </li>
              <li>
                <Link href="/websites" className="hover:text-white transition">Live Web Tools</Link>
              </li>
              <li>
                <Link href="/ecosystem-search?q=api" className="hover:text-white transition">MCP Protocol API</Link>
              </li>
              <li>
                <Link href="/corporate-services" className="hover:text-white transition">Cloud Architecture</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition">Developer Console</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Government Trust (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-teal-400">
              Contact Us
            </h4>
            <div className="space-y-3 text-xs">
              <a
                href="mailto:officialaadhakh@gmail.com"
                className="group flex items-start gap-2.5 text-zinc-300 hover:text-white transition"
              >
                <div className="w-7 h-7 rounded-full bg-teal-900/60 border border-teal-500/30 flex items-center justify-center shrink-0 group-hover:bg-teal-600 transition">
                  <Mail className="w-3.5 h-3.5 text-teal-300 group-hover:text-white" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-teal-400">Email</div>
                  <div className="font-medium break-all">officialaadhakh@gmail.com</div>
                </div>
              </a>

              <a
                href="tel:+919170230159"
                className="group flex items-start gap-2.5 text-zinc-300 hover:text-white transition"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-900/60 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 transition">
                  <Phone className="w-3.5 h-3.5 text-emerald-300 group-hover:text-white" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-400">Phone</div>
                  <div className="font-medium">+91 91702 30159</div>
                </div>
              </a>
            </div>

            {/* Trust Certification Badges */}
            <div className="pt-2 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-[10px] text-zinc-300">
                <Award className="w-4 h-4 text-[#FFF33D] shrink-0" />
                <span>Startup India Recognized Initiative</span>
              </div>
            </div>
          </div>

          {/* Column 5: Central Headquarters Location (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-teal-400">
              Location
            </h4>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Central HQ Node</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Samad Expo Digital Hub<br />
                Technology Ecosystem, India
              </p>
              <div className="pt-1">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-400 hover:text-teal-300 transition"
                >
                  <span>Open Interactive Map</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div>
            &copy; {new Date().getFullYear()} Samad Expo. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-5 text-xs">
            <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/disclaimer" className="hover:text-white transition">Disclaimer</Link>
            <Link href="/contact" className="hover:text-white transition">Help &amp; Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
