import Link from "next/link";
import Image from "next/image";
import { catalog } from "@/data/locations";

export function Footer() {
  return (
    <footer className="border-t hairline mt-24">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-14 grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2.5 mb-5">
            <Image src="/logo_domus.png" alt="" width={36} height={36} className="h-9 w-9 object-contain" />
            <span className="font-display text-xl tracking-tight">{catalog.company}</span>
          </Link>
          <p className="text-sm text-[color:var(--ink-mute)] max-w-[40ch] leading-relaxed">
            {catalog.tagline}
          </p>
        </div>

        <div className="text-sm">
          <h3 className="font-display text-base tracking-tight mb-3">Navegar</h3>
          <ul className="space-y-2 text-[color:var(--ink-soft)]">
            <li><Link href="/locaciones" className="hover:text-[color:var(--ink)]">Catálogo de locaciones</Link></li>
            <li><Link href="/sumate" className="hover:text-[color:var(--ink)]">Sumá tu locación</Link></li>
            <li><Link href="/contacto" className="hover:text-[color:var(--ink)]">Pedir presupuesto</Link></li>
          </ul>
        </div>

        <div className="text-sm">
          <h3 className="font-display text-base tracking-tight mb-3">Contacto</h3>
          <ul className="space-y-2 text-[color:var(--ink-soft)]">
            <li>
              <a href={`https://wa.me/${catalog.whatsapp}`} target="_blank" rel="noopener" className="hover:text-[color:var(--ink)]">
                WhatsApp · {catalog.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${catalog.email}`} className="hover:text-[color:var(--ink)]">
                {catalog.email}
              </a>
            </li>
            <li>
              <a href={catalog.instagram_url} target="_blank" rel="noopener" className="hover:text-[color:var(--ink)]">
                Instagram · @{catalog.instagram}
              </a>
            </li>
            <li>
              <a href={catalog.contact_form} target="_blank" rel="noopener" className="hover:text-[color:var(--ink)]">
                Formulario de presupuesto
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t hairline">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-xs text-[color:var(--ink-mute)]">
          <p>© {new Date().getFullYear()} {catalog.company}. Todos los derechos reservados.</p>
          <p>
            Diseño:{" "}
            <a href="https://exitmedia.com.ar" target="_blank" rel="noopener" className="text-[color:var(--ink-soft)] hover:text-[color:var(--ink)] underline-offset-4 hover:underline">ExitMedia</a>
            , una división de{" "}
            <a href="https://sunfactory.com.ar" target="_blank" rel="noopener" className="text-[color:var(--ink-soft)] hover:text-[color:var(--ink)] underline-offset-4 hover:underline">Sun Factory</a>.
          </p>
        </div>
      </div>
    </footer>
  );
}
