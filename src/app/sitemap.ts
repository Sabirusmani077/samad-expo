import { MetadataRoute } from "next";
import { readDb } from "@/lib/db";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const db = readDb();

  const staticRoutes = [
    "",
    "/about-company",
    "/founder",
    "/businesses",
    "/websites",
    "/corporate-services",
    "/portfolio",
    "/blog",
    "/careers",
    "/partnerships",
    "/ecosystem-search",
    "/contact",
    "/faq",
    "/privacy-policy",
    "/terms",
    "/disclaimer",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const websiteRoutes = (db.websiteListings || [])
    .filter((w) => w.isPublic !== false)
    .map((w) => ({
      url: `${baseUrl}/websites/${w.slug}`,
      lastModified: new Date(w.updatedAt || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const divisionRoutes = (db.businessDivisions || [])
    .filter((d) => d.status === "active")
    .map((d) => ({
      url: `${baseUrl}/businesses/${d.slug}`,
      lastModified: new Date(d.updatedAt || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const blogRoutes = (db.blogPosts || [])
    .filter((b) => b.status === "published")
    .map((b) => ({
      url: `${baseUrl}/blog/${b.slug}`,
      lastModified: new Date(b.updatedAt || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  return [...staticRoutes, ...websiteRoutes, ...divisionRoutes, ...blogRoutes];
}
