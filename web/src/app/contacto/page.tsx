import type { Metadata } from "next";
import { ArrowUpRight, MessageCircle, FileText, Mail } from "lucide-react";
import { catalog } from "@/data/locations";
import { whatsappUrl, emailUrl, formUrl } from "@/lib/quote";

function InstagramIcon({ size = 18, strokeWidth = 1.75 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Pedí presupuesto para una producción audiovisual o fotográfica, o consultanos por una locación específica del catálogo de Domus.",
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  const wa = whatsappUrl();
  const mail = emailUrl();
  const form = formUrl();

  return (
    <div>
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-12 sm:pt-20 pb-10 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 items-end">
        <div className="reveal">
          <p className="font-mono tabular text-[0.72rem] uppercase tracking-[0.18em] text-[color:var(--ink-mute)] mb-4">
            Cotizá tu producción
          </p>
          <h1 className="serif-tight text-[2.8rem] sm:text-[4rem] lg:text-[5rem] font-light max-w-[14ch]">
            Hablemos del
            <br />
            <span className="italic text-[color:var(--accent-deep)]">próximo</span> rodaje.
          </h1>
          <p className="mt-7 text-[color:var(--ink-soft)] leading-relaxed text-base sm:text-lg max-w-[55ch]">
            Contanos qué necesitás (ambientación, fechas, duración) y te respondemos con una
            pre-selección de locaciones acorde. La forma más rápida es WhatsApp; el formulario nos
            sirve cuando hay un brief más detallado.
          </p>
        </div>

        <ul className="grid gap-3 reveal">
          {[
            {
              icon: FileText,
              t: "Formulario de presupuesto",
              d: "Brief estructurado para que no se nos escape ningún dato. Te volvemos a contactar en el día.",
              href: form,
              external: true,
              cta: "Abrir formulario",
            },
            {
              icon: MessageCircle,
              t: "WhatsApp",
              d: `${catalog.phone} · de lunes a viernes, 10 a 19 hs.`,
              href: wa,
              external: true,
              cta: "Iniciar conversación",
            },
            {
              icon: Mail,
              t: "Email",
              d: `${catalog.email} · ideal para briefs largos o adjuntar referencias.`,
              href: mail,
              external: false,
              cta: "Escribir un mail",
            },
            {
              icon: InstagramIcon,
              t: "Instagram",
              d: `@${catalog.instagram} · catálogo en vivo, novedades y backstage de producciones.`,
              href: catalog.instagram_url,
              external: true,
              cta: "Ver perfil",
            },
          ].map((c, i) => {
            const Icon = c.icon;
            return (
              <li
                key={c.t}
                className="border hairline rounded-2xl bg-[color:var(--bg-elev)] reveal"
                style={{ ["--i" as string]: i + 1 } as React.CSSProperties}
              >
                <a
                  href={c.href}
                  {...(c.external ? { target: "_blank", rel: "noopener" } : {})}
                  className="card-lift block p-6 flex flex-col sm:flex-row sm:items-center gap-4 group"
                >
                  <span className="shrink-0 w-11 h-11 rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent-deep)] inline-flex items-center justify-center">
                    <Icon size={18} strokeWidth={1.75} aria-hidden />
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display text-lg tracking-tight">{c.t}</h3>
                    <p className="text-sm text-[color:var(--ink-soft)] leading-relaxed">{c.d}</p>
                  </div>
                  <span className="self-start sm:self-center inline-flex items-center gap-1.5 text-xs font-mono tabular uppercase tracking-wider text-[color:var(--ink-mute)] group-hover:text-[color:var(--accent-deep)]">
                    {c.cta}
                    <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="border-t hairline mt-16">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-3 gap-10">
          <div>
            <p className="font-mono tabular text-[0.7rem] uppercase tracking-[0.18em] text-[color:var(--ink-mute)] mb-2">
              Tarifas
            </p>
            <p className="text-[color:var(--ink-soft)] leading-relaxed text-sm">
              Por hora y por jornada. Variables según locación, día de semana, equipo de rodaje y
              modificaciones de arte.
            </p>
          </div>
          <div>
            <p className="font-mono tabular text-[0.7rem] uppercase tracking-[0.18em] text-[color:var(--ink-mute)] mb-2">
              Reservas
            </p>
            <p className="text-[color:var(--ink-soft)] leading-relaxed text-sm">
              Confirmamos con 50% de seña. El saldo se abona antes de la jornada. Devolución según
              fecha de cancelación.
            </p>
          </div>
          <div>
            <p className="font-mono tabular text-[0.7rem] uppercase tracking-[0.18em] text-[color:var(--ink-mute)] mb-2">
              En piso
            </p>
            <p className="text-[color:var(--ink-soft)] leading-relaxed text-sm">
              Domus presente el día de la producción para coordinar con el dueño y resolver cualquier
              imprevisto.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
