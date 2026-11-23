"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowUpRight, Facebook, Github, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { Logo } from "@/components/Logo";

const projects = [
  { label: "Age Calculator", href: "https://sabirusmani077.github.io/Age-calculator/" },
  { label: "MDK Convertor", href: "https://sabirusmani077.github.io/MDK-Convertor/" },
  { label: "Sabir's Portfolio", href: "https://sabirusmani077.github.io/Self-Portfolio-/" },
];

const socialLinks = [
  { label: "X", href: "https://x.com/Mrsabirusmani07", icon: "x" },
  { label: "Instagram", href: "https://www.instagram.com/sabir_usmani_077/", icon: "instagram" },
  { label: "Facebook", href: "https://www.facebook.com/share/18oqDsbATK/", icon: "facebook" },
  { label: "YouTube", href: "https://www.youtube.com/@Sabirusmani07", icon: "youtube" },
  { label: "GitHub", href: "https://github.com/Sabirusmani077", icon: "github" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sabir-usmani-753195397", icon: "linkedin" },
];

function SocialIcon({ icon }: { icon: string }) {
  if (icon === "instagram") return <Instagram className="h-4 w-4" aria-hidden="true" />;
  if (icon === "facebook") return <Facebook className="h-4 w-4" aria-hidden="true" />;
  if (icon === "youtube") return <Youtube className="h-4 w-4" aria-hidden="true" />;
  if (icon === "github") return <Github className="h-4 w-4" aria-hidden="true" />;
  if (icon === "linkedin") return <Linkedin className="h-4 w-4" aria-hidden="true" />;
  return <span className="text-base font-bold leading-none" aria-hidden="true">𝕏</span>;
}

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard")) return null;

  return (
    <footer data-site-theme="premium" className="site-footer relative isolate overflow-hidden">
      <div className="footer-glow pointer-events-none absolute inset-0 -z-10" />
      <div className="footer-inner mx-auto max-w-7xl px-5 pb-6 pt-14 sm:px-8 sm:pt-16 lg:px-10">
        <div className="footer-panel rounded-[30px] border border-zinc-800 bg-[#0A0A0A]/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,.6)] backdrop-blur-2xl text-white sm:p-9 lg:p-10">
          <div className="grid gap-10 border-b border-zinc-800 pb-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
            <div className="footer-brand space-y-6 lg:col-span-4">
              <div>
                <Logo size="md" showTagline inverted />
                <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-400">
                  A home for digital products, useful web applications, and new ventures led by Sabir Usmani.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5" aria-label="Social profiles">
                {socialLinks.map((item) => (
                  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label} className="footer-social-link flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-300 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#FFF33D] hover:bg-[#FFF33D] hover:text-black">
                    <SocialIcon icon={item.icon} />
                  </a>
                ))}
              </div>

              <div className="space-y-2.5 text-xs text-zinc-400">
                <a href="mailto:officialaadhakh@gmail.com" className="flex items-center gap-2 transition hover:text-[#FFF33D]"><Mail className="h-3.5 w-3.5 text-[#FFF33D] shrink-0" /> officialaadhakh@gmail.com</a>
                <a href="tel:+919458204216" className="flex items-center gap-2 transition hover:text-[#FFF33D]"><Phone className="h-3.5 w-3.5 text-[#FFF33D] shrink-0" /> +91 94582 04216</a>
                <a href="https://maps.app.goo.gl/UnzqY6kZ3i2BRieKA" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition hover:text-[#FFF33D] group" title="Open Google Maps Location">
                  <MapPin className="h-3.5 w-3.5 text-[#FFF33D] shrink-0 group-hover:scale-110 transition-transform" />
                  <span>Bodla, Agra, Uttar Pradesh 282010, India</span>
                  <ArrowUpRight className="h-3 w-3 text-slate-400 opacity-60 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>

            <FooterColumn title="Projects &amp; Tools">
              {projects.map((project) => <FooterExternalLink key={project.href} href={project.href}>{project.label}</FooterExternalLink>)}
            </FooterColumn>

            <FooterColumn title="Hosting Platform">
              <FooterLink href="/websites">Public directory</FooterLink>
              <FooterLink href="/dashboard?action=upload">Upload website</FooterLink>
              <FooterLink href="/dashboard">Hosting console</FooterLink>
              <FooterLink href="/ecosystem-search">Ecosystem search</FooterLink>
            </FooterColumn>

            <FooterColumn title="Company">
              <FooterLink href="/about-company">About Samad Expo</FooterLink>
              <FooterLink href="/founder">Founder &amp; owner</FooterLink>
              <FooterLink href="/corporate-services">Services &amp; solutions</FooterLink>
              <FooterLink href="/contact">Contact us</FooterLink>
            </FooterColumn>

            <FooterColumn title="Resources">
              <FooterLink href="/faq">Frequently asked questions</FooterLink>
              <FooterLink href="/privacy-policy">Privacy policy</FooterLink>
              <FooterLink href="/terms">Terms of service</FooterLink>
              <FooterLink href="/disclaimer">Disclaimer</FooterLink>
            </FooterColumn>
          </div>

          <div className="flex flex-col gap-4 pt-6 text-[11px] text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} Samad Expo · Bodla, Agra, India</span>
            <Link href="/disclaimer" className="transition hover:text-[#FFF33D]">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="footer-column space-y-4 lg:col-span-2">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFF33D]">{title}</h3>
      <nav aria-label={title} className="flex flex-col items-start gap-3 text-sm text-zinc-400">{children}</nav>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link href={href} className="transition duration-200 hover:translate-x-1 hover:text-[#FFF33D]">{children}</Link>;
}

function FooterExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center transition duration-200 hover:translate-x-1 hover:text-[#FFF33D]">{children}<ArrowUpRight className="ml-1 h-3 w-3" /></a>;
}
