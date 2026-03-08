import {
  ArrowRight,
  BookOpenText,
  CirclePlay,
  FileText,
  LockKeyhole,
  MessageCircleMore,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { LoadingBlock } from "../components/LoadingBlock";
import { api, buildGlobalWhatsAppUrl, extractResults } from "../lib/api";
import { toYouTubeEmbedUrl } from "../lib/youtube";
import type { Course } from "../types/api";

export function CourseDetailPage() {
  const { slug } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [quizTitles, setQuizTitles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!slug) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await api.get<Course>(`/courses/${slug}/`);
        setCourse(data);

        const quizResponse = await api.get("/quizzes/", { params: { course: data.id } });
        setQuizTitles(extractResults<{ title: string }>(quizResponse.data).map((item) => item.title));
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [slug]);

  if (isLoading) {
    return <LoadingBlock label="Loading course details..." />;
  }

  if (!course) {
    return (
      <div className="glass-panel rounded-[36px] px-6 py-16 text-center">
        <h1 className="brand-title text-4xl text-slate-950">Course not found</h1>
        <p className="mt-4 text-[var(--muted)]">The selected course is unavailable or no longer published.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section className="glass-panel rounded-[40px] px-6 py-8 sm:px-10 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--brand)]">{course.category.title}</p>
            <h1 className="brand-title mt-4 text-5xl leading-tight text-slate-950">{course.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">{course.full_description}</p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold">
              <span className="rounded-full bg-[var(--highlight)] px-4 py-2 text-[var(--brand-deep)]">{course.level}</span>
              <span className="rounded-full border border-[var(--line)] bg-white px-4 py-2">{course.duration}</span>
              <span className="rounded-full border border-[var(--line)] bg-white px-4 py-2">{course.price_display}</span>
              <span className="rounded-full border border-[var(--line)] bg-white px-4 py-2">{course.course_type}</span>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to={`/apply?course=${course.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-6 py-3 font-semibold text-white"
              >
                Apply for this course
                <ArrowRight className="size-4" />
              </Link>
              <a
                href={
                  course.whatsapp_apply_url ??
                  buildGlobalWhatsAppUrl(`Assalamualaikum, I want to discuss ${course.title}.`)
                }
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--brand)] px-6 py-3 font-semibold text-[var(--brand-deep)]"
              >
                <MessageCircleMore className="size-4" />
                Apply via WhatsApp
              </a>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="soft-card rounded-[24px] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Lessons</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">{course.lessons_count}</p>
              </div>
              <div className="soft-card rounded-[24px] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Quizzes</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">{course.quiz_count}</p>
              </div>
              <div className="soft-card rounded-[24px] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Progress</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">{course.progress_percent ?? 0}%</p>
              </div>
            </div>
          </div>

          <div id="intro-video" className="soft-card overflow-hidden rounded-[32px]">
            {course.intro_video_url ? (
              <iframe
                src={toYouTubeEmbedUrl(course.intro_video_url)}
                title={course.title}
                className="aspect-video w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : course.thumbnail_url ? (
              <img src={course.thumbnail_url} alt={course.title} className="aspect-video w-full object-cover" />
            ) : (
              <div className="flex h-full min-h-[280px] items-center justify-center bg-gradient-to-br from-[#eaf7ec] to-[#d9efdd]">
                <CirclePlay className="size-16 text-[var(--brand)]" />
              </div>
            )}
            <div className="space-y-4 p-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--highlight)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-deep)]">
                <Sparkles className="size-4" />
                Access status
              </div>
              <p className="text-xl font-semibold text-slate-950">
                {course.is_enrolled ? "This student already has full course access." : `Preview access: ${course.trial_lesson_limit ?? 3} lessons`}
              </p>
              <p className="text-sm leading-7 text-[var(--muted)]">
                {!course.is_enrolled
                  ? "Preview lessons are open. Full lessons, enrolled resources, and tracked learning progress unlock after approval."
                  : `Current course progress is ${course.progress_percent ?? 0}%.`}
              </p>
              {course.drive_folder_url ? (
                <a
                  href={course.drive_folder_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 font-semibold text-[var(--brand)]"
                >
                  Open course drive folder
                  <ArrowRight className="size-4" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <article className="soft-card rounded-[32px] p-6">
          <div className="flex items-center gap-3">
            <BookOpenText className="size-5 text-[var(--brand)]" />
            <h2 className="text-2xl font-semibold text-slate-950">Lessons</h2>
          </div>
          <div className="mt-6 space-y-4">
            {(course.lessons ?? []).map((lesson) => (
              <div key={lesson.id} className="rounded-[24px] border border-[var(--line)] bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--brand)]">Lesson {lesson.order}</p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-950">{lesson.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{lesson.description}</p>
                  </div>
                  {lesson.is_free_preview ? (
                    <span className="rounded-full bg-[var(--highlight)] px-3 py-1 text-xs font-semibold text-[var(--brand-deep)]">
                      Preview
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                      <LockKeyhole className="size-3.5" />
                      Enrolled
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </article>

        <div className="space-y-6">
          <article className="soft-card rounded-[32px] p-6">
            <div className="flex items-center gap-3">
              <FileText className="size-5 text-[var(--brand)]" />
              <h2 className="text-2xl font-semibold text-slate-950">Resources</h2>
            </div>
            <div className="mt-6 space-y-3">
              {(course.resources ?? []).map((resource) => (
                <a
                  key={resource.id}
                  href={resource.drive_link}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-[22px] border border-[var(--line)] bg-white p-4 transition hover:border-[var(--brand)]"
                >
                  <p className="font-semibold text-slate-950">{resource.title}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {resource.resource_type.toUpperCase()} • {resource.visibility}
                  </p>
                </a>
              ))}
              {!(course.resources ?? []).length ? (
                <p className="text-sm text-[var(--muted)]">No public resources are visible yet.</p>
              ) : null}
            </div>
          </article>

          <article className="soft-card rounded-[32px] p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Quiz support</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">Course quizzes</h2>
            <div className="mt-4 space-y-2 text-sm text-[var(--muted)]">
              {quizTitles.length ? quizTitles.map((title) => <p key={title}>• {title}</p>) : <p>Quiz data appears after publication.</p>}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
