import type { MetadataRoute } from "next";
import { locations } from "@/data/locations";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://domuslocaciones.com.ar";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/locaciones`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/sumate`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contacto`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
  const detail: MetadataRoute.Sitemap = locations.map((l) => ({
    url: `${SITE_URL}/locaciones/${l.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  return [...base, ...detail];
}
