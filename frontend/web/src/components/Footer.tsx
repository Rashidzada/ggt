import { ArrowRight, ExternalLink, MessageCircleMore, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { YOUTUBE_CHANNEL_HANDLE } from "../lib/brand-links";
import { api, buildGlobalWhatsAppUrl } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import type { HomepageContent } from "../types/api";
import { BrandMark } from "./BrandMark";

const fallbackContent: HomepageContent = {
  id: 0,
  site_name: "GoGreenTech Learning Academy",
  tagline: "Practical online learning with guided support",
  hero_title: "",
  hero_subtitle: "",
  intro_text: "",
  about_title: "",
  about_description: "",
  intro_video_urls: [],
  why_choose_us: [],
  learning_modes: [],
  owner_name: "Rashid Zada",
  owner_role: "Software Engineer",
  owner_email: "rashidzad6@gmail.com",
  owner_whatsapp: "03470983567",
  owner_qualification: "",
  owner_photo: null,
  owner_photo_display_url: "",
  owner_photo_url: "",
  owner_profile_url: "https://rashidzada.pythonanywhere.com/",
  footer_note: "Project-based learning, free Pashto lessons, and WhatsApp-first enrollment guidance.",
};

export function Footer() {
  const { user } = useAuth();
  const [content, setContent] = useState<HomepageContent>(fallbackContent);
  const freeLearningLink = user ? "/free-learning" : "/login";

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get<HomepageContent>("/website/homepage/");
        setContent(data);
      } catch {
        setContent(fallbackContent);
      }
    };

    void load();
  }, []);

  return (
    <footer className="border-t border-white/70 bg-white/65 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="cta-band rounded-[32px] px-6 py-8 text-white sm:px-8 lg:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-emerald-100">Admission support</p>
              <h2 className="brand-title mt-3 text-3xl sm:text-4xl">Make the next step simple for your students.</h2>
              <p className="mt-4 text-sm leading-7 text-emerald-50/88 sm:text-base">
                {content.footer_note || content.tagline || fallbackContent.footer_note}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/apply"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-[var(--brand-deep)]"
              >
                Apply now
                <ArrowRight className="size-4" />
              </Link>
              <a
                href={buildGlobalWhatsAppUrl("Assalamualaikum, I want to discuss admission for GoGreenTech Learning Academy.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/35 px-5 py-3 font-semibold text-white"
              >
                <MessageCircleMore className="size-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <BrandMark
              logoClassName="size-14 rounded-[20px]"
              titleClassName="brand-title text-2xl leading-none text-[var(--brand-deep)]"
              subtitleClassName="mt-1 text-xs uppercase tracking-[0.28em] text-[var(--muted)]"
            />
            <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted)]">
              {content.tagline || fallbackContent.tagline}. Build trust with free lessons, clear course pages, and direct enrollment support.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to={freeLearningLink}
                className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700"
              >
                <Youtube className="size-4" />
                {user ? "Free Pashto lessons" : "Login for free lessons"}
              </Link>
              {content.owner_profile_url ? (
                <a
                  href={content.owner_profile_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--copy)]"
                >
                  <ExternalLink className="size-4" />
                  Owner profile
                </a>
              ) : null}
            </div>
          </div>

          <div className="space-y-3 text-sm text-[var(--muted)]">
            <p className="font-semibold uppercase tracking-[0.22em] text-slate-900">Explore</p>
            <Link to="/" className="block hover:text-[var(--brand)]">
              Home
            </Link>
            <Link to="/courses" className="block hover:text-[var(--brand)]">
              Courses
            </Link>
            <Link to="/about" className="block hover:text-[var(--brand)]">
              About
            </Link>
            <Link to="/apply" className="block hover:text-[var(--brand)]">
              Apply
            </Link>
          </div>

          <div className="space-y-3 text-sm text-[var(--muted)]">
            <p className="font-semibold uppercase tracking-[0.22em] text-slate-900">Contact</p>
            <p className="font-semibold text-slate-900">{content.owner_name}</p>
            <p>{content.owner_role}</p>
            <p>{content.owner_email}</p>
            <p>WhatsApp: {content.owner_whatsapp}</p>
            <p>YouTube: {YOUTUBE_CHANNEL_HANDLE}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
