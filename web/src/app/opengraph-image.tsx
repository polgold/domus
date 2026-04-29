import { ImageResponse } from "next/og";
import { catalog } from "@/data/locations";

export const alt = `${catalog.company} — Locaciones para producciones`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
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
          background: "linear-gradient(140deg, #faf8f3 0%, #f0d6cc 100%)",
          color: "#14110d",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#7a756c",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 14,
              height: 14,
              background: "#b25340",
              borderRadius: 999,
              marginRight: 14,
            }}
          />
          <span style={{ display: "flex" }}>{catalog.company}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 96,
              lineHeight: 1,
              letterSpacing: -3,
              fontWeight: 300,
              maxWidth: 980,
              marginBottom: 24,
            }}
          >
            <span style={{ display: "flex" }}>Locaciones para&nbsp;</span>
            <span style={{ display: "flex", color: "#8f3d2c", fontStyle: "italic" }}>producir&nbsp;</span>
            <span style={{ display: "flex" }}>sin improvisar.</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#4a463f",
              maxWidth: 900,
              fontFamily: "system-ui",
            }}
          >
            {catalog.count} locaciones en CABA y Buenos Aires — disponibles para producciones
            audiovisuales y fotográficas.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#4a463f",
            fontFamily: "system-ui",
          }}
        >
          <span style={{ display: "flex" }}>domuslocaciones.com.ar</span>
          <span style={{ display: "flex" }}>@{catalog.instagram}</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
