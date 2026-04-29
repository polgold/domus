import type { Metadata } from "next";
import { Suspense } from "react";
import { catalog, locations, countByRegion, countByTipo } from "@/data/locations";
import { applyFilters, parseFilters } from "@/lib/filters";
import { FilterBar } from "@/components/FilterBar";
import { LocationCard } from "@/components/LocationCard";

export const metadata: Metadata = {
  title: "Catálogo de locaciones",
  description: `${catalog.count} locaciones para producciones audiovisuales y fotográficas en CABA y Buenos Aires.`,
  alternates: { canonical: "/locaciones" },
};

type SearchParams = Promise<{ [k: string]: string | string[] | undefined }>;

export default async function LocacionesPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const state = parseFilters(sp);
  const filtered = applyFilters(locations, state);

  const regionCounts = countByRegion();
  const tipoCounts = countByTipo();

  return (
    <div>
      <header className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-10 pb-8 sm:pt-14 sm:pb-10">
        <p className="font-mono tabular text-[0.72rem] uppercase tracking-[0.18em] text-[color:var(--ink-mute)] mb-4">
          Catálogo
        </p>
        <h1 className="serif-tight text-[2.6rem] sm:text-[3.6rem] lg:text-[4.4rem] font-light max-w-[18ch]">
          {catalog.count} locaciones,
          <br />
          una agenda.
        </h1>
        <p className="mt-5 text-[color:var(--ink-soft)] max-w-[60ch] leading-relaxed">
          Filtrá por región, tipo de espacio o buscá por nombre. Cada ficha tiene la galería completa,
          datos clave y un canal directo para cotizar.
        </p>
      </header>

      <Suspense fallback={null}>
        <FilterBar
          regions={regionCounts.map((r) => ({ value: r.region, label: r.region, count: r.count }))}
          tipos={tipoCounts.map((t) => ({ value: t.tipo, label: t.label, count: t.count }))}
          total={filtered.length}
        />
      </Suspense>

      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 py-10 sm:py-14">
        {filtered.length === 0 ? (
          <div className="border hairline rounded-2xl p-10 sm:p-16 text-center bg-[color:var(--bg-elev)]">
            <p className="font-display text-2xl tracking-tight mb-2">Sin resultados</p>
            <p className="text-[color:var(--ink-soft)] max-w-[40ch] mx-auto">
              Probá quitar algún filtro o escribinos directamente — capaz tenemos una opción que no
              está todavía publicada.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10 sm:gap-x-6 sm:gap-y-14">
            {filtered.map((l, i) => (
              <LocationCard key={l.slug} location={l} index={Math.min(i, 18)} priority={i < 8} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
