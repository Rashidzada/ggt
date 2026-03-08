import { ArrowRight, GraduationCap, MessageCircleMore, ShieldCheck, Sparkles } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { buildGlobalWhatsAppUrl, extractApiErrorMessage } from "../lib/api";

interface RegisterFormValues {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
}

const registrationSteps = [
  "Create your student account with your email and phone number",
  "Login to access free learning, course details, and notifications",
  "Apply for admission and continue with guided support",
];

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormValues>();

  const password = useWatch({ control, name: "password" });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await registerUser(values);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setError("root", {
        message: extractApiErrorMessage(error, "Registration failed. Please verify the details and try again."),
      });
    }
  });

  return (
    <div className="grid gap-4 lg:grid-cols-[1.04fr_0.96fr] lg:gap-6">
      <section className="order-1 soft-card rounded-[30px] px-5 py-6 sm:rounded-[38px] sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--brand)]">Student registration</p>
            <h1 className="mt-3 text-2xl font-semibold text-slate-950 sm:text-3xl">Create your account</h1>
          </div>
          <span className="rounded-full border border-[var(--line)] bg-white px-3 py-1 text-xs font-semibold text-[var(--muted)]">
            Fast mobile signup
          </span>
        </div>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:mt-8 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-900">Full name</label>
            <input
              {...register("full_name", { required: "Full name is required." })}
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3.5 outline-none"
              autoComplete="name"
            />
            {errors.full_name ? <p className="mt-2 text-sm text-red-600">{errors.full_name.message}</p> : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">Email</label>
            <input
              {...register("email", { required: "Email is required." })}
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3.5 outline-none"
              autoComplete="email"
              inputMode="email"
            />
            {errors.email ? <p className="mt-2 text-sm text-red-600">{errors.email.message}</p> : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">Phone</label>
            <input
              {...register("phone_number", { required: "Phone number is required." })}
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3.5 outline-none"
              autoComplete="tel"
              inputMode="tel"
            />
            {errors.phone_number ? <p className="mt-2 text-sm text-red-600">{errors.phone_number.message}</p> : null}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="block text-sm font-semibold text-slate-900">Password</label>
              <span className="text-xs font-medium text-[var(--muted)]">Minimum 8 characters</span>
            </div>
            <input
              type="password"
              {...register("password", { required: "Password is required.", minLength: 8 })}
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3.5 outline-none"
              autoComplete="new-password"
            />
            {errors.password ? <p className="mt-2 text-sm text-red-600">Password must be at least 8 characters.</p> : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">Confirm password</label>
            <input
              type="password"
              {...register("confirm_password", {
                required: "Please confirm the password.",
                validate: (value) => value === password || "Passwords do not match.",
              })}
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3.5 outline-none"
              autoComplete="new-password"
            />
            {errors.confirm_password ? <p className="mt-2 text-sm text-red-600">{errors.confirm_password.message}</p> : null}
          </div>

          {errors.root ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2">{errors.root.message}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--brand)] px-6 py-3.5 font-semibold text-white disabled:opacity-70 md:col-span-2"
          >
            {isSubmitting ? "Creating account..." : "Create my student account"}
            <ArrowRight className="size-4" />
          </button>
        </form>

        <div className="mt-6 rounded-[26px] border border-[var(--line)] bg-white p-4 sm:p-5">
          <p className="text-sm font-semibold text-slate-950">Already registered?</p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Login to continue with your free lessons, applications, and dashboard updates.
          </p>
          <Link to="/login" className="mt-4 inline-flex items-center gap-2 font-semibold text-[var(--brand)]">
            Login here
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="order-2 glass-panel rounded-[30px] px-5 py-6 sm:rounded-[38px] sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[var(--highlight)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--brand-deep)]">
            Join the academy
          </span>
          <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Admission funnel ready
          </span>
        </div>

        <h2 className="brand-title mt-4 max-w-xl text-3xl leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
          Start with a simple account and grow into guided learning
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base sm:leading-8">
          Register once to access the free-learning library, track your admission process, and move into premium courses
          with direct support.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="soft-card rounded-[22px] p-4">
            <GraduationCap className="size-5 text-[var(--brand)]" />
            <p className="mt-3 text-sm font-semibold text-slate-950">Courses and lesson previews</p>
          </div>
          <div className="soft-card rounded-[22px] p-4">
            <ShieldCheck className="size-5 text-[var(--brand)]" />
            <p className="mt-3 text-sm font-semibold text-slate-950">Notifications and payment updates</p>
          </div>
          <div className="soft-card rounded-[22px] p-4">
            <Sparkles className="size-5 text-amber-500" />
            <p className="mt-3 text-sm font-semibold text-slate-950">A cleaner path to admission</p>
          </div>
        </div>

        <div className="mt-6 rounded-[26px] border border-white/70 bg-white/70 p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--brand)]">How it works</p>
          <div className="mt-4 space-y-4">
            {registrationSteps.map((step, index) => (
              <div key={step} className="flex items-start gap-3">
                <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-xs font-bold text-white">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm leading-6 text-[var(--copy)]">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <a
          href={buildGlobalWhatsAppUrl("Assalamualaikum, I need help creating my GoGreenTech student account.")}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--copy)] sm:w-auto"
        >
          <MessageCircleMore className="size-4 text-[var(--brand)]" />
          Need help on WhatsApp?
        </a>
      </section>
    </div>
  );
}
