# Catálogo — Menú de Locaciones

Esta carpeta `_catalog/` reúne todo lo necesario para alimentar el sitio web sin tocar los originales.

## Resumen del estado actual

Las fotos vivían en dos árboles paralelos con el mismo esquema (numeradas 1–66, agrupadas por **región** y **tipo de espacio**):

```
MENU DE LOCACIONES /                        (versión "vieja")
MENU DE LOCACIONES  2/                      (versión actualizada)
└── CABA/ | Provincia de Buenos Aires/
    └── CASAS/ | DEPTOS/ | TEATROS/ | ...
        └── 6 .Caseron antiguo en Devoto - CABA/
            ├── A7401029.JPG, patio.JPG, dormitorio 1.JPG, ...
            ├── 1.LINK PARA PRESUPUESTO.docx
            └── PDF recorrido.pdf
```

Además existe `MENU DE LOCACIONES /todas/` con **una imagen "carátula" por locación** (`1.xxx.jpg`, `2.xxx.png`, …), que conviene usar como portada en grilla.

### Cifras

| Métrica | Valor |
|---|---|
| Locaciones únicas (numeradas 1–66) | **64** (faltan los IDs 11 y 46; el 33 sólo tiene carátula) |
| Imágenes totales (deduplicadas) | **1.731** |
| Imágenes con nombre descriptivo (`patio`, `cocina`, …) | 418 |
| Imágenes RAW `.NEF` (necesitan conversión) | 42 |
| Imágenes >5 MB (conviene reducir) | 141 |
| Tamaño total en disco | ~3.1 GB |

### Tipos de espacio detectados

CASAS, DEPTOS, CASA DE CAMPO, CABAÑAS, RESTAURANT/BAR/GASTRONOMÍA, TEATROS, CLUB, BIBLIOTECAS, GALPONES, LOCALES, PALACIOS, ESPACIOS MULTIFUNCIONALES, CONCESIONARIA, ESTACIONAMIENTO, ESTACIÓN DE SERVICIO, LAVADERO DE AUTOS, OFICINAS, ALMACENES, HOSPITAL, ESTÉTICA, ESPACIOS TRASH.

### Contacto / cotización

Todos los `LINK PARA PRESUPUESTO.docx`/`.pdf` apuntan al mismo Google Form:

- **Form**: <https://docs.google.com/forms/d/e/1FAIpQLSeHn2GUIm0WPjnL01U3zps3T9A2eKI8l0SByvQdjEytNvdDkg/viewform>
- **WhatsApp / Tel**: +54 9 11 3104-6032
- **Brochure de captación de locaciones (dueños)**: `MENU DE LOCACIONES /PDF - SUMATE.pdf`
- **Carta de presentación cliente (alta)**: `MENU DE LOCACIONES /Pedí presupuestos.docx`

## Archivos en `_catalog/`

| Archivo | Para qué sirve |
|---|---|
| `catalog.json` | **Fuente de verdad.** 64 locaciones con cover, galería deduplicada, docs, etiquetas derivadas de los nombres de archivo. La web lo importa directo. |
| `catalog.slim.json` | Versión sin las galerías (cómodo para auditar). |
| `build_catalog.py` | Regenera `catalog.json` desde la estructura actual de carpetas. Idempotente. |
| `organize.py` | Copia los originales hacia `web/public/locations/<slug>/{cover.ext, gallery/NN__label.ext}`. Dedupe por `(nombre, tamaño)`. **No mueve** los originales. |
| `optimize.sh` | Genera variantes WebP (`thumb` 600px / `medium` 1200px / `large` 2000px) al lado de cada original copiado, con ImageMagick. Soporta `.NEF`. |

## Flujo recomendado

```bash
# 1) (Re)generar el catálogo desde la estructura actual
python3 _catalog/build_catalog.py

# 2) Copiar originales a una estructura limpia para la web
python3 _catalog/organize.py

# 3) Generar thumb/medium/large WebP (requiere `brew install imagemagick`)
bash _catalog/optimize.sh

# 4) Arrancar la web
cd web && npm install && npm run dev
```

## Convención de slugs y rutas

Cada locación queda como `NN-nombre-kebab` (`06-caseron-antiguo-en-devoto-caba`) y se accede en la web como `/locaciones/<slug>`. Las imágenes quedan en `/public/locations/<slug>/cover.<ext>` y `/public/locations/<slug>/gallery/NN__label.<ext>`.

Cuando el nombre de archivo original es descriptivo (`patio.JPG`, `dormitorio 1.JPG`, `cocina.jpg`), se conserva como `label` en `catalog.json` y se usa de caption / alt-text en la galería. Los nombres genéricos (`DSC_0955`, `IMG_2003`, hashes UUID, `A7401029`) caen a `foto-NN`.

## Pendientes / decisiones para más tarde

1. **Locación 66 ("Teatro en CABA")** no tiene carátula; usa la primera foto de la galería.
2. **Locación 33 ("Parque de diversiones - Luján")** sólo tiene la carátula; falta la galería.
3. **42 archivos `.NEF`**: `optimize.sh` los convierte vía ImageMagick + dcraw. Si `brew install dcraw` no está, esas fotos se saltean.
4. **PDFs por locación** (`PDF recorrido.pdf`, `brouchure el lucero.pdf`): `catalog.json` los lista en `docs[]`. La web puede ofrecerlos como "Plano / brochure".
