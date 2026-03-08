import { ArrowRight, CheckCircle2, MessageCircleMore, PlayCircle, Sparkles, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { YOUTUBE_CHANNEL_HANDLE, YOUTUBE_CHANNEL_NAME } from "../lib/brand-links";
import { CourseCard } from "../components/CourseCard";
import { LoadingBlock } from "../components/LoadingBlock";
import { SectionHeading } from "../components/SectionHeading";
import { BrandMark } from "../components/BrandMark";
import { useAuth } from "../hooks/useAuth";
import { api, buildGlobalWhatsAppUrl, extractResults } from "../lib/api";
import type { Course, FreeLearningVideo, HomepageContent, Testimonial } from "../types/api";

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
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [featuredFreeVideo, setFeaturedFreeVideo] = useState<FreeLearningVideo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [homepageResult, coursesResult, testimonialResult, featuredVideoResult] = await Promise.allSettled([
        api.get<HomepageContent>("/website/homepage/"),
        api.get<Course[]>("/courses/featured/"),
        api.get("/website/testimonials/"),
        api.get<FreeLearningVideo | null>("/website/free-videos/featured/"),
      ]);

      if (homepageResult.status === "fulfilled") {
        setContent(homepageResult.value.data);
      } else {
        setContent(fallbackContent);
      }

      if (coursesResult.status === "fulfilled") {
        setCourses(coursesResult.value.data);
      } else {
        setCourses([]);
      }

      if (testimonialResult.status === "fulfilled") {
        setTestimonials(extractResults<Testimonial>(testimonialResult.value.data));
      } else {
        setTestimonials([]);
      }

      if (featuredVideoResult.status === "fulfilled") {
        setFeaturedFreeVideo(featuredVideoResult.value.data);
      } else {
        setFeaturedFreeVideo(null);
      }

      setIsLoading(false);
    };

    void load();
  }, []);

  if (isLoading) {
    return <LoadingBlock label="Preparing academy homepage..." />;
  }

  const freeLearningLink = user ? "/free-learning" : "/login";
  const freeLearningLabel = user ? "Open Free Learning" : "Login for Free Learning";

  return (
    <div className="space-y-8">
      <section className="hero-mesh glass-panel relative overflow-hidden rounded-[36px] px-6 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
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
            <h1 className="brand-title mt-6 max-w-3xl text-5xl leading-tight text-slate-950 sm:text-6xl">
              {content.hero_title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{content.hero_subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--brand-deep)]"
              >
                Explore Courses
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/apply"
                className="rounded-full border border-[var(--line)] bg-white px-6 py-3 font-semibold text-[var(--copy)]"
              >
                Apply Now
              </Link>
              <a
                href={buildGlobalWhatsAppUrl("Assalamualaikum, I want to discuss enrollment for GoGreenTech Learning Academy.")}
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
                { label: "Free preview", value: featuredFreeVideo ? "1 featured lesson" : "Coming soon" },
                { label: "Delivery", value: "Django + React + Flutter" },
                { label: "Enrollment", value: "WhatsApp-guided" },
              ].map((item) => (
                <div key={item.label} className="soft-card rounded-[24px] p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">{item.label}</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-950">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {featuredFreeVideo ? (
              <article className="soft-card overflow-hidden rounded-[28px]">
                <iframe
                  src={featuredFreeVideo.embed_url}
                  title={featuredFreeVideo.title}
                  className="aspect-video w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Featured free lesson</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{featuredFreeVideo.title}</p>
                </div>
              </article>
            ) : null}

            <div className="soft-card flex min-h-[240px] flex-col justify-between rounded-[28px] p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Free learning access</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">One free Pashto lesson is open here on the homepage.</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                  {user
                    ? `You are logged in. Open ${YOUTUBE_CHANNEL_NAME} inside the platform to watch the full free-learning library.`
                    : `Login to unlock the full ${YOUTUBE_CHANNEL_NAME} free-learning library inside the platform.`}
                </p>
                <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
                  <Youtube className="size-4" />
                  {YOUTUBE_CHANNEL_HANDLE}
                </div>
              </div>
              <Link
                to={freeLearningLink}
                className="mt-6 inline-flex items-center gap-2 font-semibold text-[var(--brand)]"
              >
                {freeLearningLabel}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <SectionHeading
          eyebrow="Why us"
          title="A student-friendly academy built for practical progress"
          description={content.intro_text}
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {content.why_choose_us.map((item) => (
            <div key={item} className="soft-card rounded-[28px] p-6">
              <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[var(--highlight)] text-[var(--brand)]">
                <CheckCircle2 className="size-5" />
              </div>
              <p className="mt-5 text-lg font-semibold text-slate-950">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-spacing">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Featured Courses"
            title="Start with the tracks students ask for most"
            description="Every course includes clear previews, structured lessons, linked resources, and an application path into full enrollment."
          />
          <Link to="/courses" className="inline-flex items-center gap-2 font-semibold text-[var(--brand)]">
            Browse all courses
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <section className="section-spacing">
        <SectionHeading
          eyebrow="Testimonials"
          title="Students stay because the system is simple and direct"
          description="The platform is intentionally lightweight so students can focus on learning, asking, and moving forward."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article key={testimonial.id} className="soft-card rounded-[28px] p-6">
              <div className="flex items-center gap-3 text-[var(--brand)]">
                <PlayCircle className="size-5" />
                <span className="text-sm font-semibold uppercase tracking-[0.24em]">Student feedback</span>
              </div>
              <p className="mt-5 text-lg leading-8 text-slate-900">"{testimonial.content}"</p>
              <div className="mt-6">
                <p className="font-semibold text-slate-950">{testimonial.name}</p>
                <p className="text-sm text-[var(--muted)]">{testimonial.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
