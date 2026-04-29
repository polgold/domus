import fs from "node:fs";
import path from "node:path";
import { getLocation } from "@/data/locations";

const PUBLIC_DIR = path.join(process.cwd(), "public", "locations");

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

function findCover(slugDir: string): string | null {
  if (!fs.existsSync(slugDir)) return null;
  const entries = fs.readdirSync(slugDir);
  const cover = entries.find((f) => /^cover\.(jpg|jpeg|png|webp)$/i.test(f));
  if (cover) return cover;
  return null;
}

function listGallery(slugDir: string): string[] {
  const galleryDir = path.join(slugDir, "gallery");
  if (!fs.existsSync(galleryDir)) return [];
  return fs
    .readdirSync(galleryDir)
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, "es", { numeric: true }));
}

export function countLocationImages(slug: string): number {
  const slugDir = path.join(PUBLIC_DIR, slug);
  let n = 0;
  if (findCover(slugDir)) n += 1;
  n += listGallery(slugDir).length;
  return n;
}

export function getCoverSrc(slug: string): string {
  const slugDir = path.join(PUBLIC_DIR, slug);
  const cover = findCover(slugDir);
  if (cover) return `/locations/${slug}/${cover}`;
  const gallery = listGallery(slugDir);
  if (gallery.length > 0) return `/locations/${slug}/gallery/${gallery[0]}`;
  return "/logo_domus.png";
}

export function getLocationImages(slug: string): ResolvedImage[] {
  const loc = getLocation(slug);
  if (!loc) return [];
  const slugDir = path.join(PUBLIC_DIR, slug);
  const cover = findCover(slugDir);
  const gallery = listGallery(slugDir);

  const out: ResolvedImage[] = [];
  if (cover) {
    out.push({
      src: `/locations/${slug}/${cover}`,
      alt: `${loc.name} — vista principal`,
      isCover: true,
      filename: cover,
    });
  }
  gallery.forEach((file, i) => {
    const stem = file.replace(/\.[^.]+$/, "");
    const alt = prettifyLabel(stem, loc.name, i + 1);
    out.push({
      src: `/locations/${slug}/gallery/${file}`,
      alt,
      isCover: false,
      filename: file,
    });
  });
  return out;
}
