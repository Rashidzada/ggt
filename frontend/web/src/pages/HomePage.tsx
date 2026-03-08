import {
  ArrowRight,
  CheckCircle2,
  CirclePlay,
  GraduationCap,
  MessageCircleMore,
  Sparkles,
  Star,
  UserRound,
  Youtube,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { BrandMark } from "../components/BrandMark";
import { CourseCard } from "../components/CourseCard";
import { LoadingBlock } from "../components/LoadingBlock";
import { SectionHeading } from "../components/SectionHeading";
import { useAuth } from "../hooks/useAuth";
import { api, buildGlobalWhatsAppUrl, extractResults } from "../lib/api";
import { YOUTUBE_CHANNEL_HANDLE } from "../lib/brand-links";
import type { Course, CourseCategory, FreeLearningVideo, HomepageContent, Testimonial } from "../types/api";

const fallbackContent: HomepageContent = {
  id: 0,
  site_name: "GoGreenTech Learning Academy",
  tagline: "Practical learning, guided enrollment, and WhatsApp-first support",
  hero_title: "Build real skills with lightweight, guided online learning",
  hero_subtitle:
    "GoGreenTech blends recorded lessons, preview access, project-oriented teaching, and direct enrollment support for students who want clarity.",
  intro_text:
    "Start with preview lessons, explore structured courses, and move into full enrollment once the plan and pricing are clear.",
  about_title: "A practical learning platform built around guided progress",
  about_description:
    "GoGreenTech Learning Academy is designed for students who want real skill development without a heavy or confusing learning system.",
  intro_video_urls: [],
  why_choose_us: [
    "Trial lessons before full commitment",
    "Flexible course pricing confirmed on WhatsApp",
    "Resources delivered through Google Drive for lightweight access",
  ],
  learning_modes: ["Video-based learning", "Project-based learning", "Face-to-face guidance coordination"],
  owner_name: "Rashid Zada",
  owner_role: "Software Engineer",
  owner_email: "rashidzad6@gmail.com",
  owner_whatsapp: "03470983567",
  owner_qualification: "MSc Computer Science, University of Swat, 2019",
  owner_photo: null,
  owner_photo_display_url: "",
  owner_photo_url: "",
  owner_profile_url: "https://rashidzada.pythonanywhere.com/",
  footer_note: "",
};

export function HomePage() {
  const { user } = useAuth();
  const [content, setContent] = useState<HomepageContent>(fallbackContent);
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [featuredFreeVideo, setFeaturedFreeVideo] = useState<FreeLearningVideo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [homepageResult, coursesResult, categoryResult, testimonialResult, featuredVideoResult] = await Promise.allSettled([
        api.get<HomepageContent>("/website/homepage/"),
        api.get<Course[]>("/courses/featured/"),
        api.get("/courses/categories/"),
        api.get("/website/testimonials/"),
        api.get<FreeLearningVideo | null>("/website/free-videos/featured/"),
      ]);

      setContent(homepageResult.status === "fulfilled" ? homepageResult.value.data : fallbackContent);
      setCourses(coursesResult.status === "fulfilled" ? coursesResult.value.data : []);
      setCategories(
        categoryResult.status === "fulfilled" ? extractResults<CourseCategory>(categoryResult.value.data) : [],
      );
      setTestimonials(
        testimonialResult.status === "fulfilled" ? extractResults<Testimonial>(testimonialResult.value.data) : [],
      );
      setFeaturedFreeVideo(featuredVideoResult.status === "fulfilled" ? featuredVideoResult.value.data : null);
      setIsLoading(false);
    };

    void load();
  }, []);

  if (isLoading) {
    return <LoadingBlock label="Preparing academy homepage..." />;
  }

  const freeLearningLink = user ? "/free-learning" : "/login";
  const freeLearningLabel = user ? "Open free learning" : "Login for free learning";
  const ownerPhoto = content.owner_photo_display_url || "/gogreentech-logo.png";
  const admissionsPoints = content.why_choose_us.slice(0, 3);

  return (
    <div className="space-y-10">
      <section className="hero-mesh glass-panel relative overflow-hidden rounded-[40px] px-6 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.12fr_0.88fr]">
          <div>
            <div className="inline-flex flex-col gap-4">
              <BrandMark
                logoClassName="size-16 rounded-[24px]"
                titleClassName="brand-title text-2xl leading-none text-[var(--brand-deep)]"
                subtitleClassName="text-xs uppercase tracking-[0.32em] text-[var(--muted)]"
              />
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--highlight)] px-4 py-2 text-sm font-semibold text-[var(--brand-deep)]">
                <Sparkles className="size-4" />
                {content.tagline}
              </div>
            </div>

            <h1 className="brand-title mt-6 max-w-4xl text-5xl leading-tight text-slate-950 sm:text-6xl">
              {content.hero_title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{content.hero_subtitle}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--brand-deep)]"
              >
                Explore courses
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/apply"
                className="rounded-full border border-[var(--line)] bg-white px-6 py-3 font-semibold text-[var(--copy)]"
              >
                Apply for admission
              </Link>
              <a
                href={buildGlobalWhatsAppUrl(
                  "Assalamualaikum, I want to discuss admission for GoGreenTech Learning Academy.",
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--brand)] px-6 py-3 font-semibold text-[var(--brand-deep)]"
              >
                <MessageCircleMore className="size-4" />
                WhatsApp
              </a>
              <Link
                to={freeLearningLink}
                className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-6 py-3 font-semibold text-red-700 transition hover:bg-red-100"
              >
                <Youtube className="size-4" />
                {freeLearningLabel}
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Featured tracks", value: `${courses.length}+ active picks` },
                { label: "Free lessons", value: featuredFreeVideo ? "Embedded Pashto learning" : "Ready for release" },
                { label: "Admissions", value: "WhatsApp-guided support" },
              ].map((item) => (
                <div key={item.label} className="soft-card rounded-[24px] p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">{item.label}</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-950">{item.value}</p>
                </div>
              ))}
            </div>

            {categories.length ? (
              <div className="mt-8 flex flex-wrap gap-2">
                {categories.slice(0, 6).map((category) => (
                  <span
                    key={category.id}
                    className="rounded-full border border-[var(--line)] bg-white/85 px-4 py-2 text-sm font-semibold text-[var(--copy)]"
                  >
                    {category.title}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="grid gap-4">
            {featuredFreeVideo ? (
              <article className="soft-card overflow-hidden rounded-[30px]">
                <div className="overflow-hidden bg-slate-950">
                  <iframe
                    src={featuredFreeVideo.embed_url}
                    title={featuredFreeVideo.title}
                    className="aspect-video w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="space-y-3 p-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-red-700">
                    <Youtube className="size-4" />
                    {YOUTUBE_CHANNEL_HANDLE}
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-950">{featuredFreeVideo.title}</h2>
                  <p className="text-sm leading-7 text-[var(--muted)]">
                    {featuredFreeVideo.description || "Watch a featured lesson directly on the site before joining the academy."}
                  </p>
                  <Link to={freeLearningLink} className="inline-flex items-center gap-2 font-semibold text-[var(--brand)]">
                    {freeLearningLabel}
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </article>
            ) : null}

            <article className="soft-card rounded-[30px] p-6">
              <div className="flex items-start gap-4">
                <img
                  src={ownerPhoto}
                  alt={content.owner_name}
                  className="h-20 w-20 rounded-[24px] object-cover ring-1 ring-[var(--line)]"
                />
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[var(--brand)]">Owner and mentor</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">{content.owner_name}</h2>
                  <p className="mt-1 text-sm font-semibold text-[var(--muted)]">{content.owner_role}</p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-[var(--muted)]">{content.about_description}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <span className="rounded-full bg-[var(--highlight)] px-4 py-2 text-sm font-semibold text-[var(--brand-deep)]">
                  {content.owner_qualification}
                </span>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--copy)]"
                >
                  Learn more
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <SectionHeading
          eyebrow="Why students join"
          title="A simpler admissions journey with more trust and less confusion"
          description={content.intro_text}
          actions={
            <a
              href={buildGlobalWhatsAppUrl("Assalamualaikum, I want to ask about enrollment and course selection.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-5 py-3 font-semibold text-[var(--copy)]"
            >
              <MessageCircleMore className="size-4 text-[var(--brand)]" />
              Talk before applying
            </a>
          }
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {admissionsPoints.map((item, index) => (
            <div key={item} className="soft-card rounded-[30px] p-7">
              <div className="inline-flex size-13 items-center justify-center rounded-2xl bg-[var(--highlight)] text-[var(--brand)]">
                {index === 0 ? <CirclePlay className="size-6" /> : index === 1 ? <GraduationCap className="size-6" /> : <UserRound className="size-6" />}
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-slate-950">{item}</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                {index === 0
                  ? "Let students preview the teaching style before they commit to full enrollment."
                  : index === 1
                    ? "Guide each learner into a clear path with lessons, resources, and quiz checkpoints."
                    : "Use direct WhatsApp conversations to remove friction from pricing and admission questions."}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-spacing">
        <SectionHeading
          eyebrow="Featured Courses"
          title="Programs built to convert interest into real enrollments"
          description="These tracks are the strongest entry points for students exploring GoGreenTech. Each one combines structured lessons, practical outputs, and a clear application route."
          actions={
            <Link to="/courses" className="inline-flex items-center gap-2 font-semibold text-[var(--brand)]">
              Browse all courses
              <ArrowRight className="size-4" />
            </Link>
          }
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <article className="glass-panel rounded-[34px] px-6 py-8 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--brand)]">Learning modes</p>
          <h2 className="brand-title mt-4 text-4xl leading-tight text-slate-950">
            Students can enter through free lessons, guided tracks, or direct WhatsApp support
          </h2>
          <div className="mt-8 grid gap-4">
            {content.learning_modes.map((mode) => (
              <div key={mode} className="soft-card rounded-[24px] p-5">
                <div className="inline-flex items-center gap-3">
                  <CheckCircle2 className="size-5 text-[var(--brand)]" />
                  <span className="text-lg font-semibold text-slate-950">{mode}</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="soft-card rounded-[34px] p-6 sm:p-8">
          <SectionHeading
            eyebrow="Proof"
            title="Students respond to clarity"
            description="The academy is positioned around practical outcomes, guided support, and a lighter learning system that feels approachable."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {testimonials.slice(0, 4).map((testimonial) => (
              <div key={testimonial.id} className="rounded-[26px] border border-[var(--line)] bg-white p-5">
                <div className="inline-flex items-center gap-2 text-[var(--brand)]">
                  <Star className="size-4 fill-current" />
                  <span className="text-xs font-semibold uppercase tracking-[0.18em]">Student feedback</span>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-900">"{testimonial.content}"</p>
                <div className="mt-5">
                  <p className="font-semibold text-slate-950">{testimonial.name}</p>
                  <p className="text-sm text-[var(--muted)]">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="cta-band rounded-[36px] px-6 py-8 text-white sm:px-10 sm:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-emerald-100">Admissions CTA</p>
            <h2 className="brand-title mt-3 text-4xl leading-tight">Turn visitors into applicants with a clearer next step.</h2>
            <p className="mt-4 text-base leading-8 text-emerald-50/88">
              Students can watch a free Pashto lesson, compare courses, and move directly into application or WhatsApp support when they are ready.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-[var(--brand-deep)]"
            >
              Start admission
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-full border border-white/35 px-6 py-3 font-semibold text-white"
            >
              Explore programs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
