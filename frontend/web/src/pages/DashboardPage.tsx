import { Activity, BellRing, CreditCard, GraduationCap, LayoutDashboard, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { LoadingBlock } from "../components/LoadingBlock";
import { useAuth } from "../hooks/useAuth";
import { api, extractApiErrorMessage } from "../lib/api";
import type { AdminDashboardData, StudentDashboardData } from "../types/api";

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
      <section className="glass-panel rounded-[36px] px-6 py-10 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--brand)]">Dashboard unavailable</p>
        <h1 className="brand-title mt-4 text-4xl text-slate-950">The dashboard could not be loaded.</h1>
        <p className="mt-4 max-w-2xl text-[var(--muted)]">{loadError}</p>
        <Link
          to="/courses"
          className="mt-8 inline-flex rounded-full bg-[var(--brand)] px-6 py-3 font-semibold text-white"
        >
          Browse courses
        </Link>
      </section>
    );
  }

  if (user.role === "admin" && adminData) {
    return (
      <div className="space-y-8">
        <section className="glass-panel rounded-[36px] px-6 py-8 sm:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--brand)]">Admin dashboard</p>
          <h1 className="brand-title mt-4 text-5xl text-slate-950">Platform operations at a glance</h1>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Students", value: adminData.total_students, icon: Users },
              { label: "Enrollments", value: adminData.total_enrollments, icon: GraduationCap },
              { label: "Active courses", value: adminData.total_active_courses, icon: LayoutDashboard },
              { label: "Applications", value: adminData.total_applications, icon: BellRing },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="soft-card rounded-[28px] p-6">
                  <Icon className="size-6 text-[var(--brand)]" />
                  <p className="mt-5 text-sm uppercase tracking-[0.24em] text-[var(--muted)]">{stat.label}</p>
                  <p className="mt-3 text-4xl font-semibold text-slate-950">{stat.value}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <article className="soft-card rounded-[30px] p-6 xl:col-span-2">
            <h2 className="text-2xl font-semibold text-slate-950">Recent applications</h2>
            <div className="mt-5 space-y-3">
              {adminData.recent_applications.map((item) => (
                <div key={item.id} className="rounded-[22px] border border-[var(--line)] bg-white p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-950">{item.name}</p>
                      <p className="text-sm text-[var(--muted)]">{item.course}</p>
                    </div>
                    <span className="rounded-full bg-[var(--highlight)] px-3 py-1 text-xs font-semibold text-[var(--brand-deep)]">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="soft-card rounded-[30px] p-6">
            <h2 className="text-2xl font-semibold text-slate-950">Recent signups</h2>
            <div className="mt-5 space-y-3">
              {adminData.recent_signups.map((signup) => (
                <div key={signup.id} className="rounded-[22px] border border-[var(--line)] bg-white p-4">
                  <p className="font-semibold text-slate-950">{signup.full_name}</p>
                  <p className="text-sm text-[var(--muted)]">{signup.email}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <article className="soft-card rounded-[30px] p-6">
            <h2 className="text-2xl font-semibold text-slate-950">Course statistics</h2>
            <div className="mt-5 space-y-3">
              {adminData.course_statistics.map((course) => (
                <div key={course.title} className="rounded-[22px] border border-[var(--line)] bg-white p-4">
                  <p className="font-semibold text-slate-950">{course.title}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{course.course_type} - {course.enrollment_count} enrollments</p>
                </div>
              ))}
            </div>
          </article>

          <article className="soft-card rounded-[30px] p-6">
            <h2 className="text-2xl font-semibold text-slate-950">Quiz activity</h2>
            <div className="mt-5 space-y-3">
              {adminData.quiz_activity.map((item) => (
                <div key={item.id} className="rounded-[22px] border border-[var(--line)] bg-white p-4">
                  <p className="font-semibold text-slate-950">{item.quiz_title}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">Score: {item.score}% - Correct answers: {item.correct_answers}/{item.total_questions}</p>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    );
  }

  if (!studentData) {
    return <LoadingBlock label="Loading student dashboard..." />;
  }

  return (
    <div className="space-y-8">
      <section className="glass-panel rounded-[36px] px-6 py-8 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--brand)]">Student dashboard</p>
        <h1 className="brand-title mt-4 text-5xl text-slate-950">Welcome back, {studentData.profile.full_name}</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { label: "Enrolled courses", value: studentData.enrollments.length, icon: GraduationCap },
            { label: "Unread notifications", value: studentData.unread_notifications, icon: BellRing },
            { label: "Quiz history", value: studentData.quiz_attempts.length, icon: Activity },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="soft-card rounded-[28px] p-6">
                <Icon className="size-6 text-[var(--brand)]" />
                <p className="mt-5 text-sm uppercase tracking-[0.24em] text-[var(--muted)]">{stat.label}</p>
                <p className="mt-3 text-4xl font-semibold text-slate-950">{stat.value}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="soft-card rounded-[30px] p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-slate-950">My courses</h2>
            <Link to="/courses" className="font-semibold text-[var(--brand)]">
              Browse more
            </Link>
          </div>
          <div className="mt-5 space-y-4">
            {studentData.enrollments.map((enrollment) => (
              <div key={enrollment.id} className="rounded-[22px] border border-[var(--line)] bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">{enrollment.course.title}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{enrollment.status} - Progress {enrollment.progress_percent}%</p>
                  </div>
                  <Link
                    to={`/courses/${enrollment.course.slug}`}
                    className="rounded-full bg-[var(--highlight)] px-4 py-2 text-sm font-semibold text-[var(--brand-deep)]"
                  >
                    Open course
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </article>

        <div className="space-y-6">
          <article className="soft-card rounded-[30px] p-6">
            <div className="flex items-center gap-3">
              <CreditCard className="size-5 text-[var(--brand)]" />
              <h2 className="text-2xl font-semibold text-slate-950">Payments</h2>
            </div>
            <div className="mt-5 space-y-3">
              {studentData.payments.map((payment) => (
                <a
                  key={payment.id}
                  href={payment.invoice_url}
                  className="block rounded-[22px] border border-[var(--line)] bg-white p-4"
                >
                  <p className="font-semibold text-slate-950">{payment.course_title}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">Paid {payment.amount_paid} / Due {payment.amount_due} - {payment.status}</p>
                </a>
              ))}
            </div>
          </article>

          <article className="soft-card rounded-[30px] p-6">
            <h2 className="text-2xl font-semibold text-slate-950">Notifications</h2>
            <div className="mt-5 space-y-3">
              {studentData.notifications.map((notification) => (
                <div key={notification.id} className="rounded-[22px] border border-[var(--line)] bg-white p-4">
                  <p className="font-semibold text-slate-950">{notification.title}</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{notification.message}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
