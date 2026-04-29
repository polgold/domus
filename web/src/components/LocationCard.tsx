import Image from "next/image";
import Link from "next/link";
import type { Location } from "@/data/locations";
import { tipoLabel } from "@/data/locations";
import { countLocationImages, getCoverSrc } from "@/lib/images";

type Props = {
  location: Location;
  index?: number;
  priority?: boolean;
  sizes?: string;
  aspectClass?: string;
};

export function LocationCard({
  location,
  index = 0,
  priority = false,
  sizes = "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw",
  aspectClass = "aspect-[4/3]",
}: Props) {
  const cover = getCoverSrc(location.slug);
  const realCount = countLocationImages(location.slug);
  const id = String(location.id).padStart(2, "0");
  return (
    <Link
      href={`/locaciones/${location.slug}`}
      className="card-lift block group reveal"
      style={{ ["--i" as string]: index } as React.CSSProperties}
      aria-label={`${location.name} — ${tipoLabel(location.tipo)} — ${realCount} fotos`}
    >
      <div className={`relative w-full ${aspectClass} overflow-hidden bg-[color:var(--line)]/40 img-zoom`}>
        <Image
          src={cover}
          alt={`${location.name} — vista principal`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
        <div className="absolute top-3 left-3 z-10">
          <span className="font-mono tabular text-[0.68rem] tracking-wider px-2 py-1 bg-[color:var(--bg)]/85 text-[color:var(--ink)] rounded-full backdrop-blur-sm">
            {id}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 z-10">
          <span className="font-mono tabular text-[0.65rem] uppercase tracking-wider px-2 py-1 text-white bg-black/35 rounded-full backdrop-blur-sm">
            {realCount} {realCount === 1 ? "foto" : "fotos"}
          </span>
        </div>
      </div>

      <div className="pt-3 sm:pt-4 pb-1 flex items-baseline justify-between gap-3">
        <h3 className="font-display text-lg sm:text-[1.35rem] leading-snug tracking-tight text-[color:var(--ink)] group-hover:text-[color:var(--accent-deep)] transition-colors duration-200">
          {location.name}
        </h3>
      </div>
      <div className="text-xs sm:text-sm text-[color:var(--ink-mute)] flex items-center gap-2">
        <span>{tipoLabel(location.tipo)}</span>
        {location.region && (
          <>
            <span aria-hidden className="opacity-40">·</span>
            <span>{location.region}</span>
          </>
        )}
      </div>
    </Link>
  );
}
