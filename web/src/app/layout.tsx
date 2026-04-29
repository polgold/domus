import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { catalog } from "@/data/locations";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://domuslocaciones.com.ar";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${catalog.company} — Locaciones para producciones audiovisuales y fotográficas`,
    template: `%s — ${catalog.company}`,
  },
  description: catalog.tagline,
  keywords: [
    "locaciones",
    "producción audiovisual",
    "producción fotográfica",
    "locaciones CABA",
    "locaciones Buenos Aires",
    "casas para filmar",
    "locaciones para publicidad",
    "Domus Locaciones",
  ],
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: SITE_URL,
    siteName: catalog.company,
    title: catalog.company,
    description: catalog.tagline,
  },
  twitter: {
    card: "summary_large_image",
    title: catalog.company,
    description: catalog.tagline,
  },
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es-AR"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}
    >
      <body className="min-h-[100dvh] flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
