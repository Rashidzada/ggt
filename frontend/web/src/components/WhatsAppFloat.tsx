import { MessageCircleMore } from "lucide-react";

import { buildGlobalWhatsAppUrl } from "../lib/api";

export function WhatsAppFloat() {
  return (
    <a
      href={buildGlobalWhatsAppUrl("Assalamualaikum, I want to know more about GoGreenTech Learning Academy.")}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white shadow-2xl shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:bg-[var(--brand-deep)] sm:bottom-5 sm:right-5 sm:gap-3 sm:px-5 sm:text-base"
    >
      <span className="relative inline-flex">
        <span className="absolute inset-0 animate-ping rounded-full bg-white/25" />
        <MessageCircleMore className="relative z-10 size-5" />
      </span>
      <span className="sm:hidden">Chat</span>
      <span className="hidden sm:inline">Ask on WhatsApp</span>
    </a>
  );
}
