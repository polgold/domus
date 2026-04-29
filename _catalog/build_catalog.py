#!/usr/bin/env python3
"""
Build a deduplicated catalog of locations.
- Walks both 'MENU DE LOCACIONES ' and 'MENU DE LOCACIONES  2'
- Each location is identified by the leading number in its folder name
- Includes a 'cover-only' entry if a location has only a cover in /todas/ but no folder
- Generates a human-friendly "label" per image from its filename (when meaningful)
"""
import os, re, json, unicodedata
from pathlib import Path

ROOT = Path('/sessions/dreamy-exciting-ramanujan/mnt/menudelocaciones')
TOP = [ROOT / 'MENU DE LOCACIONES ', ROOT / 'MENU DE LOCACIONES  2']
COVERS_DIR = ROOT / 'MENU DE LOCACIONES ' / 'todas'

IMG_EXTS = {'.jpg','.jpeg','.png','.jfif','.heic','.webp'}
RAW_EXTS = {'.nef','.arw','.cr2','.dng'}  # not directly web-renderable

def slug(s: str) -> str:
    s = unicodedata.normalize('NFKD', s).encode('ascii','ignore').decode('ascii')
    s = re.sub(r'[^A-Za-z0-9]+','-', s).strip('-').lower()
    return s

def num_from_name(name: str):
    m = re.match(r'\s*(\d+)', name)
    return int(m.group(1)) if m else None

GENERIC_PATTERNS = [
    r'^IMG[_-]?\d+',
    r'^DSC[_-]?\d+',
    r'^A7\d+$',
    r'^_DSC\d+',
    r'^_BET\d+',
    r'^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$',
    r'^Imagen de WhatsApp',
    r'^WhatsApp Image',
    r'^Captura de pantalla',
    r'^Screenshot',
    r'^\d+_n$',
    r'^Copia de ',
]

def label_from_filename(fname: str):
    """Return a human-readable label if the filename looks descriptive, else None."""
    stem = Path(fname).stem
    # remove leading 'Copia de '
    stem = re.sub(r'^Copia de\s+', '', stem)
    # if matches generic pattern -> no label
    for pat in GENERIC_PATTERNS:
        if re.match(pat, stem, re.I):
            return None
    # if stem is mostly digits/underscores -> no label
    if re.match(r'^[\d_\-]+$', stem):
        return None
    # too long (random hash) -> no label
    if len(stem) > 60 and re.match(r'^[A-Za-z0-9_\-]+$', stem) and not re.search(r' ', stem):
        return None
    # clean up
    label = re.sub(r'[_\-]+', ' ', stem).strip()
    label = re.sub(r'\s+', ' ', label)
    if not label or len(label) < 3:
        return None
    # Capitalize first letter, keep rest as-is
    return label[0].upper() + label[1:]

# Walk both trees and collect locations
locations = {}
for top in TOP:
    if not top.exists(): continue
    for region_dir in top.iterdir():
        if not region_dir.is_dir(): continue
        region = region_dir.name.strip()
        if region.lower() == 'todas': continue
        for type_dir in region_dir.iterdir():
            if not type_dir.is_dir(): continue
            tipo = type_dir.name.strip()
            for loc_dir in type_dir.iterdir():
                if not loc_dir.is_dir(): continue
                name = loc_dir.name.strip()
                num = num_from_name(name)
                if num is None: continue
                imgs = []
                for p in loc_dir.rglob('*'):
                    if p.is_file():
                        ext = p.suffix.lower()
                        if ext in IMG_EXTS or ext in RAW_EXTS:
                            try: sz = p.stat().st_size
                            except: continue
                            imgs.append({
                                'path': str(p.relative_to(ROOT)),
                                'name': p.name,
                                'size': sz,
                                'is_raw': ext in RAW_EXTS,
                                'label': label_from_filename(p.name),
                            })
                docs = []
                for p in loc_dir.rglob('*'):
                    if p.is_file() and p.suffix.lower() in {'.pdf','.docx','.doc'}:
                        docs.append(str(p.relative_to(ROOT)))
                entry = locations.setdefault(num, {
                    'id': num,
                    'name_raw': name,
                    'tipo_set': set(),
                    'region_set': set(),
                    'images': [],
                    'docs': [],
                    'source_dirs': [],
                })
                entry['tipo_set'].add(tipo)
                entry['region_set'].add(region)
                entry['source_dirs'].append(str(loc_dir.relative_to(ROOT)))
                entry['images'].extend(imgs)
                entry['docs'].extend(docs)

