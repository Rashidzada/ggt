import { ArrowRight, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

import { YOUTUBE_CHANNEL_HANDLE } from "../lib/brand-links";
import { useAuth } from "../hooks/useAuth";
import { BrandMark } from "./BrandMark";

export function Footer() {
  const { user } = useAuth();
  const freeLearningLink = user ? "/free-learning" : "/login";
  const freeLearningLabel = user ? "Free Pashto lessons" : "Login for free lessons";

  return (
    <footer className="border-t border-white/70 bg-white/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 text-sm text-[var(--muted)] sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <BrandMark
            logoClassName="size-14 rounded-[20px]"
            titleClassName="brand-title text-2xl leading-none text-[var(--brand-deep)]"
            subtitleClassName="mt-1 text-xs uppercase tracking-[0.28em] text-[var(--muted)]"
          />
          <p className="mt-2 max-w-xl">
            Practical online learning for students who want guided progress, project work, and direct WhatsApp support.
          </p>
          <Link
            to={freeLearningLink}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2.5 font-semibold text-red-700"
          >
            <Youtube className="size-4" />
            {freeLearningLabel}
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-slate-900">Rashid Zada</p>
          <p>Software Engineer</p>
          <p>rashidzad6@gmail.com</p>
          <p>WhatsApp: 03470983567</p>
          <p>YouTube: {YOUTUBE_CHANNEL_HANDLE}</p>
        </div>
      </div>
    </footer>
  );
}
