import { catalog, tipoLabel, type Location } from "@/data/locations";

/**
 * Pre-fill del Google Form para "locación de interés".
 * Requiere acceso de edición al form: abrir en docs.google.com/forms,
 * (︙) → "Get pre-filled link", llenar el campo y copiar el `entry.NNN` resultante.
 * Hasta que se setee, el form se abre genérico — WhatsApp y email ya viajan
 * con el N° de locación, así que no hay pérdida de información.
 */
const FORM_ENTRY_LOCATION = "" as const;

export function locationCode(loc: Location): string {
  return `N° ${String(loc.id).padStart(2, "0")}`;
}

export function locationDisplay(loc: Location): string {
  return `${locationCode(loc)} — ${loc.name}`;
}

export function whatsappUrl(loc?: Location | null): string {
  const base = `https://wa.me/${catalog.whatsapp}`;
  if (!loc) return base;
  const text = `Hola Domus, me interesa la locación ${locationCode(loc)} ${loc.name}. ¿Me pasan disponibilidad y presupuesto?`;
  return `${base}?text=${encodeURIComponent(text)}`;
}

export function emailUrl(loc?: Location | null): string {
  const subject = loc
    ? `Consulta — ${locationCode(loc)} ${loc.name}`
    : "Consulta de presupuesto";
  const meta = loc
    ? `${tipoLabel(loc.tipo)}${loc.region ? `, ${loc.region}` : ""}`
    : "";
  const body = loc
    ? [
        `Hola Domus,`,
        ``,
        `Me interesa la locación ${locationCode(loc)} — ${loc.name}${meta ? ` (${meta})` : ""}.`,
        ``,
        `Tipo de producción: `,
        `Fechas tentativas: `,
        `Duración estimada: `,
        ``,
        `Gracias.`,
      ].join("\n")
    : [
        `Hola Domus,`,
        ``,
        `Quiero cotizar una producción.`,
        ``,
        `Tipo de producción: `,
        `Fechas tentativas: `,
        `Locación de referencia: `,
        ``,
        `Gracias.`,
      ].join("\n");
  return `mailto:${catalog.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function formUrl(loc?: Location | null): string {
  const base = catalog.contact_form;
  if (!loc) return base;
  if (!FORM_ENTRY_LOCATION) return base;
  const value = `${locationCode(loc)} — ${loc.name}`;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}usp=pp_url&${FORM_ENTRY_LOCATION}=${encodeURIComponent(value)}`;
}
