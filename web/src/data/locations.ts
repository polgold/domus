import raw from "./catalog.json";

export type LocationImage = {
  path: string;
  name: string;
  size: number;
  is_raw: boolean;
  label: string | null;
};

export type Location = {
  id: number;
  slug: string;
  name: string;
  tipo: string | null;
  region: string | null;
  cover: string | null;
  cover_alts: string[];
  images_count: number;
  images: LocationImage[];
  docs: string[];
  has_only_cover: boolean;
};

export type Catalog = {
  company: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  instagram_url: string;
  contact_form: string;
  tagline: string;
  count: number;
  locations: Location[];
};

export const catalog = raw as Catalog;
export const locations = catalog.locations;

export const TIPO_LABELS: Record<string, string> = {
  CASAS: "Casas",
  "CASA DE CAMPO": "Casas de campo",
  DEPTOS: "Departamentos",
  CABAÑAS: "Cabañas",
  "RESTAURANT/BAR/GASTRONOMÍA": "Bares y gastronomía",
  TEATROS: "Teatros",
  CLUB: "Clubes",
  BIBLIOTECAS: "Bibliotecas",
  GALPONES: "Galpones",
  LOCALES: "Locales",
  PALACIOS: "Palacios",
  "ESPACIOS MULTIFUNCIONALES": "Espacios multifuncionales",
  CONCESIONARIA: "Concesionarias",
  ESTACIONAMIENTO: "Estacionamientos",
  "ESTACIÓN DE SERVICIO": "Estaciones de servicio",
  "LAVADERO DE AUTOS": "Lavaderos",
  OFICINAS: "Oficinas",
  ALMACENES: "Almacenes",
  HOSPITAL: "Hospitales",
  ESTÉTICA: "Estética",
  "ESPACIOS TRASH": "Espacios trash",
};

export function tipoLabel(t: string | null | undefined): string {
  if (!t) return "Locación";
  return TIPO_LABELS[t] ?? t.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getLocation(slug: string): Location | undefined {
  return locations.find((l) => l.slug === slug);
}

export function uniqueTipos(): string[] {
  const set = new Set<string>();
  for (const l of locations) if (l.tipo) set.add(l.tipo);
  return Array.from(set).sort((a, b) => tipoLabel(a).localeCompare(tipoLabel(b), "es"));
}

export function uniqueRegions(): string[] {
  const set = new Set<string>();
  for (const l of locations) if (l.region) set.add(l.region);
  return Array.from(set).sort();
}

export function countByTipo(): { tipo: string; label: string; count: number }[] {
  const map = new Map<string, number>();
  for (const l of locations) {
    if (!l.tipo) continue;
    map.set(l.tipo, (map.get(l.tipo) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([tipo, count]) => ({ tipo, label: tipoLabel(tipo), count }))
    .sort((a, b) => b.count - a.count);
}

export function countByRegion(): { region: string; count: number }[] {
  const map = new Map<string, number>();
  for (const l of locations) {
    if (!l.region) continue;
    map.set(l.region, (map.get(l.region) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([region, count]) => ({ region, count }))
    .sort((a, b) => b.count - a.count);
}
