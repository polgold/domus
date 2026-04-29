#!/usr/bin/env node
// Genera src/data/image-manifest.json a partir de public/locations/.
// Corre antes del build para que LocationCard / detalle no necesiten leer fs en runtime.

import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public", "locations");
const OUT = path.join(ROOT, "src", "data", "image-manifest.json");

const IMG = /\.(jpg|jpeg|png|webp)$/i;
const COVER = /^cover\.(jpg|jpeg|png|webp)$/i;

if (!fs.existsSync(PUBLIC)) {
  console.error(`[manifest] no existe ${PUBLIC}`);
  process.exit(1);
}

const out = {};
const slugs = fs.readdirSync(PUBLIC).sort();
let totalImages = 0;

for (const slug of slugs) {
  const dir = path.join(PUBLIC, slug);
  if (!fs.statSync(dir).isDirectory()) continue;

  const cover = fs.readdirSync(dir).find((f) => COVER.test(f)) ?? null;

  const galleryDir = path.join(dir, "gallery");
  let gallery = [];
  if (fs.existsSync(galleryDir) && fs.statSync(galleryDir).isDirectory()) {
    gallery = fs
      .readdirSync(galleryDir)
      .filter((f) => IMG.test(f))
      .sort((a, b) => a.localeCompare(b, "es", { numeric: true }));
  }

  out[slug] = { cover, gallery };
  totalImages += (cover ? 1 : 0) + gallery.length;
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 2));

console.log(
  `[manifest] ${slugs.length} locaciones, ${totalImages} imágenes — ${path.relative(ROOT, OUT)}`
);
