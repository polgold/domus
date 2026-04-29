import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle, FileText, FileDown, Mail } from "lucide-react";
import { catalog, getLocation, locations, tipoLabel } from "@/data/locations";
import { getCoverSrc, getLocationImages } from "@/lib/images";
import { whatsappUrl, emailUrl, formUrl } from "@/lib/quote";
import { Gallery } from "@/components/Gallery";
import { LocationCard } from "@/components/LocationCard";
import { MobileCta } from "@/components/MobileCta";

export function generateStaticParams() {
  return locations.map((l) => ({ slug: l.slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const loc = getLocation(slug);
  if (!loc) return {};
  const cover = getCoverSrc(slug);
  return {
    title: loc.name,
    description: `${tipoLabel(loc.tipo)}${loc.region ? ` en ${loc.region}` : ""}. Locación fotografiada y disponible para producciones audiovisuales y fotográficas.`,
    alternates: { canonical: `/locaciones/${slug}` },
    openGraph: {
      title: `${loc.name} — ${catalog.company}`,
      description: `${tipoLabel(loc.tipo)}${loc.region ? ` · ${loc.region}` : ""}`,
      images: [{ url: cover, alt: loc.name }],
    },
  };
}

function pickRelated(slug: string, tipo: string | null): typeof locations {
  const others = locations.filter((l) => l.slug !== slug);
  const sameTipo = others.filter((l) => l.tipo === tipo);
  if (sameTipo.length >= 3) return sameTipo.slice(0, 3);
  const fill = others.filter((l) => l.tipo !== tipo).slice(0, 3 - sameTipo.length);
  return [...sameTipo, ...fill].slice(0, 3);
}

export default async function LocationPage({ params }: { params: Params }) {
  const { slug } = await params;
  const loc = getLocation(slug);
  if (!loc) notFound();

  const allImages = getLocationImages(slug);
  const cover = allImages.find((i) => i.isCover) ?? allImages[0] ?? null;
  const galleryImages = loc.has_only_cover ? [] : allImages.filter((i) => !i.isCover);
  const related = pickRelated(slug, loc.tipo);
  const id = String(loc.id).padStart(2, "0");
  const realCount = allImages.length;

  const wa = whatsappUrl(loc);
  const mail = emailUrl(loc);
  const form = formUrl(loc);

  return (
    <div className="pb-28 lg:pb-0">
      {/* Breadcrumb */}
      <nav
        aria-label="Migas de pan"
        className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-7 pb-5 text-xs text-[color:var(--ink-mute)] flex items-center gap-1.5 flex-wrap"
      >
        <Link href="/" className="hover:text-[color:var(--ink)]">Inicio</Link>
        <span aria-hidden>·</span>
        <Link href="/locaciones" className="hover:text-[color:var(--ink)]">Locaciones</Link>
        {loc.tipo && (
          <>
            <span aria-hidden>·</span>
            <Link
              href={`/locaciones?tipos=${encodeURIComponent(loc.tipo)}`}
              className="hover:text-[color:var(--ink)]"
            >
              {tipoLabel(loc.tipo)}
            </Link>
          </>
        )}
        <span aria-hidden>·</span>
        <span className="text-[color:var(--ink)]" aria-current="page">{loc.name}</span>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-[1fr_18rem] gap-8 lg:gap-12 items-start">
        <div>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="font-mono tabular text-xs text-[color:var(--accent)]">N° {id}</span>
            <span aria-hidden className="text-[color:var(--line-strong)]">·</span>
            <span className="font-mono tabular text-[0.72rem] uppercase tracking-[0.18em] text-[color:var(--ink-mute)]">
              {tipoLabel(loc.tipo)}
              {loc.region && ` — ${loc.region}`}
            </span>
          </div>

          <h1 className="serif-tight text-[2.6rem] sm:text-[3.6rem] lg:text-[4.4rem] font-light max-w-[20ch]">
            {loc.name}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[color:var(--ink-soft)]">
            <span className="font-mono tabular text-[color:var(--ink-mute)]">
              {realCount} {realCount === 1 ? "foto en alta" : "fotos en alta"}
            </span>
            {loc.docs.length > 0 && (
              <span className="font-mono tabular text-[color:var(--ink-mute)]">
                {loc.docs.length} {loc.docs.length === 1 ? "documento" : "documentos"}
              </span>
            )}
          </div>

          {cover && (
            <div className="mt-8 relative aspect-[16/10] w-full overflow-hidden bg-[color:var(--line)]/40 reveal">
              <Image
                src={cover.src}
                alt={cover.alt}
                fill
                priority
                sizes="(min-width: 1024px) 70vw, 100vw"
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Sidebar CTA — desktop sticky */}
        <aside className="hidden lg:block lg:sticky lg:top-24">
          <div className="border hairline rounded-2xl bg-[color:var(--bg-elev)] p-6">
            <p className="font-mono tabular text-[0.7rem] uppercase tracking-[0.18em] text-[color:var(--ink-mute)] mb-3">
              Cotizá la locación N° {id}
            </p>
            <p className="text-sm text-[color:var(--ink-soft)] leading-relaxed mb-5">
              Tarifas por hora, jornada y media jornada. Reserva con 50% de seña. Te respondemos en
              el día.
            </p>

            <a
              href={wa}
              target="_blank"
              rel="noopener"
              className="btn-press w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[color:var(--ink)] text-[color:var(--bg)] text-sm hover:bg-[color:var(--accent-deep)]"
            >
              <MessageCircle size={15} strokeWidth={1.75} aria-hidden />
              Cotizar por WhatsApp
            </a>
            <a
              href={mail}
              className="btn-press mt-2 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border hairline text-sm hover:border-[color:var(--ink-soft)]"
            >
              <Mail size={15} strokeWidth={1.75} aria-hidden />
              Escribir por email
            </a>
            <a
              href={form}
              target="_blank"
              rel="noopener"
              className="btn-press mt-3 w-full inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-[color:var(--ink-mute)] hover:text-[color:var(--ink)] text-xs"
            >
              <FileText size={13} strokeWidth={1.75} aria-hidden />
              Brief largo · formulario
            </a>
            <p className="mt-3 text-[11px] text-[color:var(--ink-mute)] leading-relaxed">
              WhatsApp y email ya viajan con el código <span className="font-mono tabular text-[color:var(--ink-soft)]">N° {id}</span>. Si abrís el formulario, mencionalo en el primer campo.
            </p>

            {loc.docs.length > 0 && (
              <div className="mt-6 pt-5 border-t hairline">
                <p className="font-mono tabular text-[0.7rem] uppercase tracking-[0.18em] text-[color:var(--ink-mute)] mb-3">
                  Material adicional
                </p>
                <ul className="space-y-2">
                  {loc.docs.map((d) => {
                    const fileName = d.split("/").pop() ?? d;
                    return (
                      <li key={d} className="text-sm">
                        <span className="inline-flex items-center gap-2 text-[color:var(--ink-soft)]">
                          <FileDown size={13} strokeWidth={1.75} aria-hidden />
                          {fileName}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="mt-6 pt-5 border-t hairline text-xs text-[color:var(--ink-mute)] space-y-1">
              <p>{catalog.phone}</p>
              <p>
                <a href={`mailto:${catalog.email}`} className="hover:text-[color:var(--ink)]">
                  {catalog.email}
                </a>
              </p>
            </div>
          </div>
        </aside>
      </section>

      {/* Galería */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-12 sm:pt-20">
        <div className="flex items-baseline gap-4 mb-8">
          <h2 className="font-display text-2xl sm:text-3xl tracking-tight">Galería</h2>
          <span className="font-mono tabular text-xs text-[color:var(--ink-mute)]">
            {galleryImages.length} {galleryImages.length === 1 ? "foto" : "fotos"}
          </span>
        </div>
        <Gallery images={galleryImages} name={loc.name} />
      </section>

      {/* Relacionadas */}
      {related.length > 0 && (
        <section className="border-t hairline mt-20">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-14 sm:py-20">
            <p className="font-mono tabular text-[0.72rem] uppercase tracking-[0.18em] text-[color:var(--ink-mute)] mb-3">
              Seguir mirando
            </p>
            <h2 className="serif-tight text-[2rem] sm:text-[2.6rem] font-light mb-10 max-w-[28ch]">
              Otras locaciones del mismo registro.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10 sm:gap-x-6 sm:gap-y-12">
              {related.map((r, i) => (
                <LocationCard key={r.slug} location={r} index={i} />
              ))}
            </div>
            <div className="mt-10">
              <Link
                href="/locaciones"
                className="btn-press inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border hairline text-sm hover:border-[color:var(--ink-soft)]"
              >
                <ArrowLeft size={14} strokeWidth={1.75} aria-hidden />
                Volver al catálogo
              </Link>
            </div>
          </div>
        </section>
      )}

      <MobileCta location={loc} />
    </div>
  );
}
