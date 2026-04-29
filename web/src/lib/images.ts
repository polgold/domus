import { getLocation } from "@/data/locations";
import manifest from "@/data/image-manifest.json";

type ManifestEntry = { cover: string | null; gallery: string[] };
const data = manifest as Record<string, ManifestEntry | undefined>;

export type ResolvedImage = {
  src: string;
  alt: string;
  isCover: boolean;
  filename: string;
};

const GENERIC_RX = /^(img|dsc|dscf|dscn|p|a7\d+|capture|foto|image|fotos?-?\d+|[a-f0-9]{8,}|\d+)$/i;

function prettifyLabel(stem: string, locName: string, idx: number): string {
  const cleaned = stem
    .replace(/^\d+__/, "")
    .replace(/^\d+\./, "")
    .replace(/^foto-?/i, "")
    .replace(/[-_]+/g, " ")
    .trim();
  if (!cleaned || GENERIC_RX.test(cleaned.replace(/\s+/g, ""))) {
    return `${locName} — foto ${String(idx).padStart(2, "0")}`;
  }
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function entry(slug: string): ManifestEntry {
  return data[slug] ?? { cover: null, gallery: [] };
}

export function countLocationImages(slug: string): number {
  const e = entry(slug);
  return (e.cover ? 1 : 0) + e.gallery.length;
}

export function getCoverSrc(slug: string): string {
  const e = entry(slug);
  if (e.cover) return `/locations/${slug}/${e.cover}`;
  if (e.gallery.length > 0) return `/locations/${slug}/gallery/${e.gallery[0]}`;
  return "/logo_domus.png";
}

export function getLocationImages(slug: string): ResolvedImage[] {
  const loc = getLocation(slug);
  if (!loc) return [];
  const e = entry(slug);

  const out: ResolvedImage[] = [];
  if (e.cover) {
    out.push({
      src: `/locations/${slug}/${e.cover}`,
      alt: `${loc.name} — vista principal`,
      isCover: true,
      filename: e.cover,
    });
  }
  e.gallery.forEach((file, i) => {
    const stem = file.replace(/\.[^.]+$/, "");
    out.push({
      src: `/locations/${slug}/gallery/${file}`,
      alt: prettifyLabel(stem, loc.name, i + 1),
      isCover: false,
      filename: file,
    });
  });
  return out;
}
