import Image from "next/image";
import Link from "next/link";
import { catalog } from "@/data/locations";

export function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[color:var(--bg)]/85 border-b hairline">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 h-16 flex items-center justify-between gap-6">
        <Link
          href="/"
          aria-label={`${catalog.company} — inicio`}
          className="flex items-center gap-2.5 btn-press"
        >
          <Image
            src="/logo_domus.png"
            alt=""
            width={32}
            height={32}
            priority
            className="h-7 w-7 object-contain"
          />
          <span className="font-display text-[1.05rem] tracking-tight text-[color:var(--ink)]">
            {catalog.company}
          </span>
        </Link>

        <nav aria-label="Principal" className="flex items-center gap-1 sm:gap-2 text-sm">
          <Link
            href="/locaciones"
            className="btn-press px-3 py-2 rounded-full text-[color:var(--ink-soft)] hover:text-[color:var(--ink)]"
          >
            Locaciones
          </Link>
          <Link
            href="/sumate"
            className="btn-press hidden sm:inline-block px-3 py-2 rounded-full text-[color:var(--ink-soft)] hover:text-[color:var(--ink)]"
          >
            Sumate
          </Link>
          <Link
            href="/contacto"
            className="btn-press inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[color:var(--ink)] text-[color:var(--bg)] hover:bg-[color:var(--accent-deep)]"
          >
            Cotizá tu producción
          </Link>
        </nav>
      </div>
    </header>
  );
}
