import { MessageCircleMore } from "lucide-react";

import { buildGlobalWhatsAppUrl } from "../lib/api";

export function WhatsAppFloat() {
  return (
    <a
      href={buildGlobalWhatsAppUrl("Assalamualaikum, I want to know more about GoGreenTech Learning Academy.")}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-3.5 py-3 text-sm font-semibold text-white shadow-2xl shadow-emerald-900/20 transition hover:bg-[var(--brand-deep)] sm:bottom-5 sm:right-5 sm:gap-3 sm:px-5 sm:text-base"
    >
      <MessageCircleMore className="size-5" />
      <span className="sm:hidden">Chat</span>
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
