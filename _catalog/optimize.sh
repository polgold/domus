#!/usr/bin/env bash
# optimize.sh — convierte cada imagen de web/public/locations/ a .jpg web-optimizado.
#
# Reglas:
#   - Salida unificada: extensión .jpg para todas las fotos.
#   - Máximo 2000px en el lado más largo.
#   - Calidad JPEG 82, EXIF removido, auto-orient.
#   - Idempotente: si ya es .jpg con lado <=2000px, no se reprocesa.
#
# Requisitos:
#   brew install imagemagick   # incluye soporte HEIC y JFIF
#   brew install dcraw         # opcional, para .NEF (cámaras Nikon)
#
# Uso:
#   bash _catalog/optimize.sh                 # procesa todo public/locations
#   bash _catalog/optimize.sh slug-locacion   # procesa solo esa locación

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WEB="$ROOT/web/public/locations"
TARGET="${1:-}"

MAX=2000
QUALITY=82

if ! command -v magick >/dev/null 2>&1; then
  echo "ERROR: ImageMagick (comando 'magick') no encontrado. Instalar con: brew install imagemagick" >&2
  exit 1
fi

needs_processing() {
  local src="$1"
  local lower_ext="$2"
  if [[ "$lower_ext" != "jpg" && "$lower_ext" != "jpeg" ]]; then
    return 0
  fi
  local dims
  dims="$(magick identify -format "%w %h" "$src" 2>/dev/null || echo "0 0")"
  local w h
  read -r w h <<<"$dims"
  if (( w == 0 )); then return 0; fi
  if (( w > MAX || h > MAX )); then return 0; fi
  return 1
}

process_image() {
  local src="$1"
  local dir
  dir="$(dirname "$src")"
  local base
  base="$(basename "$src")"
  local stem="${base%.*}"
  local ext="${base##*.}"
  local lower_ext
  lower_ext="$(echo "$ext" | tr '[:upper:]' '[:lower:]')"

  local out="$dir/$stem.jpg"
  local tmp="$dir/.${stem}.__opt.jpg"

  if [[ -f "$out" && "$src" != "$out" ]]; then
    rm -f "$src"
    return 0
  fi

  if [[ "$src" == "$out" ]] && ! needs_processing "$src" "$lower_ext"; then
    return 0
  fi

  local input="$src"
  local raw_tmp=""
  if [[ "$lower_ext" == "nef" || "$lower_ext" == "arw" || "$lower_ext" == "cr2" || "$lower_ext" == "dng" ]]; then
    raw_tmp="$dir/.${stem}.__raw.tiff"
    if ! magick "$src" -auto-orient "$raw_tmp" 2>/dev/null; then
      echo "skip RAW (sin delegate libraw/dcraw): $src" >&2
      return 0
    fi
    input="$raw_tmp"
  fi

  magick "$input" \
    -auto-orient \
    -strip \
    -resize "${MAX}x${MAX}>" \
    -interlace JPEG \
    -sampling-factor 4:2:0 \
    -colorspace sRGB \
    -quality "$QUALITY" \
    "$tmp"

  mv -f "$tmp" "$out"
  if [[ "$src" != "$out" ]]; then
    rm -f "$src"
  fi
  if [[ -n "$raw_tmp" && -f "$raw_tmp" ]]; then
    rm -f "$raw_tmp"
  fi
}

if [[ -n "$TARGET" ]]; then
  ROOT_DIR="$WEB/$TARGET"
else
  ROOT_DIR="$WEB"
fi

if [[ ! -d "$ROOT_DIR" ]]; then
  echo "no existe: $ROOT_DIR" >&2
  exit 1
fi

count=0
errors=0
TMP_LIST="$(mktemp)"
trap 'rm -f "$TMP_LIST"' EXIT

find "$ROOT_DIR" -type f \( \
  -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.jfif' -o \
  -iname '*.heic' -o -iname '*.nef' -o -iname '*.arw' -o -iname '*.cr2' -o \
  -iname '*.dng' -o -iname '*.webp' \
\) > "$TMP_LIST"

while IFS= read -r f; do
  case "$f" in
    *.thumb.webp|*.medium.webp|*.large.webp)
      rm -f "$f"
      continue
      ;;
  esac
  if process_image "$f"; then
    count=$((count+1))
  else
    errors=$((errors+1))
  fi
  if (( count > 0 )) && (( count % 50 == 0 )); then
    echo "[optimize] procesadas $count imágenes..."
  fi
done < "$TMP_LIST"

echo "OK — $count imágenes procesadas, $errors con error. Salida unificada: .jpg max ${MAX}px q=${QUALITY}."
