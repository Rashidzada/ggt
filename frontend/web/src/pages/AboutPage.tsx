import { ExternalLink, GraduationCap, Mail, MessageCircleMore, Phone, Rocket, ShieldCheck, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { LoadingBlock } from "../components/LoadingBlock";
import { api, buildGlobalWhatsAppUrl } from "../lib/api";
import type { HomepageContent } from "../types/api";

const principles = [
  {
    title: "Lightweight by design",
    description: "The system avoids unnecessary complexity so students can register, preview, enroll, and study with minimal friction.",
    icon: Rocket,
  },
  {
    title: "Support-first enrollment",
    description: "Course prices and enrollment details can be discussed directly on WhatsApp, which fits the owner's workflow and the platform spec.",
    icon: MessageCircleMore,
  },
  {
    title: "Structured learning path",
    description: "Courses are broken into lessons, linked resources, and quizzes so learners always know the next step.",
    icon: GraduationCap,
  },
  {
    title: "Built to extend",
    description: "The product architecture leaves space for payments, certificates, live classes, and multiple instructors later.",
    icon: ShieldCheck,
  },
];

const fallbackContent: HomepageContent = {
  id: 0,
  site_name: "GoGreenTech Learning Academy",
  tagline: "Project-based learning with WhatsApp-first enrollment",
  hero_title: "Learn practical tech skills with guided support",
  hero_subtitle: "Recorded lessons, quiz practice, shared resources, and personal enrollment guidance.",
  intro_text: "GoGreenTech is built for students who want lightweight but serious training.",
  about_title: "A practical learning platform built around guided progress",
  about_description:
    "GoGreenTech Learning Academy is designed for students who want real skill development without a heavy or confusing learning system. Rashid Zada combines software engineering experience with a simple teaching model: structured content, preview access, clear enrollment, and direct support.",
  intro_video_urls: [],
  why_choose_us: [
    "Small and practical course structure",
    "Three free trial lessons before enrollment",
    "WhatsApp-based guidance and pricing discussion",
  ],
  learning_modes: ["Video-based learning", "Project-based learning", "Face-to-face guidance"],
  owner_name: "Rashid Zada",
  owner_role: "Software Engineer",
  owner_email: "rashidzad6@gmail.com",
  owner_whatsapp: "03470983567",
  owner_qualification: "MSc Computer Science, University of Swat, 2019",
  owner_photo: null,
  owner_photo_display_url: "",
  owner_photo_url: "https://rashidzada.pythonanywhere.com/media/profile_images/mypic-removebg-preview.png",
  owner_profile_url: "https://rashidzada.pythonanywhere.com/",
  footer_note: "",
};

export function AboutPage() {
  const { user } = useAuth();
  const [content, setContent] = useState<HomepageContent>(fallbackContent);
  const [isLoading, setIsLoading] = useState(true);
  const [ownerPhotoIndex, setOwnerPhotoIndex] = useState(0);
  const freeLearningLink = user ? "/free-learning" : "/login";
  const freeLearningLabel = user ? "Learn Free in Pashto" : "Login for Free Learning";
  const ownerPhotoCandidates = Array.from(
    new Set(
      [
        content.owner_photo_display_url,
        content.owner_photo,
        content.owner_photo_url,
        "/gogreentech-logo.png",
      ].filter((value): value is string => Boolean(value)),
    ),
  );
  const ownerPhoto = ownerPhotoCandidates[Math.min(ownerPhotoIndex, ownerPhotoCandidates.length - 1)] ?? "/gogreentech-logo.png";

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get<HomepageContent>("/website/homepage/");
        setContent(data);
      } catch {
        setContent(fallbackContent);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  useEffect(() => {
    setOwnerPhotoIndex(0);
  }, [content.owner_photo_display_url, content.owner_photo, content.owner_photo_url]);

  if (isLoading) {
    return <LoadingBlock label="Loading academy details..." />;
  }

  return (
    <div className="space-y-10">
      <section className="glass-panel rounded-[36px] px-6 py-10 sm:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_minmax(0,340px)] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--brand)]">About the academy</p>
            <h1 className="brand-title mt-4 max-w-3xl text-4xl leading-tight text-slate-950 sm:text-5xl">
              {content.about_title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">{content.about_description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={buildGlobalWhatsAppUrl("Assalamualaikum, I want to learn more about GoGreenTech Learning Academy.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full bg-[var(--brand)] px-6 py-3 font-semibold text-white"
              >
                Talk on WhatsApp
              </a>
              <Link
                to={freeLearningLink}
                className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-6 py-3 font-semibold text-red-700"
              >
                <Youtube className="size-4" />
                {freeLearningLabel}
              </Link>
              <a
                href={content.owner_profile_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-6 py-3 font-semibold text-[var(--copy)]"
              >
                <ExternalLink className="size-4" />
                About the Owner
              </a>
            </div>
          </div>

          <aside className="soft-card mx-auto w-full max-w-sm overflow-hidden rounded-[32px] lg:justify-self-end">
            <div className="aspect-[4/3.5] overflow-hidden bg-[var(--highlight)] sm:aspect-[4/3.8]">
              <img
                src={ownerPhoto}
                alt={content.owner_name}
                className="h-full w-full object-cover object-center"
                onError={() => {
                  if (ownerPhotoIndex < ownerPhotoCandidates.length - 1) {
                    setOwnerPhotoIndex((current) => current + 1);
                  }
                }}
              />
            </div>
            <div className="space-y-3 p-5 sm:p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--brand)]">Owner</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">{content.owner_name}</h2>
                <p className="mt-1 text-sm font-semibold text-[var(--muted)]">{content.owner_role}</p>
              </div>
              <div className="grid gap-3">
                <div className="rounded-2xl bg-[var(--surface)] px-4 py-3">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-deep)]">
                    <Mail className="size-4" />
                    Email
                  </div>
                  <p className="mt-2 break-all text-sm text-[var(--muted)]">{content.owner_email}</p>
                </div>
                <div className="rounded-2xl bg-[var(--surface)] px-4 py-3">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-deep)]">
                    <Phone className="size-4" />
                    WhatsApp
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted)]">{content.owner_whatsapp}</p>
                </div>
              </div>
              <div className="rounded-2xl bg-[var(--surface)] px-4 py-4">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--brand)]">Qualification</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{content.owner_qualification}</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {principles.map((item, index) => {
          const Icon = item.icon;
          const description = content.why_choose_us[index] ?? item.description;
          return (
            <article key={item.title} className="soft-card rounded-[30px] p-8">
              <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-[var(--highlight)] text-[var(--brand)]">
                <Icon className="size-6" />
              </div>
              <h2 className="mt-6 text-2xl font-semibold text-slate-950">{item.title}</h2>
              <p className="mt-4 leading-7 text-[var(--muted)]">{description}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <article className="soft-card rounded-[30px] p-8">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--brand)]">Academy profile</p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-950">{content.site_name}</h2>
          <p className="mt-4 leading-8 text-[var(--muted)]">{content.tagline}</p>
          <p className="mt-6 leading-8 text-[var(--muted)]">{content.intro_text}</p>
        </article>

        <article className="soft-card rounded-[30px] p-8">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--brand)]">Learning modes</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {content.learning_modes.map((mode) => (
              <div key={mode} className="rounded-[24px] bg-[var(--surface)] px-5 py-6">
                <p className="text-sm font-semibold leading-7 text-slate-950">{mode}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
