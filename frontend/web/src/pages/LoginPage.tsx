import { ArrowRight, MessageCircleMore, ShieldCheck, UserCircle2, Youtube } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { buildGlobalWhatsAppUrl, extractApiErrorMessage } from "../lib/api";

interface LoginFormValues {
  email: string;
  password: string;
}

const loginHighlights = [
  "Continue your courses and free Pashto lessons",
  "Track applications, payments, and notifications",
  "Get WhatsApp support when you need admission help",
];

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>();

  const onSubmit = handleSubmit(async (values) => {
    try {
      const user = await login(values);
      const fallbackDestination = user.role === "admin" ? "/dashboard" : "/dashboard";
      const nextDestination = (location.state as { from?: string } | null)?.from ?? fallbackDestination;
      navigate(nextDestination, { replace: true });
    } catch (error) {
      setError("root", { message: extractApiErrorMessage(error, "Invalid email or password.") });
    }
  });

  return (
    <div className="grid gap-4 lg:grid-cols-[0.96fr_1.04fr] lg:gap-6">
      <section className="order-2 glass-panel rounded-[30px] px-5 py-6 sm:rounded-[38px] sm:px-8 sm:py-8 lg:order-1 lg:px-10 lg:py-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[var(--highlight)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--brand-deep)]">
            Student access
          </span>
          <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Mobile ready
          </span>
        </div>

        <h1 className="brand-title mt-4 max-w-xl text-3xl leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
          Login and continue your learning without friction
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base sm:leading-8">
          Open your dashboard, keep up with notifications, and move from free lessons into guided study from one simple
          account.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="soft-card rounded-[22px] p-4">
            <Youtube className="size-5 text-red-600" />
            <p className="mt-3 text-sm font-semibold text-slate-950">In-platform free learning</p>
          </div>
          <div className="soft-card rounded-[22px] p-4">
            <UserCircle2 className="size-5 text-[var(--brand)]" />
            <p className="mt-3 text-sm font-semibold text-slate-950">One account for study and admissions</p>
          </div>
          <div className="soft-card rounded-[22px] p-4">
            <ShieldCheck className="size-5 text-[var(--brand)]" />
            <p className="mt-3 text-sm font-semibold text-slate-950">Fast access to progress and support</p>
          </div>
        </div>

        <div className="mt-6 rounded-[26px] border border-white/70 bg-white/70 p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--brand)]">What you get after login</p>
          <div className="mt-4 space-y-3">
            {loginHighlights.map((highlight) => (
              <div key={highlight} className="flex items-start gap-3">
                <span className="mt-1 size-2 rounded-full bg-[var(--brand)]" />
                <p className="text-sm leading-6 text-[var(--copy)]">{highlight}</p>
              </div>
            ))}
          </div>
        </div>

        <a
          href={buildGlobalWhatsAppUrl("Assalamualaikum, I need help logging in to GoGreenTech Learning Academy.")}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--copy)] sm:w-auto"
        >
          <MessageCircleMore className="size-4 text-[var(--brand)]" />
          Need help on WhatsApp?
        </a>
      </section>

      <section className="order-1 soft-card rounded-[30px] px-5 py-6 sm:rounded-[38px] sm:px-8 sm:py-8 lg:order-2 lg:px-10 lg:py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--brand)]">Student login</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950 sm:text-3xl">Sign in</h2>
          </div>
          <span className="rounded-full border border-[var(--line)] bg-white px-3 py-1 text-xs font-semibold text-[var(--muted)]">
            Secure account access
          </span>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">Email</label>
            <input
              {...register("email", { required: "Email is required." })}
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3.5 outline-none"
              placeholder="student@example.com"
              inputMode="email"
              autoComplete="email"
            />
            {errors.email ? <p className="mt-2 text-sm text-red-600">{errors.email.message}</p> : null}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="block text-sm font-semibold text-slate-900">Password</label>
              <span className="text-xs font-medium text-[var(--muted)]">Use your student account password</span>
            </div>
            <input
              type="password"
              {...register("password", { required: "Password is required." })}
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3.5 outline-none"
              placeholder="Your password"
              autoComplete="current-password"
            />
            {errors.password ? <p className="mt-2 text-sm text-red-600">{errors.password.message}</p> : null}
          </div>

          {errors.root ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{errors.root.message}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--brand)] px-6 py-3.5 font-semibold text-white disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Open my dashboard"}
            <ArrowRight className="size-4" />
          </button>
        </form>

        <div className="mt-6 rounded-[26px] border border-[var(--line)] bg-white p-4 sm:p-5">
          <p className="text-sm font-semibold text-slate-950">New to GoGreenTech?</p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Create a student account to unlock the full free-learning library, applications, and progress tracking.
          </p>
          <Link
            to="/register"
            className="mt-4 inline-flex items-center gap-2 font-semibold text-[var(--brand)]"
          >
            Create an account
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
