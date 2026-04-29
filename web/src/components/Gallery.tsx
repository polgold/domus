"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export type GalleryImage = {
  src: string;
  alt: string;
};

export function Gallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(
    () => setOpen((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const next = useCallback(
    () => setOpen((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, prev, next]);

  if (images.length === 0) {
    return (
      <p className="text-sm text-[color:var(--ink-mute)] italic">
        Esta locación todavía no tiene galería disponible. Pedinos las fotos extra al cotizar.
      </p>
    );
  }

  return (
    <>
      <ul
        className="gap-3 sm:gap-4 [column-fill:_balance] columns-1 sm:columns-2 lg:columns-3"
        style={{ columnFill: "balance" }}
      >
        {images.map((img, i) => (
          <li
            key={img.src}
            className="mb-3 sm:mb-4 break-inside-avoid reveal"
            style={{ ["--i" as string]: Math.min(i, 16) } as React.CSSProperties}
          >
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Abrir foto ${i + 1} de ${images.length} — ${img.alt}`}
              className="img-zoom block relative w-full overflow-hidden bg-[color:var(--line)]/40 group"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={1600}
                height={1067}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="w-full h-auto object-cover"
                loading={i < 6 ? "eager" : "lazy"}
              />
            </button>
          </li>
        ))}
      </ul>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Galería de ${name}, foto ${open + 1} de ${images.length}`}
          className="fixed inset-0 z-50 bg-black/92 lightbox-enter"
          onClick={close}
        >
          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-10">
            <Image
              key={images[open].src}
              src={images[open].src}
              alt={images[open].alt}
              fill
              sizes="100vw"
              priority
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label="Cerrar galería"
            className="btn-press absolute top-4 right-4 sm:top-6 sm:right-6 text-white/85 hover:text-white p-2.5 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm"
          >
            <X size={22} strokeWidth={1.75} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Foto anterior"
            className="btn-press absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 text-white/85 hover:text-white p-3 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm"
          >
            <ChevronLeft size={26} strokeWidth={1.75} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Foto siguiente"
            className="btn-press absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 text-white/85 hover:text-white p-3 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm"
          >
            <ChevronRight size={26} strokeWidth={1.75} />
          </button>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/80 text-xs font-mono tabular tracking-wider px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm">
            {String(open + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </div>
        </div>
      )}
    </>
  );
}
