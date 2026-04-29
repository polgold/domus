#!/usr/bin/env python3
"""
organize.py — copia los originales hacia una estructura limpia para el sitio.

Lee catalog.json y produce:
  ../web/public/locations/<slug>/cover.<ext>
  ../web/public/locations/<slug>/gallery/<NN>__<label>.<ext>

Donde <label> proviene del nombre original del archivo cuando es descriptivo
(ej. "patio.JPG" -> "patio"), o un número correlativo cuando es genérico
(ej. "DSC_0955.NEF" -> "foto-15").

NO toca los originales. Solo copia. Es idempotente.
"""
from __future__ import annotations
import json, re, shutil, unicodedata
from pathlib import Path

CATALOG_FILE = Path(__file__).parent / 'catalog.json'
ROOT_ORIGINALS = Path(__file__).resolve().parent.parent  # /Users/.../menudelocaciones
DEST = ROOT_ORIGINALS / 'web' / 'public' / 'locations'


def slugify(s: str) -> str:
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode('ascii')
    s = re.sub(r'[^A-Za-z0-9]+', '-', s).strip('-').lower()
    return s or 'foto'


def copy_one(src: Path, dst: Path) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    if dst.exists() and dst.stat().st_size == src.stat().st_size:
        return
    shutil.copy2(src, dst)


def main() -> None:
    data = json.loads(CATALOG_FILE.read_text(encoding='utf-8'))
    DEST.mkdir(parents=True, exist_ok=True)

    summary = []
    for loc in data['locations']:
        loc_slug = loc['slug']
        loc_dir = DEST / loc_slug
        gallery = loc_dir / 'gallery'
        gallery.mkdir(parents=True, exist_ok=True)

        # Cover
        if loc.get('cover'):
            src = ROOT_ORIGINALS / loc['cover']
            if src.exists():
                ext = src.suffix.lower().lstrip('.')
                copy_one(src, loc_dir / f'cover.{ext}')

        # Gallery (skip cover itself which is included in images)
        seen_keys = set()
        idx = 0
        copied = 0
        for im in loc['images']:
            # avoid duplicating the cover into the gallery
            if loc.get('cover') and im['path'] == loc['cover']:
                continue
            key = (im['name'].lower(), im['size'])
            if key in seen_keys:
                continue
            seen_keys.add(key)
            idx += 1
            src = ROOT_ORIGINALS / im['path']
            if not src.exists():
                continue
            label = im.get('label')
            base = slugify(label) if label else f'foto-{idx:02d}'
            ext = src.suffix.lower().lstrip('.')
            dst = gallery / f"{idx:02d}__{base}.{ext}"
            copy_one(src, dst)
            copied += 1

        summary.append({'slug': loc_slug, 'copied': copied})

    print(f"Copiadas {sum(s['copied'] for s in summary)} fotos en {len(summary)} carpetas.")
    print(f"Destino: {DEST}")


if __name__ == '__main__':
    main()