# Cover index by number
covers = {}
if COVERS_DIR.exists():
    for p in COVERS_DIR.iterdir():
        if p.is_file() and p.suffix.lower() in IMG_EXTS:
            n = num_from_name(p.name)
            if n is not None:
                covers.setdefault(n, []).append({
                    'path': str(p.relative_to(ROOT)),
                    'name': p.name,
                    'size': p.stat().st_size,
                    'is_raw': False,
                    'label': label_from_filename(p.name),
                })

# Add cover-only stubs for locations that have a cover but no folder
for n, covs in covers.items():
    if n not in locations:
        # derive name from the cover filename
        stem = Path(covs[0]['name']).stem
        nm = re.sub(r'^\s*\d+\s*[.\-]?\s*', '', stem).strip()
        locations[n] = {
            'id': n,
            'name_raw': stem,
            'tipo_set': set(),
            'region_set': set(),
            'images': [],
            'docs': [],
            'source_dirs': [],
            'cover_only': True,
        }

# Finalize
catalog = []
for num in sorted(locations):
    e = locations[num]
    name_raw = e['name_raw']
    name = re.sub(r'^\s*\d+\s*[.\-_]?\s*', '', name_raw).strip()
    name = re.sub(r'\s+', ' ', name)
    # dedup images by (basename lower, size)
    seen = set(); uniq = []
    for im in e['images']:
        key = (im['name'].lower(), im['size'])
        if key in seen: continue
        seen.add(key); uniq.append(im)
    docs = sorted(set(e['docs']))
    tipo = sorted(e['tipo_set'])[0] if e['tipo_set'] else None
    region = sorted(e['region_set'])[0] if e['region_set'] else None
    cover_imgs = covers.get(num, [])
    catalog.append({
        'id': num,
        'slug': f"{num:02d}-{slug(name)}",
        'name': name,
        'tipo': tipo,
        'region': region,
        'cover': cover_imgs[0]['path'] if cover_imgs else None,
        'cover_alts': [c['path'] for c in cover_imgs[1:]],
        'images_count': len(uniq) + len(cover_imgs),
        'images': cover_imgs + uniq,  # cover first as gallery hero
        'docs': docs,
        'source_dirs': sorted(set(e['source_dirs'])),
        'has_only_cover': e.get('cover_only', False),
    })

out_dir = Path('/sessions/dreamy-exciting-ramanujan/mnt/outputs')
out_dir.mkdir(parents=True, exist_ok=True)

CATALOG = {
    'company': 'Domus Locaciones',
    'phone': '+54 9 11 3104-6032',
    'whatsapp': '5491131046032',
    'email': 'domuslocaciones@gmail.com',
    'instagram': 'domuslocaciones',
    'instagram_url': 'https://www.instagram.com/domuslocaciones/',
    'contact_form': 'https://docs.google.com/forms/d/e/1FAIpQLSeHn2GUIm0WPjnL01U3zps3T9A2eKI8l0SByvQdjEytNvdDkg/viewform',
    'sumate_form': 'https://docs.google.com/forms/d/e/1FAIpQLSfv7ACbOKuQ6KSQPuvmERrazr1TPK9DGnqWCc9pOpGHGd3X1A/viewform',
    'tagline': 'Representamos locaciones para producciones audiovisuales y fotográficas en CABA y Provincia de Buenos Aires.',
    'count': len(catalog),
    'locations': catalog,
}
with open(out_dir / 'catalog.json', 'w', encoding='utf-8') as f:
    json.dump(CATALOG, f, ensure_ascii=False, indent=2)

slim = [{k:v for k,v in e.items() if k not in ('images','docs','source_dirs','cover_alts')} for e in catalog]
with open(out_dir / 'catalog.slim.json', 'w', encoding='utf-8') as f:
    json.dump(slim, f, ensure_ascii=False, indent=2)

print(f"OK - {len(catalog)} locations")
total_imgs = sum(e['images_count'] for e in catalog)
labelled = sum(1 for e in catalog for im in e['images'] if im.get('label'))
raw_imgs = sum(1 for e in catalog for im in e['images'] if im.get('is_raw'))
print(f"images (incl covers): {total_imgs}")
print(f"with descriptive label: {labelled}")
print(f"RAW (not web-renderable): {raw_imgs}")
print(f"missing cover: {[e['id'] for e in catalog if not e['cover']]}")
print(f"cover-only stubs: {[e['id'] for e in catalog if e['has_only_cover']]}")
