import { MessageCircle, Mail } from "lucide-react";
import type { Location } from "@/data/locations";
import { whatsappUrl, emailUrl } from "@/lib/quote";

export function MobileCta({ location }: { location: Location }) {
  const wa = whatsappUrl(location);
  const mail = emailUrl(location);
  const id = String(location.id).padStart(2, "0");

  return (
    <div className="lg:hidden fixed bottom-3 inset-x-3 z-30 flex gap-2 pointer-events-none">
      <a
        href={wa}
        target="_blank"
        rel="noopener"
        className="btn-press pointer-events-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-full bg-[color:var(--ink)] text-[color:var(--bg)] text-sm shadow-[0_6px_24px_-12px_rgba(20,17,13,0.5)]"
        aria-label={`Cotizar locación N° ${id} por WhatsApp`}
      >
        <MessageCircle size={16} strokeWidth={1.75} aria-hidden />
        Cotizar N° {id}
      </a>
      <a
        href={mail}
        className="btn-press pointer-events-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-full bg-[color:var(--accent)] text-white text-sm shadow-[0_6px_24px_-12px_rgba(178,83,64,0.7)]"
        aria-label={`Consultar por email por la locación N° ${id}`}
      >
        <Mail size={16} strokeWidth={1.75} aria-hidden />
        Email
      </a>
    </div>
  );
}
