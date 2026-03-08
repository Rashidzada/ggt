import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { extractApiErrorMessage } from "../lib/api";

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
    <div className="mx-auto max-w-xl">
      <section className="glass-panel rounded-[36px] px-6 py-10 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--brand)]">Welcome back</p>
        <h1 className="brand-title mt-4 text-5xl text-slate-950">Login to continue learning</h1>
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
            className="w-full rounded-full bg-[var(--brand)] px-6 py-3 font-semibold text-white disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Login"}
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
