import { ArrowRight, MessageCircleMore, ShieldCheck, Youtube } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { buildGlobalWhatsAppUrl, extractApiErrorMessage } from "../lib/api";

interface LoginFormValues {
  email: string;
  password: string;
}

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
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="glass-panel rounded-[38px] px-6 py-10 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--brand)]">Welcome back</p>
        <h1 className="brand-title mt-4 text-4xl leading-tight text-slate-950 sm:text-5xl">Login to continue learning</h1>
        <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
          Open your dashboard, continue free lessons, check applications, and stay connected with the academy.
        </p>

        <div className="mt-8 space-y-4">
          <div className="soft-card rounded-[26px] p-5">
            <div className="inline-flex items-center gap-3">
              <Youtube className="size-5 text-red-600" />
              <p className="font-semibold text-slate-950">Access the in-platform free-learning library</p>
            </div>
          </div>
          <div className="soft-card rounded-[26px] p-5">
            <div className="inline-flex items-center gap-3">
              <ShieldCheck className="size-5 text-[var(--brand)]" />
              <p className="font-semibold text-slate-950">Track applications, payments, and progress in one place</p>
            </div>
          </div>
        </div>

        <a
          href={buildGlobalWhatsAppUrl("Assalamualaikum, I need help logging in to GoGreenTech Learning Academy.")}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-5 py-3 font-semibold text-[var(--copy)]"
        >
          <MessageCircleMore className="size-4 text-[var(--brand)]" />
          Need help on WhatsApp?
        </a>
      </section>

      <section className="soft-card rounded-[38px] px-6 py-10 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--brand)]">Student login</p>
        <h2 className="mt-4 text-3xl font-semibold text-slate-950">Sign in</h2>
        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">Email</label>
            <input
              {...register("email", { required: "Email is required." })}
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 outline-none"
              placeholder="student@example.com"
            />
            {errors.email ? <p className="mt-2 text-sm text-red-600">{errors.email.message}</p> : null}
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required." })}
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 outline-none"
              placeholder="Your password"
            />
            {errors.password ? <p className="mt-2 text-sm text-red-600">{errors.password.message}</p> : null}
          </div>
          {errors.root ? <p className="text-sm text-red-600">{errors.root.message}</p> : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--brand)] px-6 py-3 font-semibold text-white disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Login"}
            <ArrowRight className="size-4" />
          </button>
        </form>
        <p className="mt-6 text-sm text-[var(--muted)]">
          New here?{" "}
          <Link to="/register" className="font-semibold text-[var(--brand)]">
            Create an account
          </Link>
        </p>
      </section>
    </div>
  );
}
