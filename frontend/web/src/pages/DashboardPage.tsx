import {
  Activity,
  ArrowRight,
  BellRing,
  BookOpen,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { LoadingBlock } from "../components/LoadingBlock";
import { useAuth } from "../hooks/useAuth";
import { api, extractApiErrorMessage } from "../lib/api";
import type { AdminDashboardData, StudentDashboardData } from "../types/api";

function formatShortDate(value: string | null | undefined) {
  if (!value) {
    return "Recently";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function EmptyPanel({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-[var(--line-strong)] bg-[var(--bg)]/70 px-4 py-5">
      <p className="font-semibold text-slate-950">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{copy}</p>
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState<StudentDashboardData | null>(null);
  const [adminData, setAdminData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoadError(null);

        if (user?.role === "admin") {
          const { data } = await api.get<AdminDashboardData>("/dashboard/admin/stats/");
          setAdminData(data);
          setStudentData(null);
          return;
        }

        const { data } = await api.get<StudentDashboardData>("/dashboard/student/");
        setStudentData(data);
        setAdminData(null);
      } catch (error) {
        setLoadError(extractApiErrorMessage(error, "Dashboard data could not be loaded right now."));
      } finally {
        setIsLoading(false);
      }
    };

    if (!user) {
      return;
    }

    void load();
  }, [user]);

  if (!user || isLoading) {
    return <LoadingBlock label="Preparing dashboard..." />;
  }

  if (loadError) {
    return (
      <section className="glass-panel rounded-[30px] px-5 py-7 sm:rounded-[36px] sm:px-8 sm:py-10 lg:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--brand)]">Dashboard unavailable</p>
        <h1 className="brand-title mt-4 text-3xl text-slate-950 sm:text-4xl">The dashboard could not be loaded.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">{loadError}</p>
        <Link
          to="/courses"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-6 py-3 font-semibold text-white"
        >
          Browse courses
          <ArrowRight className="size-4" />
        </Link>
      </section>
    );
  }

  if (user.role === "admin" && adminData) {
    const adminStats = [
      { label: "Students", value: adminData.total_students, icon: Users },
      { label: "Enrollments", value: adminData.total_enrollments, icon: GraduationCap },
      { label: "Active courses", value: adminData.total_active_courses, icon: LayoutDashboard },
      { label: "Applications", value: adminData.total_applications, icon: BellRing },
    ];

    return (
      <div className="space-y-5 sm:space-y-6">
        <section className="glass-panel rounded-[30px] px-5 py-7 sm:rounded-[36px] sm:px-8 sm:py-9 lg:px-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[var(--highlight)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--brand-deep)]">
              Admin dashboard
            </span>
            <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Live platform snapshot
            </span>
          </div>
          <h1 className="brand-title mt-4 max-w-3xl text-3xl leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Platform operations at a glance
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base sm:leading-8">
            Review student growth, recent admissions, and course performance from one responsive dashboard.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {adminStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="soft-card rounded-[24px] p-5">
                  <Icon className="size-5 text-[var(--brand)]" />
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.24em] text-[var(--muted)]">{stat.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950 sm:text-4xl">{stat.value}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <article className="soft-card rounded-[28px] p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-slate-950 sm:text-2xl">Recent applications</h2>
              <span className="rounded-full bg-[var(--highlight)] px-3 py-1 text-xs font-semibold text-[var(--brand-deep)]">
                Admissions queue
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {adminData.recent_applications.length > 0 ? (
                adminData.recent_applications.map((item) => (
                  <div key={item.id} className="rounded-[22px] border border-[var(--line)] bg-white p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-slate-950">{item.name}</p>
                        <p className="mt-1 text-sm text-[var(--muted)]">{item.course}</p>
                        <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
                          {formatShortDate(item.created_at)}
                        </p>
                      </div>
                      <span className="inline-flex rounded-full bg-[var(--highlight)] px-3 py-1 text-xs font-semibold text-[var(--brand-deep)]">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyPanel title="No recent applications" copy="New admission applications will appear here." />
              )}
            </div>
          </article>

          <article className="soft-card rounded-[28px] p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-950 sm:text-2xl">Recent signups</h2>
            <div className="mt-5 space-y-3">
              {adminData.recent_signups.length > 0 ? (
                adminData.recent_signups.map((signup) => (
                  <div key={signup.id} className="rounded-[22px] border border-[var(--line)] bg-white p-4">
                    <p className="font-semibold text-slate-950">{signup.full_name}</p>
                    <p className="mt-1 text-sm break-all text-[var(--muted)]">{signup.email}</p>
                  </div>
                ))
              ) : (
                <EmptyPanel title="No new signups" copy="Fresh student accounts will appear here." />
              )}
            </div>
          </article>
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <article className="soft-card rounded-[28px] p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-950 sm:text-2xl">Course statistics</h2>
            <div className="mt-5 space-y-3">
              {adminData.course_statistics.length > 0 ? (
                adminData.course_statistics.map((course) => (
                  <div key={course.title} className="rounded-[22px] border border-[var(--line)] bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-950">{course.title}</p>
                        <p className="mt-1 text-sm text-[var(--muted)]">{course.course_type}</p>
                      </div>
                      <span className="rounded-full bg-[var(--bg)] px-3 py-1 text-xs font-semibold text-[var(--brand-deep)]">
                        {course.enrollment_count} enrollments
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyPanel title="No course activity yet" copy="Course performance data will appear here." />
              )}
            </div>
          </article>

          <article className="soft-card rounded-[28px] p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-950 sm:text-2xl">Quiz activity</h2>
            <div className="mt-5 space-y-3">
              {adminData.quiz_activity.length > 0 ? (
                adminData.quiz_activity.map((item) => (
                  <div key={item.id} className="rounded-[22px] border border-[var(--line)] bg-white p-4">
                    <p className="font-semibold text-slate-950">{item.quiz_title}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      Score: {item.score}% • Correct: {item.correct_answers}/{item.total_questions}
                    </p>
                    <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
                      {formatShortDate(item.created_at)}
                    </p>
                  </div>
                ))
              ) : (
                <EmptyPanel title="No quiz activity yet" copy="Student quiz attempts will appear here." />
              )}
            </div>
          </article>
        </section>
      </div>
    );
  }

  if (!studentData) {
    return <LoadingBlock label="Loading student dashboard..." />;
  }

  const studentStats = [
    { label: "Enrolled courses", value: studentData.enrollments.length, icon: GraduationCap },
    { label: "Unread notifications", value: studentData.unread_notifications, icon: BellRing },
    { label: "Quiz history", value: studentData.quiz_attempts.length, icon: Activity },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="glass-panel rounded-[30px] px-5 py-7 sm:rounded-[36px] sm:px-8 sm:py-9 lg:px-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[var(--highlight)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--brand-deep)]">
            Student dashboard
          </span>
          <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Logged in as {studentData.profile.full_name}
          </span>
        </div>
        <h1 className="brand-title mt-4 max-w-3xl text-3xl leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
          Continue learning with a clearer mobile dashboard
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base sm:leading-8">
          Track your courses, payment records, notifications, and free-learning progress from one place.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {studentStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="soft-card rounded-[24px] p-5">
                <Icon className="size-5 text-[var(--brand)]" />
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.24em] text-[var(--muted)]">{stat.label}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950 sm:text-4xl">{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Link
            to="/courses"
            className="inline-flex items-center justify-between rounded-[24px] border border-[var(--line)] bg-white px-4 py-4 text-sm font-semibold text-[var(--copy)]"
          >
            Browse courses
            <ArrowRight className="size-4 text-[var(--brand)]" />
          </Link>
          <Link
            to="/free-learning"
            className="inline-flex items-center justify-between rounded-[24px] border border-[var(--line)] bg-white px-4 py-4 text-sm font-semibold text-[var(--copy)]"
          >
            Open free learning
            <ArrowRight className="size-4 text-[var(--brand)]" />
          </Link>
          <Link
            to="/profile"
            className="inline-flex items-center justify-between rounded-[24px] border border-[var(--line)] bg-white px-4 py-4 text-sm font-semibold text-[var(--copy)]"
          >
            Update profile
            <ArrowRight className="size-4 text-[var(--brand)]" />
          </Link>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.18fr_0.82fr]">
        <article className="soft-card rounded-[28px] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-950 sm:text-2xl">My courses</h2>
            <Link to="/courses" className="font-semibold text-[var(--brand)]">
              Browse more
            </Link>
          </div>
          <div className="mt-5 space-y-4">
            {studentData.enrollments.length > 0 ? (
              studentData.enrollments.map((enrollment) => (
                <div key={enrollment.id} className="rounded-[22px] border border-[var(--line)] bg-white p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-slate-950 sm:text-lg">{enrollment.course.title}</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {enrollment.status} • Progress {enrollment.progress_percent}%
                      </p>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--bg)]">
                        <div
                          className="h-full rounded-full bg-[var(--brand)]"
                          style={{ width: `${Math.max(0, Math.min(100, enrollment.progress_percent))}%` }}
                        />
                      </div>
                    </div>
                    <Link
                      to={`/courses/${enrollment.course.slug}`}
                      className="inline-flex items-center justify-center rounded-full bg-[var(--highlight)] px-4 py-2 text-sm font-semibold text-[var(--brand-deep)]"
                    >
                      Open course
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <EmptyPanel
                title="No enrolled courses yet"
                copy="Browse the course catalog, then apply to start your guided learning journey."
              />
            )}
          </div>
        </article>

        <div className="space-y-5">
          <article className="soft-card rounded-[28px] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <CreditCard className="size-5 text-[var(--brand)]" />
              <h2 className="text-xl font-semibold text-slate-950 sm:text-2xl">Payments</h2>
            </div>
            <div className="mt-5 space-y-3">
              {studentData.payments.length > 0 ? (
                studentData.payments.map((payment) => (
                  <a
                    key={payment.id}
                    href={payment.invoice_url}
                    className="block rounded-[22px] border border-[var(--line)] bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-950">{payment.course_title}</p>
                        <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                          Paid {payment.amount_paid} • Due {payment.amount_due}
                        </p>
                      </div>
                      <span className="rounded-full bg-[var(--highlight)] px-3 py-1 text-xs font-semibold text-[var(--brand-deep)]">
                        {payment.status}
                      </span>
                    </div>
                  </a>
                ))
              ) : (
                <EmptyPanel title="No payment records" copy="Payment history will appear here when invoices are generated." />
              )}
            </div>
          </article>

          <article className="soft-card rounded-[28px] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <BellRing className="size-5 text-[var(--brand)]" />
              <h2 className="text-xl font-semibold text-slate-950 sm:text-2xl">Notifications</h2>
            </div>
            <div className="mt-5 space-y-3">
              {studentData.notifications.length > 0 ? (
                studentData.notifications.slice(0, 4).map((notification) => (
                  <div key={notification.id} className="rounded-[22px] border border-[var(--line)] bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-semibold text-slate-950">{notification.title}</p>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          notification.is_read
                            ? "bg-slate-100 text-slate-600"
                            : "bg-[var(--highlight)] text-[var(--brand-deep)]"
                        }`}
                      >
                        {notification.is_read ? "Read" : "New"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{notification.message}</p>
                  </div>
                ))
              ) : (
                <EmptyPanel title="No notifications yet" copy="Updates from the academy will appear here." />
              )}
            </div>
          </article>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="soft-card rounded-[28px] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <Sparkles className="size-5 text-amber-500" />
            <h2 className="text-xl font-semibold text-slate-950 sm:text-2xl">Quiz history</h2>
          </div>
          <div className="mt-5 space-y-3">
            {studentData.quiz_attempts.length > 0 ? (
              studentData.quiz_attempts.slice(0, 4).map((attempt) => (
                <div key={attempt.id} className="rounded-[22px] border border-[var(--line)] bg-white p-4">
                  <p className="font-semibold text-slate-950">{attempt.quiz_title}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    Score {attempt.score}% • {attempt.correct_answers}/{attempt.total_questions} correct
                  </p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
                    {formatShortDate(attempt.created_at)}
                  </p>
                </div>
              ))
            ) : (
              <EmptyPanel title="No quiz attempts yet" copy="Complete a quiz from one of your lessons to see results here." />
            )}
          </div>
        </article>

        <article className="soft-card rounded-[28px] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <BookOpen className="size-5 text-[var(--brand)]" />
            <h2 className="text-xl font-semibold text-slate-950 sm:text-2xl">Study next</h2>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link to="/free-learning" className="rounded-[22px] border border-[var(--line)] bg-white p-4">
              <p className="font-semibold text-slate-950">Free learning library</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Watch embedded Pashto tech lessons inside the platform.
              </p>
            </Link>
            <Link to="/apply" className="rounded-[22px] border border-[var(--line)] bg-white p-4">
              <p className="font-semibold text-slate-950">Apply for admission</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Move from free learning into guided enrollment when you are ready.
              </p>
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}
