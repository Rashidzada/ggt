import { ArrowRight, BadgeCheck, CirclePlay } from "lucide-react";
import { Link } from "react-router-dom";

import type { Course } from "../types/api";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <article className="soft-card group flex h-full flex-col rounded-[28px] p-6 transition duration-300 hover:-translate-y-1">
      <div className="mb-4 flex items-center justify-between text-sm text-[var(--muted)]">
        <span className="rounded-full bg-[var(--highlight)] px-3 py-1 font-semibold text-[var(--brand-deep)]">
          {course.level}
        </span>
        {course.featured ? <BadgeCheck className="size-5 text-[var(--brand)]" /> : null}
      </div>
      <div className="mb-5 rounded-[24px] bg-gradient-to-br from-[#edf8ef] to-[#dff2e3] p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">{course.category.title}</p>
        <h3 className="mt-3 text-2xl font-semibold text-slate-900">{course.title}</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">{course.duration}</p>
      </div>
      <p className="mb-5 text-sm leading-6 text-[var(--muted)]">{course.short_description}</p>
      <div className="mt-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Pricing</p>
          <p className="mt-1 font-semibold text-[var(--brand-deep)]">{course.price_display}</p>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto sm:justify-end">
          {course.intro_video_url ? (
            <Link
              to={`/courses/${course.slug}#intro-video`}
              className="inline-flex size-11 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--brand)]"
              aria-label={`Play intro for ${course.title} inside the site`}
            >
              <CirclePlay className="size-5" />
            </Link>
          ) : null}
          <Link
            to={`/courses/${course.slug}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--brand)] px-4 py-2.5 font-semibold text-white transition hover:bg-[var(--brand-deep)] sm:flex-none"
          >
            Explore
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
