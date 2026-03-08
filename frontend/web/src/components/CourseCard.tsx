import { ArrowRight, BadgeCheck, CirclePlay, FolderKanban, GraduationCap, Puzzle } from "lucide-react";
import { Link } from "react-router-dom";

import type { Course } from "../types/api";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <article className="soft-card group flex h-full flex-col overflow-hidden rounded-[30px] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(18,75,49,0.14)]">
      <div className="relative">
        {course.thumbnail_url ? (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="h-52 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="h-52 w-full bg-gradient-to-br from-[#eef8ef] via-[#dcf0df] to-[#fff0de]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,38,31,0.58)] via-transparent to-transparent" />
        <div className="absolute left-5 top-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/88 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-deep)]">
            {course.level}
          </span>
          <span className="rounded-full bg-[rgba(15,38,31,0.72)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
            {course.category.title}
          </span>
        </div>
        {course.featured ? (
          <div className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full bg-[var(--highlight)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-deep)]">
            <BadgeCheck className="size-4" />
            Featured
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          <span>{course.duration}</span>
          <span>•</span>
          <span>{course.course_type}</span>
        </div>
        <h3 className="mt-3 text-2xl font-semibold text-slate-950">{course.title}</h3>
        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{course.short_description}</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[20px] bg-[var(--highlight)] px-4 py-3">
            <div className="inline-flex items-center gap-2 text-[var(--brand-deep)]">
              <FolderKanban className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.16em]">Lessons</span>
            </div>
            <p className="mt-2 text-lg font-semibold text-slate-950">{course.lessons_count}</p>
          </div>
          <div className="rounded-[20px] bg-white px-4 py-3 ring-1 ring-[var(--line)]">
            <div className="inline-flex items-center gap-2 text-[var(--brand-deep)]">
              <Puzzle className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.16em]">Quizzes</span>
            </div>
            <p className="mt-2 text-lg font-semibold text-slate-950">{course.quiz_count}</p>
          </div>
          <div className="rounded-[20px] bg-[var(--highlight-amber)] px-4 py-3">
            <div className="inline-flex items-center gap-2 text-[var(--brand-deep)]">
              <GraduationCap className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.16em]">Instructor</span>
            </div>
            <p className="mt-2 line-clamp-1 text-sm font-semibold text-slate-950">{course.instructor_name}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-[var(--line)] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Pricing</p>
            <p className="mt-1 text-lg font-semibold text-[var(--brand-deep)]">{course.price_display}</p>
          </div>
          <div className="flex w-full items-center gap-2 sm:w-auto sm:justify-end">
            {course.intro_video_url ? (
              <Link
                to={`/courses/${course.slug}#intro-video`}
                className="inline-flex size-11 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--brand)]"
                aria-label={`Watch intro for ${course.title} inside the site`}
              >
                <CirclePlay className="size-5" />
              </Link>
            ) : null}
            <Link
              to={`/courses/${course.slug}`}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--brand)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--brand-deep)] sm:flex-none"
            >
              Explore course
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
