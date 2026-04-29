import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MessageCircle, FileText } from "lucide-react";
import { catalog, countByTipo, locations } from "@/data/locations";
import { getCoverSrc } from "@/lib/images";
import { whatsappUrl, formUrl } from "@/lib/quote";
import { LocationCard } from "@/components/LocationCard";

function pickHeroCovers(): { slug: string; src: string; name: string }[] {
  const featured = locations.filter((l) => !l.has_only_cover && l.images_count >= 4);
  const seed = (s: string) =>
    s.split("").reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) >>> 0, 7);
  return featured
    .map((l) => ({ l, k: seed(l.slug) }))
    .sort((a, b) => a.k - b.k)
    .slice(0, 5)
    .map(({ l }) => ({ slug: l.slug, src: getCoverSrc(l.slug), name: l.name }));
}

export default function Home() {
  const tipos = countByTipo();
  const heroCovers = pickHeroCovers();
  const featured = locations.slice(0, 8);
  const wa = whatsappUrl();
  const form = formUrl();

  return (
    <div>
      {/* HERO — asymmetric split */}
      <section className="relative">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-10 pb-12 sm:pt-16 sm:pb-20 grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-end">
          <div className="reveal" style={{ ["--i" as string]: 0 } as React.CSSProperties}>
            <p className="font-mono tabular text-[0.72rem] uppercase tracking-[0.18em] text-[color:var(--ink-mute)] mb-6">
              Catálogo · {catalog.count} locaciones · CABA & Buenos Aires
            </p>
            <h1 className="serif-tight text-[3.2rem] sm:text-[4.4rem] lg:text-[5.6rem] xl:text-[6.4rem] font-light text-[color:var(--ink)]">
              Locaciones para
              <br />
              <span className="italic text-[color:var(--accent-deep)]">producir</span> sin
              improvisar.
            </h1>
            <p className="mt-7 max-w-[52ch] text-[color:var(--ink-soft)] leading-relaxed text-base sm:text-lg">
              {catalog.tagline} Casas, departamentos, palacios, galpones y rincones poco
              obvios — fotografiados, pre-aprobados y listos para tu próxima producción
              audiovisual o fotográfica.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/locaciones"
                className="btn-press inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[color:var(--ink)] text-[color:var(--bg)] text-sm sm:text-[0.95rem]"
              >
                Ver las {catalog.count} locaciones
                <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden />
              </Link>
              <Link
                href="/sumate"
                className="btn-press inline-flex items-center gap-2 px-6 py-3.5 rounded-full border hairline text-[color:var(--ink)] hover:border-[color:var(--ink-soft)] text-sm sm:text-[0.95rem]"
              >
                Sumá tu locación
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-5 text-xs text-[color:var(--ink-mute)]">
              <a
                href={wa}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1.5 hover:text-[color:var(--ink)]"
              >
                <MessageCircle size={13} strokeWidth={1.75} aria-hidden />
                {catalog.phone}
              </a>
              <a
                href={catalog.instagram_url}
                target="_blank"
                rel="noopener"
                className="hover:text-[color:var(--ink)]"
              >
                @{catalog.instagram}
              </a>
            </div>
          </div>

          <div
            className="relative grid grid-cols-6 grid-rows-[14rem_8rem_10rem] sm:grid-rows-[18rem_10rem_12rem] gap-2 sm:gap-3"
            aria-hidden
          >
            {heroCovers[0] && (
              <div
                className="col-span-4 row-span-2 relative overflow-hidden img-zoom reveal"
                style={{ ["--i" as string]: 1 } as React.CSSProperties}
              >
                <Image src={heroCovers[0].src} alt="" fill priority sizes="(min-width: 1024px) 30vw, 80vw" className="object-cover" />
              </div>
            )}
            {heroCovers[1] && (
              <div
                className="col-span-2 row-span-1 relative overflow-hidden img-zoom reveal"
                style={{ ["--i" as string]: 2 } as React.CSSProperties}
              >
                <Image src={heroCovers[1].src} alt="" fill priority sizes="(min-width: 1024px) 15vw, 40vw" className="object-cover" />
              </div>
            )}
            {heroCovers[2] && (
              <div
                className="col-span-2 row-span-1 relative overflow-hidden img-zoom reveal"
                style={{ ["--i" as string]: 3 } as React.CSSProperties}
              >
                <Image src={heroCovers[2].src} alt="" fill priority sizes="(min-width: 1024px) 15vw, 40vw" className="object-cover" />
              </div>
            )}
            {heroCovers[3] && (
              <div
                className="col-span-3 row-span-1 relative overflow-hidden img-zoom reveal"
                style={{ ["--i" as string]: 4 } as React.CSSProperties}
              >
                <Image src={heroCovers[3].src} alt="" fill sizes="(min-width: 1024px) 22vw, 50vw" className="object-cover" />
              </div>
            )}
            {heroCovers[4] && (
              <div
                className="col-span-3 row-span-1 relative overflow-hidden img-zoom reveal"
                style={{ ["--i" as string]: 5 } as React.CSSProperties}
              >
                <Image src={heroCovers[4].src} alt="" fill sizes="(min-width: 1024px) 22vw, 50vw" className="object-cover" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TIPOS */}
      <section className="border-t hairline">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-14 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[0.7fr_1.5fr] gap-8 lg:gap-16 items-end mb-10">
            <div>
              <p className="font-mono tabular text-[0.72rem] uppercase tracking-[0.18em] text-[color:var(--ink-mute)] mb-4">
                Por tipo de espacio
              </p>
              <h2 className="serif-tight text-[2.4rem] sm:text-[3.2rem] font-light">
                Casas, palacios,
                <br />
                galpones y todo lo intermedio.
              </h2>
            </div>
            <p className="text-[color:var(--ink-soft)] leading-relaxed max-w-[52ch] lg:justify-self-end">
              Cada locación está fichada por dentro y por fuera, con planos cuando aplica. Si tu
              guion pide algo distinto, también lo encontramos.
            </p>
          </div>

          <ul className="flex flex-wrap gap-2 sm:gap-2.5">
            {tipos.map((t, i) => (
              <li
                key={t.tipo}
                className="reveal"
                style={{ ["--i" as string]: i } as React.CSSProperties}
              >
                <Link
                  href={`/locaciones?tipos=${encodeURIComponent(t.tipo)}`}
                  className="btn-press group inline-flex items-baseline gap-2 px-4 py-2.5 rounded-full border hairline bg-[color:var(--bg-elev)] text-[color:var(--ink-soft)] hover:text-[color:var(--ink)] hover:border-[color:var(--ink-soft)] text-sm"
                >
                  <span className="font-display tracking-tight">{t.label}</span>
                  <span className="font-mono tabular text-[0.72rem] text-[color:var(--ink-mute)] group-hover:text-[color:var(--accent-deep)]">
                    {String(t.count).padStart(2, "0")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CÓMO TRABAJAMOS */}
      <section className="border-t hairline bg-[color:var(--bg-elev)]/50">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-16 sm:py-24">
          <p className="font-mono tabular text-[0.72rem] uppercase tracking-[0.18em] text-[color:var(--ink-mute)] mb-4">
            Cómo trabajamos
          </p>
          <h2 className="serif-tight text-[2.4rem] sm:text-[3.2rem] font-light max-w-[24ch] mb-12 sm:mb-16">
            De la búsqueda a la llave en mano, sin que tengas que recorrer cada espacio.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x hairline -mx-5 sm:-mx-8">
            {[
              {
                n: "01",
                t: "Nos contás qué necesitás",
                d: "Un brief breve: ambientación, época, metros, exterior o interior, fechas tentativas. En 24 hs te pasamos una pre-selección con material en alta.",
              },
              {
                n: "02",
                t: "Coordinamos visita o scouting",
                d: "Si hay match, agendamos visita técnica con dirección de arte. Nos ocupamos de permisos, vecinos, energía, cocheras y todo lo que rodea la jornada.",
              },
              {
                n: "03",
                t: "Reservás con seña y filmás",
                d: "Confirmás con el 50% de seña. El día del rodaje hay alguien de Domus en piso para que la producción no se frene por nada.",
              },
            ].map((step, i) => (
              <div
                key={step.n}
                className="px-5 sm:px-8 py-10 reveal"
                style={{ ["--i" as string]: i } as React.CSSProperties}
              >
                <div className="font-mono tabular text-xs text-[color:var(--accent)] mb-5">{step.n}</div>
                <h3 className="font-display text-2xl tracking-tight mb-3 max-w-[20ch]">{step.t}</h3>
                <p className="text-[color:var(--ink-soft)] leading-relaxed text-[0.95rem] max-w-[42ch]">
                  {step.d}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-3">
            <a
              href={form}
              target="_blank"
              rel="noopener"
              className="btn-press inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[color:var(--ink)] text-[color:var(--bg)] text-sm"
            >
              <FileText size={16} strokeWidth={1.75} aria-hidden />
              Pedir presupuesto
            </a>
            <a
              href={wa}
              target="_blank"
              rel="noopener"
              className="btn-press inline-flex items-center gap-2 px-6 py-3.5 rounded-full border hairline text-[color:var(--ink)] hover:border-[color:var(--ink-soft)] text-sm"
            >
              <MessageCircle size={16} strokeWidth={1.75} aria-hidden />
              Hablar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* DESTACADAS */}
      <section className="border-t hairline">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-16 sm:py-24">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <p className="font-mono tabular text-[0.72rem] uppercase tracking-[0.18em] text-[color:var(--ink-mute)] mb-4">
                Selección reciente
              </p>
              <h2 className="serif-tight text-[2.4rem] sm:text-[3.2rem] font-light">
                Algunas locaciones del catálogo.
              </h2>
            </div>
            <Link
              href="/locaciones"
              className="btn-press hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border hairline text-sm hover:border-[color:var(--ink-soft)]"
            >
              Ver todas
              <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10 sm:gap-x-6 sm:gap-y-12">
            {featured.map((l, i) => (
              <LocationCard key={l.slug} location={l} index={i} priority={i < 4} />
            ))}
          </div>

          <div className="mt-10 sm:hidden">
            <Link
              href="/locaciones"
              className="btn-press inline-flex items-center gap-2 px-5 py-3 rounded-full border hairline text-sm hover:border-[color:var(--ink-soft)]"
            >
              Ver todas las {catalog.count} locaciones
              <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
