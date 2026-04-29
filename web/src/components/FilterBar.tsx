"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { Search, X, Shuffle, ArrowUpDown } from "lucide-react";
import { buildQuery, parseFilters } from "@/lib/filters";

type Option = { value: string; label: string; count: number };

type Props = {
  regions: Option[];
  tipos: Option[];
  total: number;
};

export function FilterBar({ regions, tipos, total }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const initial = useMemo(() => parseFilters(Object.fromEntries(sp.entries())), [sp]);
  const [q, setQ] = useState(initial.q);
  const [lastInitialQ, setLastInitialQ] = useState(initial.q);
  if (initial.q !== lastInitialQ) {
    setLastInitialQ(initial.q);
    setQ(initial.q);
  }

  const push = useCallback(
    (next: Partial<typeof initial>) => {
      const merged = { ...initial, ...next };
      const url = `${pathname}${buildQuery(merged)}`;
      startTransition(() => {
        router.push(url, { scroll: false });
      });
    },
    [initial, pathname, router]
  );

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    push({ q: q.trim() });
  };

  const toggleTipo = (value: string) => {
    const set = new Set(initial.tipos);
    if (set.has(value)) set.delete(value);
    else set.add(value);
    push({ tipos: Array.from(set) });
  };

  const setRegion = (value: string) => {
    push({ region: initial.region === value ? "" : value });
  };

  const toggleSort = () => {
    push({ sort: initial.sort === "random" ? "id" : "random" });
  };

  const clearAll = () => {
    setQ("");
    startTransition(() => router.push(pathname, { scroll: false }));
  };

  const hasFilters =
    Boolean(initial.q) || Boolean(initial.region) || initial.tipos.length > 0 || initial.sort === "random";

  return (
    <div
      className="border-y hairline bg-[color:var(--bg)]/85 backdrop-blur-md"
      data-pending={isPending ? "" : undefined}
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-5 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <form onSubmit={onSearch} className="flex-1 min-w-[220px] max-w-md relative">
            <Search
              size={16}
              strokeWidth={1.75}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--ink-mute)] pointer-events-none"
              aria-hidden
            />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nombre, tipo o región"
              aria-label="Buscar locaciones"
              className="w-full pl-10 pr-10 py-2.5 rounded-full bg-[color:var(--bg-elev)] border hairline text-sm placeholder:text-[color:var(--ink-mute)] focus:outline-none focus:border-[color:var(--ink-soft)] transition-colors"
            />
            {q && (
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  push({ q: "" });
                }}
                aria-label="Limpiar búsqueda"
                className="btn-press absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-[color:var(--ink-mute)] hover:bg-[color:var(--line)]"
              >
                <X size={14} strokeWidth={1.75} aria-hidden />
              </button>
            )}
          </form>

          <div className="flex items-center gap-1.5" role="tablist" aria-label="Región">
            {regions.map((r) => {
              const active = initial.region === r.value;
              return (
                <button
                  key={r.value}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setRegion(r.value)}
                  className={`btn-press text-sm px-3.5 py-2 rounded-full border ${
                    active
                      ? "bg-[color:var(--ink)] text-[color:var(--bg)] border-[color:var(--ink)]"
                      : "bg-[color:var(--bg-elev)] hairline text-[color:var(--ink-soft)] hover:text-[color:var(--ink)]"
                  }`}
                >
                  {r.label}
                  <span className="font-mono tabular ml-1.5 text-[0.7rem] opacity-70">{r.count}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={toggleSort}
            className="btn-press inline-flex items-center gap-1.5 text-xs sm:text-sm px-3 py-2 rounded-full border hairline bg-[color:var(--bg-elev)] text-[color:var(--ink-soft)] hover:text-[color:var(--ink)]"
            aria-label={initial.sort === "random" ? "Ordenar por número" : "Mezclar aleatorio"}
          >
            {initial.sort === "random" ? <Shuffle size={14} /> : <ArrowUpDown size={14} />}
            <span>{initial.sort === "random" ? "Aleatorio" : "Por número"}</span>
          </button>

          {hasFilters && (
            <button
              onClick={clearAll}
              className="btn-press text-xs sm:text-sm px-3 py-2 rounded-full text-[color:var(--accent-deep)] hover:underline underline-offset-4"
            >
              Limpiar
            </button>
          )}

          <span className="ml-auto font-mono tabular text-xs text-[color:var(--ink-mute)]">
            {total} {total === 1 ? "locación" : "locaciones"}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {tipos.map((t) => {
            const active = initial.tipos.includes(t.value);
            return (
              <button
                key={t.value}
                onClick={() => toggleTipo(t.value)}
                aria-pressed={active}
                className={`btn-press text-xs sm:text-[0.82rem] px-3 py-1.5 rounded-full border ${
                  active
                    ? "bg-[color:var(--accent-soft)] border-[color:var(--accent)] text-[color:var(--accent-deep)]"
                    : "border-[color:var(--line)] text-[color:var(--ink-soft)] hover:border-[color:var(--line-strong)] hover:text-[color:var(--ink)]"
                }`}
              >
                {t.label}
                <span className="font-mono tabular ml-1.5 opacity-60 text-[0.7rem]">{t.count}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
