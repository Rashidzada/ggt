import { useForm, useWatch } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { extractApiErrorMessage } from "../lib/api";

interface RegisterFormValues {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
}

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
      setError("root", { message: extractApiErrorMessage(error, "Registration failed. Please verify the details and try again.") });
    }
  });

  return (
    <div className="mx-auto max-w-2xl">
      <section className="glass-panel rounded-[36px] px-6 py-10 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--brand)]">Create account</p>
        <h1 className="brand-title mt-4 text-5xl text-slate-950">Register as a student</h1>
        <form onSubmit={onSubmit} className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-900">Full name</label>
            <input
              {...register("full_name", { required: "Full name is required." })}
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 outline-none"
            />
            {errors.full_name ? <p className="mt-2 text-sm text-red-600">{errors.full_name.message}</p> : null}
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">Email</label>
            <input
              {...register("email", { required: "Email is required." })}
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 outline-none"
            />
            {errors.email ? <p className="mt-2 text-sm text-red-600">{errors.email.message}</p> : null}
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">Phone</label>
            <input
              {...register("phone_number", { required: "Phone number is required." })}
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 outline-none"
            />
            {errors.phone_number ? <p className="mt-2 text-sm text-red-600">{errors.phone_number.message}</p> : null}
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required.", minLength: 8 })}
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 outline-none"
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
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 outline-none"
            />
            {errors.confirm_password ? <p className="mt-2 text-sm text-red-600">{errors.confirm_password.message}</p> : null}
          </div>
          {errors.root ? <p className="md:col-span-2 text-sm text-red-600">{errors.root.message}</p> : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="md:col-span-2 rounded-full bg-[var(--brand)] px-6 py-3 font-semibold text-white disabled:opacity-70"
          >
            {isSubmitting ? "Creating account..." : "Register"}
          </button>
        </form>
        <p className="mt-6 text-sm text-[var(--muted)]">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-[var(--brand)]">
            Login here
          </Link>
        </p>
      </section>
    </div>
  );
}
