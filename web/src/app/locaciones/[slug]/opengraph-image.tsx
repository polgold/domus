import { ImageResponse } from "next/og";
import { getLocation, tipoLabel, locations } from "@/data/locations";

export const alt = "Locación de Domus";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locations.map((l) => ({ slug: l.slug }));
}

type Params = Promise<{ slug: string }>;

export default async function OG({ params }: { params: Params }) {
  const { slug } = await params;
  const loc = getLocation(slug);
  const name = loc?.name ?? "Locación";
  const meta = loc ? `${tipoLabel(loc.tipo)}${loc.region ? ` · ${loc.region}` : ""}` : "Domus";
  const id = loc ? String(loc.id).padStart(2, "0") : "—";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(160deg, #14110d 0%, #2b1d18 60%, #8f3d2c 100%)",
          color: "#faf8f3",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "rgba(250,248,243,0.7)",
            fontFamily: "system-ui",
          }}
        >
          <span style={{ display: "flex" }}>Domus Locaciones</span>
          <span style={{ display: "flex" }}>N° {id}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "rgba(250,248,243,0.78)",
              fontFamily: "system-ui",
              letterSpacing: 1,
              marginBottom: 20,
            }}
          >
            {meta}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              lineHeight: 1,
              letterSpacing: -3,
              fontWeight: 300,
              maxWidth: 980,
            }}
          >
            {name}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: "rgba(250,248,243,0.7)",
            fontFamily: "system-ui",
          }}
        >
          <span style={{ display: "flex" }}>domuslocaciones.com.ar/locaciones/{slug}</span>
          <span style={{ display: "flex" }}>@domuslocaciones</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
