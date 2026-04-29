import { tipoLabel, type Location } from "@/data/locations";

export type FilterState = {
  q: string;
  region: string;
  tipos: string[];
  sort: "id" | "random";
};

export function parseFilters(sp: { [k: string]: string | string[] | undefined }): FilterState {
  const get = (k: string) => {
    const v = sp[k];
    if (Array.isArray(v)) return v[0] ?? "";
    return v ?? "";
  };
  const tiposParam = get("tipos");
  const tipos = tiposParam ? tiposParam.split(",").filter(Boolean) : [];
  const sort = (get("sort") as FilterState["sort"]) || "id";
  return {
    q: get("q").toLowerCase(),
    region: get("region"),
    tipos,
    sort: sort === "random" ? "random" : "id",
  };
}

export function applyFilters(locations: Location[], state: FilterState): Location[] {
  let out = locations.slice();
  if (state.region) {
    out = out.filter((l) => l.region === state.region);
  }
  if (state.tipos.length > 0) {
    const set = new Set(state.tipos);
    out = out.filter((l) => l.tipo && set.has(l.tipo));
  }
  if (state.q) {
    const q = state.q.trim();
    out = out.filter((l) => {
      const hay =
        `${l.name} ${tipoLabel(l.tipo)} ${l.region ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }
  if (state.sort === "random") {
    out = out.slice();
    out.sort(() => Math.random() - 0.5);
  } else {
    out.sort((a, b) => a.id - b.id);
  }
  return out;
}

export function buildQuery(state: Partial<FilterState>): string {
  const params = new URLSearchParams();
  if (state.q) params.set("q", state.q);
  if (state.region) params.set("region", state.region);
  if (state.tipos && state.tipos.length > 0) params.set("tipos", state.tipos.join(","));
  if (state.sort === "random") params.set("sort", "random");
  const s = params.toString();
  return s ? `?${s}` : "";
}
