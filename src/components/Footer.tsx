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
} from "lucide-react";
import { Logo } from "@/components/Logo";

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sabir-usmani-753195397", icon: "linkedin" },
  { label: "Instagram", href: "https://www.instagram.com/sabir_usmani_077/", icon: "instagram" },
  { label: "X", href: "https://x.com/Mrsabirusmani07", icon: "x" },
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

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <footer className="relative isolate overflow-hidden bg-[#09090B] text-white pt-16 pb-10 border-t-4 border-[#FFF33D]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_75%_50%_at_50%_-10%,rgba(255,243,61,0.08),transparent)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-zinc-800/80">
          {/* Column 1: Brand Identity (Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <Logo size="md" showTagline inverted />
            <p className="max-w-sm text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Modern website hosting, practical web utilities, and custom digital engineering led by Sabir Usmani from Agra, India.
            </p>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#FFF33D] mb-3">
                Official Channels
              </div>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FFF33D] hover:bg-[#FFF33D] hover:text-zinc-950"
                  >
                    <SocialIcon icon={item.icon} />
                  </a>
                ))}
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/90 text-[11px] text-zinc-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFF33D]" />
              <span>Security-Hardened Hosting &amp; HTTPS</span>
            </div>
          </div>

          {/* Column 2: Platform & Tools (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#FFF33D]">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link href="/dashboard" className="hover:text-[#FFF33D] transition">
                  Instant Web Hosting
                </Link>
              </li>
              <li>
                <Link href="/websites" className="hover:text-[#FFF33D] transition">
                  Live Tools Directory
                </Link>
              </li>
              <li>
                <Link
                  href="/websites/mdk-chrono-age-calculator"
                  className="hover:text-[#FFF33D] transition"
                >
                  Age Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/websites/mdk-convertor"
                  className="hover:text-[#FFF33D] transition"
                >
                  MDK Convertor
                </Link>
              </li>
              <li>
                <Link
                  href="/ecosystem-search"
                  className="hover:text-[#FFF33D] transition"
                >
                  Ecosystem Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#FFF33D]">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link href="/about-company" className="hover:text-[#FFF33D] transition">
                  About Samad Expo
                </Link>
              </li>
              <li>
                <Link href="/founder" className="hover:text-[#FFF33D] transition">
                  Founder Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/corporate-services"
                  className="hover:text-[#FFF33D] transition"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-[#FFF33D] transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/partnerships" className="hover:text-[#FFF33D] transition">
                  Partnerships
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#FFF33D] transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Direct Contact (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#FFF33D]">
              Contact
            </h4>
            <div className="space-y-3 text-xs">
              <a
                href="mailto:officialaadhakh@gmail.com"
                className="group flex items-start gap-2.5 text-zinc-300 hover:text-white transition"
              >
                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-[#FFF33D] group-hover:text-zinc-950 transition">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase font-bold text-[#FFF33D]">
                    Email
                  </div>
                  <div className="font-medium break-all text-zinc-300 group-hover:text-white">
                    officialaadhakh@gmail.com
                  </div>
                </div>
              </a>

              <a
                href="tel:+919458204216"
                className="group flex items-start gap-2.5 text-zinc-300 hover:text-white transition"
              >
                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-[#FFF33D] group-hover:text-zinc-950 transition">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#FFF33D]">
                    Phone
                  </div>
                  <div className="font-medium text-zinc-300 group-hover:text-white">
                    +91 94582 04216
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Column 5: Headquarters Location (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#FFF33D]">
              Headquarters
            </h4>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <MapPin className="w-3.5 h-3.5 text-[#FFF33D] shrink-0" />
                <span>Agra, India</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Bodla, Agra
                <br />
                Uttar Pradesh 282010, India
              </p>
              <a
                href="https://maps.app.goo.gl/UnzqY6kZ3i2BRieKA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FFF33D] hover:underline pt-1"
              >
                <span>View on Maps</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            &copy; {new Date().getFullYear()} Samad Expo. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-5 text-xs">
            <Link href="/privacy-policy" className="hover:text-[#FFF33D] transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#FFF33D] transition">
              Terms of Service
            </Link>
            <Link href="/disclaimer" className="hover:text-[#FFF33D] transition">
              Disclaimer
            </Link>
            <Link href="/contact" className="hover:text-[#FFF33D] transition">
              Contact Desk
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
