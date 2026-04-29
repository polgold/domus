import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MessageCircle, FileText, ShieldCheck, Wallet, Camera } from "lucide-react";
import { catalog } from "@/data/locations";

export const metadata: Metadata = {
  title: "Sumá tu locación",
  description:
    "Si tenés una casa, departamento, galpón o un espacio fuera de lo común, sumalo a Domus. Comisión sobre producciones concretadas, sin costo previo.",
  alternates: { canonical: "/sumate" },
};

export default function SumatePage() {
  const wa = `https://wa.me/${catalog.whatsapp}?text=${encodeURIComponent(
    "Hola Domus, tengo un espacio que me gustaría sumar al catálogo."
  )}`;

  const points = [
    {
      icon: ShieldCheck,
      t: "Sin costo de alta",
      d: "No cobramos por incorporar tu espacio. Solo trabajamos con comisión cuando se concreta una producción.",
    },
    {
      icon: Wallet,
      t: "Tarifas claras",
      d: "Definimos juntos un precio por hora y jornada. Reservas con 50% de seña y el saldo antes de filmar.",
    },
    {
      icon: Camera,
      t: "Material en alta",
      d: "Coordinamos un scouting fotográfico para que tu locación se vea bien en el catálogo y atraiga producciones serias.",
    },
  ];

  const tipos = [
    "Casas y PHs",
    "Departamentos con vista o cúpula",
    "Casas de campo y quintas",
    "Cabañas",
    "Bares, restaurantes y almacenes",
    "Teatros, clubes y palacios",
    "Galpones, locales y oficinas",
    "Estacionamientos y estaciones de servicio",
    "Espacios trash, hospitales y rincones únicos",
  ];

  return (
    <div>
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-12 pb-10 sm:pt-20 sm:pb-14 grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 items-end">
        <div className="reveal">
          <p className="font-mono tabular text-[0.72rem] uppercase tracking-[0.18em] text-[color:var(--ink-mute)] mb-4">
            Para dueños de espacios
          </p>
          <h1 className="serif-tight text-[2.8rem] sm:text-[4rem] lg:text-[5rem] font-light max-w-[16ch]">
            Sumá tu lugar al
            <br />
            <span className="italic text-[color:var(--accent-deep)]">catálogo</span> de Domus.
          </h1>
          <p className="mt-7 text-[color:var(--ink-soft)] leading-relaxed text-base sm:text-lg max-w-[55ch]">
            Conectamos tu propiedad con productoras de cine, publicidad, ficción y editoriales de
            moda. Vos decidís cuándo, durante cuánto tiempo y bajo qué condiciones se usa.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={catalog.sumate_form}
              target="_blank"
              rel="noopener"
              className="btn-press inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[color:var(--ink)] text-[color:var(--bg)] text-sm"
            >
              <FileText size={16} strokeWidth={1.75} aria-hidden />
              Postular mi locación
            </a>
            <a
              href={wa}
              target="_blank"
              rel="noopener"
              className="btn-press inline-flex items-center gap-2 px-6 py-3.5 rounded-full border hairline hover:border-[color:var(--ink-soft)] text-sm"
            >
              <MessageCircle size={16} strokeWidth={1.75} aria-hidden />
              Hablar por WhatsApp
            </a>
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-3 reveal">
          {points.map((p, i) => {
            const Icon = p.icon;
            return (
              <li
                key={p.t}
                className="border hairline rounded-2xl p-6 bg-[color:var(--bg-elev)] reveal"
                style={{ ["--i" as string]: i + 1 } as React.CSSProperties}
              >
                <div className="flex items-start gap-4">
                  <span className="shrink-0 w-10 h-10 rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent-deep)] inline-flex items-center justify-center">
                    <Icon size={18} strokeWidth={1.75} aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-lg tracking-tight mb-1">{p.t}</h3>
                    <p className="text-sm text-[color:var(--ink-soft)] leading-relaxed">{p.d}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="border-t hairline">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12">
          <div>
            <p className="font-mono tabular text-[0.72rem] uppercase tracking-[0.18em] text-[color:var(--ink-mute)] mb-4">
              Qué buscamos
            </p>
            <h2 className="serif-tight text-[2.2rem] sm:text-[3rem] font-light max-w-[18ch]">
              Espacios con personalidad y un dueño dispuesto.
            </h2>
            <p className="mt-6 text-[color:var(--ink-soft)] leading-relaxed max-w-[44ch]">
              No hace falta que sea espectacular: muchas producciones buscan justamente lo cotidiano,
              lo gastado, lo poco curado. Lo importante es que esté disponible y bien fotografiado.
            </p>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 sm:self-end">
            {tipos.map((t, i) => (
              <li
                key={t}
                className="text-[color:var(--ink-soft)] py-3 border-b hairline reveal"
                style={{ ["--i" as string]: i } as React.CSSProperties}
              >
                <span className="font-mono tabular text-[0.7rem] text-[color:var(--accent)] mr-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t hairline bg-[color:var(--bg-elev)]/50">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-14 sm:py-20 flex flex-col lg:flex-row lg:items-end gap-8 justify-between">
          <div>
            <p className="font-mono tabular text-[0.72rem] uppercase tracking-[0.18em] text-[color:var(--ink-mute)] mb-3">
              Próximo paso
            </p>
            <h2 className="serif-tight text-[2.2rem] sm:text-[3rem] font-light max-w-[20ch]">
              Contanos qué tenés y coordinamos visita.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={catalog.sumate_form}
              target="_blank"
              rel="noopener"
              className="btn-press inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[color:var(--ink)] text-[color:var(--bg)] text-sm"
            >
              Postular mi locación
              <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden />
            </a>
            <Link
              href="/locaciones"
              className="btn-press inline-flex items-center gap-2 px-6 py-3.5 rounded-full border hairline text-sm hover:border-[color:var(--ink-soft)]"
            >
              Ver el catálogo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
