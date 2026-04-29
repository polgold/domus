# Domus Locaciones — sitio

Catálogo de **64 locaciones** para producciones audiovisuales y fotográficas en CABA y Provincia de Buenos Aires.

## Stack

- Next.js 16 (App Router, Turbopack) + TypeScript
- Tailwind v4
- Framer Motion · lucide-react · @vercel/og · sharp
- Tipografía: Fraunces (serif editorial) + Geist Sans + Geist Mono

## Desarrollo

```bash
npm install
npm run dev   # http://localhost:3000
npm run lint
npm run build
```

## Regenerar el catálogo

Las imágenes y la metadata viven afuera del proyecto Next:

```text
../_catalog/
  catalog.json         fuente de verdad (importada por src/data/locations.ts)
  build_catalog.py     reconstruye catalog.json desde los originales
  organize.py          copia originales a web/public/locations/<slug>/
  optimize.sh          recodifica todo a .jpg web (max 2000px, q=82)
```

Pipeline completo:

```bash
python3 _catalog/build_catalog.py    # regenera catalog.json
python3 _catalog/organize.py         # copia a web/public/locations
bash _catalog/optimize.sh            # convierte a .jpg unificado
cp _catalog/catalog.json web/src/data/catalog.json
```

> Las RAW (`.NEF`, `.DNG`) requieren `brew install dcraw` para convertirse. Sin esa dependencia se saltean y se borran del destino.

## Estructura

```text
src/
  app/
    layout.tsx                       Header + Footer + metadata raíz
    page.tsx                         Landing
    locaciones/
      page.tsx                       Grilla con filtros
      [slug]/
        page.tsx                     Detalle con galería y CTAs
        opengraph-image.tsx          OG dinámica por locación
    sumate/page.tsx
    contacto/page.tsx
    sitemap.ts · robots.ts · opengraph-image.tsx
    not-found.tsx
  components/
    Header · Footer · LocationCard · FilterBar · Gallery · MobileCta
  data/
    catalog.json                     copia del catálogo
    locations.ts                     tipos + helpers
  lib/
    images.ts                        lectura del filesystem en build
    filters.ts                       parse / apply / build query
public/
  logo_domus.png
  locations/<slug>/{cover.jpg, gallery/NN__label.jpg}
```

## Variables de entorno

```bash
NEXT_PUBLIC_SITE_URL=https://domuslocaciones.com.ar
```

Si no se setea, el sitio usa `https://domuslocaciones.com.ar` para canonical, sitemap y OG.

## Deploy en Vercel

```bash
cd web
vercel             # primer deploy + link
vercel --prod      # producción
```

El root del proyecto en Vercel debe ser **`web/`**. El build estático genera 64 páginas de detalle + 64 OG dinámicas + landing + grilla + sumate + contacto + sitemap + robots.

## Mantenimiento

- Para sumar locaciones: agregar carpetas a los originales, correr el pipeline y commitear `web/src/data/catalog.json` + `web/public/locations/<nuevo-slug>/`.
- Para cambiar tarifas, mensajes o fotos destacadas: editar `src/data/catalog.json` (tagline, contacto) y `src/data/locations.ts` (etiquetas de tipo).
