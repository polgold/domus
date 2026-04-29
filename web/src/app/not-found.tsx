import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-24 sm:py-32 text-center">
      <p className="font-mono tabular text-[0.72rem] uppercase tracking-[0.18em] text-[color:var(--ink-mute)] mb-4">
        Error 404
      </p>
      <h1 className="serif-tight text-[3rem] sm:text-[4.5rem] font-light max-w-[18ch] mx-auto">
        Esta locación no figura
        <br />
        <span className="italic text-[color:var(--accent-deep)]">en el catálogo.</span>
      </h1>
      <p className="mt-6 text-[color:var(--ink-soft)] max-w-[48ch] mx-auto">
        La URL que abriste no existe o la locación fue movida. Volvé al catálogo o escribinos para
        ayudarte.
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/locaciones"
          className="btn-press inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[color:var(--ink)] text-[color:var(--bg)] text-sm"
        >
          Ver el catálogo
        </Link>
        <Link
          href="/"
          className="btn-press inline-flex items-center gap-2 px-6 py-3.5 rounded-full border hairline text-sm hover:border-[color:var(--ink-soft)]"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
