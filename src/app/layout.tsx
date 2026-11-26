import type { Metadata } from "next";
import { Manrope, Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ClickFeedback } from "@/components/ClickFeedback";
import { PageViewTracker } from "@/components/PageViewTracker";
import { SmoothScroll } from "@/components/SmoothScroll";
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

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default:
      "Samad Expo — Central Digital Headquarters & Instant Hosting Maison",
    template: "%s | Samad Expo",
  },
  description:
    "Official digital headquarters of Samad Expo. Instant static website hosting, precision web utilities, and enterprise engineering solutions.",
  keywords: [
    "Samad Expo",
    "Digital Ecosystem",
    "Static Website Hosting",
    "Web Applications",
    "Technology Platforms",
    "Digital Engineering",
  ],
  openGraph: {
    title: "Samad Expo — Digital Headquarters & Hosting Maison",
    description:
      "An independent digital platform uniting instant cloud deployment, utility web software, and refined engineering.",
    type: "website",
    locale: "en_IN",
    siteName: "Samad Expo",
  },
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      "j7N4EKQjh9NpQFnXBGQopLmSeJ8lLXxYPD2E3pndgNA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const companyProfile = readDb().companyProfile;
  const brandStyles = {
    "--md-brand-primary": "#1D1C1C",
    "--md-brand-accent": "#C10016",
    "--md-brand-gold": "#C8A464",
    "--md-brand-font-family": "var(--font-inter), Inter, Arial, sans-serif",
  } as CSSProperties;

  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} ${cormorant.variable}`}
      style={brandStyles}
    >
      <head>
        <meta
          name="google-site-verification"
          content="j7N4EKQjh9NpQFnXBGQopLmSeJ8lLXxYPD2E3pndgNA"
        />
        <link
          rel="icon"
          href={companyProfile.favicon || "/images/primary-logo.png"}
        />
      </head>
      <body
        data-site-theme="cartier-maison"
        className="relative min-h-screen flex flex-col bg-white text-[#1D1C1C] antialiased font-sans selection:bg-[#C10016] selection:text-white"
      >
        <SmoothScroll />
        <PageViewTracker />
        <Header />
        <div className="page-shell flex-1 w-full bg-white">{children}</div>
        <Footer />
        <ClickFeedback />
      </body>
    </html>
  );
}
