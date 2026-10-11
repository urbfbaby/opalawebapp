import type { MetadataRoute } from "next";
import { getApartments, getProperties } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [apartments, properties] = await Promise.all([
    getApartments(),
    getProperties(),
  ]);

  const staticPages = [
    "",
    "/apartments",
    "/location",
    "/about",
    "/contact",
    "/for-education-agents",
    "/terms",
    "/privacy",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const propertyPages = properties.map((prop) => ({
    url: `${siteUrl}/properties/${prop.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const apartmentPages = apartments.map((apt) => ({
    url: `${siteUrl}/apartments/${apt.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...propertyPages, ...apartmentPages];
}
