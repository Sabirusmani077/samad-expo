import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ClickFeedback } from "@/components/ClickFeedback";
import { PageViewTracker } from "@/components/PageViewTracker";
import { MehndiSiteFrame } from "@/components/MehndiSiteFrame";
import type { CSSProperties } from "react";
import { readDb } from "@/lib/db";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default:
      "Samad Expo — Parent Corporate Brand & Central Digital Headquarters",
    template: "%s | Samad Expo",
  },
  description:
    "Official corporate headquarters and central digital gateway of Samad Expo. Parent brand for all our businesses, websites, web applications, products, and technology platforms.",
  keywords: [
    "Samad Expo",
    "Digital Ecosystem",
    "Corporate Headquarters",
    "Web Applications",
    "Technology Platforms",
    "Business Ventures",
  ],
  openGraph: {
    title:
      "Samad Expo — Parent Corporate Brand & Central Digital Headquarters",
    description:
      "An independent business ecosystem bringing together digital platforms, businesses, products, and professional services.",
    type: "website",
    locale: "en_IN",
    siteName: "Samad Expo",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "j7N4EKQjh9NpQFnXBGQopLmSeJ8lLXxYPD2E3pndgNA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const companyProfile = readDb().companyProfile;
  const primary = /^#[0-9a-fA-F]{6}$/.test(companyProfile.brandColors?.primary || "") ? companyProfile.brandColors!.primary : "#000000";
  const accent = /^#[0-9a-fA-F]{6}$/.test(companyProfile.brandColors?.accent || "") ? companyProfile.brandColors!.accent : "#FFF33D";
  const configuredFont = companyProfile.brandFontFamily || "";
  const fontFamily = /^[\w ,'-]{1,100}$/.test(configuredFont) && configuredFont !== "Inter, Arial, sans-serif"
    ? configuredFont
    : "Manrope, Arial, sans-serif";
  const brandStyles = {
    "--md-brand-primary": primary,
    "--md-brand-accent": accent,
    "--md-brand-font-family": fontFamily,
  } as CSSProperties;
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`} style={brandStyles}>
      <head>
        <meta name="google-site-verification" content="j7N4EKQjh9NpQFnXBGQopLmSeJ8lLXxYPD2E3pndgNA" />
        <link rel="icon" href={companyProfile.favicon || "/images/primary-logo.png"} />
      </head>
      <body data-site-theme="premium" className="relative min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased font-sans">
        <MehndiSiteFrame />
        <PageViewTracker />
        <Header />
        <div className="page-shell flex-1 w-full min-h-screen">{children}</div>
        <Footer />
        <ClickFeedback />
      </body>
    </html>
  );
}
