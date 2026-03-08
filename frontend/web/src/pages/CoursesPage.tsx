import { ArrowRight, Filter, Search } from "lucide-react";
import { useDeferredValue, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { CourseCard } from "../components/CourseCard";
import { LoadingBlock } from "../components/LoadingBlock";
import { SectionHeading } from "../components/SectionHeading";
import { api, extractApiErrorMessage, extractResults } from "../lib/api";
import type { Course, CourseCategory, HomepageContent, Testimonial } from "../types/api";

const fallbackContent: HomepageContent = {
  id: 0,
  site_name: "GoGreenTech Learning Academy",
  tagline: "Practical learning with guided support",
  hero_title: "",
  hero_subtitle: "",
  intro_text: "Published courses are structured to keep students focused and move them toward application quickly.",
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
  footer_note: "",
};

export function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [content, setContent] = useState<HomepageContent>(fallbackContent);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [courseResponse, categoryResponse, testimonialResponse, homepageResponse] = await Promise.all([
          api.get("/courses/"),
          api.get("/courses/categories/"),
          api.get("/website/testimonials/"),
          api.get<HomepageContent>("/website/homepage/"),
        ]);
        setCourses(extractResults<Course>(courseResponse.data));
        setCategories(extractResults<CourseCategory>(categoryResponse.data));
        setTestimonials(extractResults<Testimonial>(testimonialResponse.data));
        setContent(homepageResponse.data);
        setLoadError(null);
      } catch (error) {
        setLoadError(extractApiErrorMessage(error, "Courses could not be loaded right now."));
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  if (isLoading) {
    return <LoadingBlock label="Loading course catalog..." />;
  }

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(deferredSearch.toLowerCase()) ||
      course.short_description.toLowerCase().includes(deferredSearch.toLowerCase()) ||
      course.category.title.toLowerCase().includes(deferredSearch.toLowerCase());
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
    const matchesCategory = selectedCategory === "all" || course.category.slug === selectedCategory;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  return (
    <div className="space-y-10">
      <section className="glass-panel rounded-[38px] px-6 py-10 sm:px-10 sm:py-12">
        <SectionHeading
          eyebrow="Courses"
          title="Browse published tracks, preview-friendly lessons, and clearer pricing paths"
          description="Each course page is designed to answer the questions students ask before admission: what they will learn, how the lessons are structured, and how to move into full enrollment."
          actions={
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-5 py-3 font-semibold text-white"
            >
              Apply now
              <ArrowRight className="size-4" />
            </Link>
          }
        />

        <div className="mt-8 grid gap-4 rounded-[30px] bg-white/78 p-5 md:grid-cols-[1.4fr_1fr_1fr]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by course, topic, or category"
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-11 py-3 text-sm outline-none ring-0"
            />
          </label>
          <label className="relative">
            <Filter className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" />
            <select
              value={selectedLevel}
              onChange={(event) => setSelectedLevel(event.target.value)}
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-11 py-3 text-sm outline-none"
            >
              <option value="all">All levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </label>
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none"
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              selectedCategory === "all"
                ? "bg-[var(--brand)] text-white"
                : "border border-[var(--line)] bg-white text-[var(--copy)]"
            }`}
          >
            All tracks
          </button>
          {categories.slice(0, 8).map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.slug)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                selectedCategory === category.slug
                  ? "bg-[var(--brand)] text-white"
                  : "border border-[var(--line)] bg-white text-[var(--copy)]"
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>

        {loadError ? <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{loadError}</p> : null}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
        {!filteredCourses.length && !loadError ? (
          <div className="soft-card rounded-[30px] p-8 lg:col-span-3">
            <h2 className="text-2xl font-semibold text-slate-950">No courses match these filters.</h2>
            <p className="mt-3 max-w-2xl text-[var(--muted)]">
              Try a broader search, switch the category, or contact the academy directly to ask which track fits the student best.
            </p>
          </div>
        ) : null}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="soft-card rounded-[32px] p-7">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--brand)]">Admission support</p>
          <h2 className="brand-title mt-4 text-4xl leading-tight text-slate-950">Choose a course, then move directly into application.</h2>
          <p className="mt-4 text-base leading-8 text-[var(--muted)]">
            {content.intro_text || fallbackContent.intro_text}
          </p>
          <div className="mt-6 space-y-3">
            {content.why_choose_us.slice(0, 3).map((point) => (
              <div key={point} className="rounded-[22px] border border-[var(--line)] bg-white px-4 py-4 text-sm font-semibold text-[var(--copy)]">
                {point}
              </div>
            ))}
          </div>
          <Link
            to="/apply"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-5 py-3 font-semibold text-white"
          >
            Start admission
            <ArrowRight className="size-4" />
          </Link>
        </article>

        <article className="soft-card rounded-[32px] p-7">
          <SectionHeading
            eyebrow="Testimonials"
            title="Students want a clear path, not a confusing system"
            description="The academy positioning works best when the frontend shows confidence, clarity, and direct next steps."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {testimonials.slice(0, 4).map((testimonial) => (
              <div key={testimonial.id} className="rounded-[24px] border border-[var(--line)] bg-white p-5">
                <p className="text-sm leading-7 text-slate-900">"{testimonial.content}"</p>
                <div className="mt-5">
                  <p className="font-semibold text-slate-950">{testimonial.name}</p>
                  <p className="text-sm text-[var(--muted)]">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
