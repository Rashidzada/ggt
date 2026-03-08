import { Mail, MapPin, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

interface ProfileFormValues {
  full_name: string;
  phone_number: string;
  city: string;
  qualification: string;
  bio: string;
}

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, isSubmitSuccessful },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      full_name: user?.full_name ?? "",
      phone_number: user?.phone_number ?? "",
      city: user?.profile.city ?? "",
      qualification: user?.profile.qualification ?? "",
      bio: user?.profile.bio ?? "",
    },
  });

  useEffect(() => {
    reset({
      full_name: user?.full_name ?? "",
      phone_number: user?.phone_number ?? "",
      city: user?.profile.city ?? "",
      qualification: user?.profile.qualification ?? "",
      bio: user?.profile.bio ?? "",
    });
  }, [reset, user]);

  const onSubmit = handleSubmit(async (values) => {
    await updateProfile({
      full_name: values.full_name,
      phone_number: values.phone_number,
      profile: {
        city: values.city,
        qualification: values.qualification,
        bio: values.bio,
      },
    });
  });

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <aside className="glass-panel rounded-[30px] px-5 py-6 sm:rounded-[36px] sm:px-8 sm:py-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[var(--highlight)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--brand-deep)]">
            Profile
          </span>
          <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Student account
          </span>
        </div>

        <h1 className="brand-title mt-4 text-3xl leading-tight text-slate-950 sm:text-4xl">
          Keep your student profile complete and professional
        </h1>
        <p className="mt-4 text-sm leading-7 text-[var(--muted)] sm:text-base sm:leading-8">
          Update your details so the academy can guide admissions, payments, notifications, and support without delay.
        </p>

        <div className="mt-6 space-y-3">
          <div className="soft-card rounded-[22px] p-4">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 text-[var(--brand)]" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Email</p>
                <p className="mt-2 break-all font-semibold text-slate-950">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="soft-card rounded-[22px] p-4">
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 size-4 text-[var(--brand)]" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Phone</p>
                <p className="mt-2 font-semibold text-slate-950">{user?.phone_number || "Add your phone number"}</p>
              </div>
            </div>
          </div>

          <div className="soft-card rounded-[22px] p-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 text-[var(--brand)]" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">City</p>
                <p className="mt-2 font-semibold text-slate-950">{user?.profile.city || "Add your city"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[26px] border border-white/70 bg-white/70 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-5 text-[var(--brand)]" />
            <p className="font-semibold text-slate-950">Why this matters</p>
          </div>
          <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--copy)]">
            <p>Accurate profile details make admissions follow-up and payment support faster.</p>
            <p>Your bio and qualification help the academy guide you toward the right learning path.</p>
          </div>
        </div>

        <Link
          to="/dashboard"
          className="mt-6 inline-flex items-center gap-2 font-semibold text-[var(--brand)]"
        >
          Back to dashboard
          <Sparkles className="size-4" />
        </Link>
      </aside>

      <section className="soft-card rounded-[30px] px-5 py-6 sm:rounded-[36px] sm:px-8 sm:py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--brand)]">Edit profile</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950 sm:text-3xl">Manage your account details</h2>
          </div>
          <span className="rounded-full border border-[var(--line)] bg-white px-3 py-1 text-xs font-semibold text-[var(--muted)]">
            Mobile-friendly form
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
            <label className="mb-2 block text-sm font-semibold text-slate-900">Phone</label>
            <input
              {...register("phone_number", { required: "Phone number is required." })}
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3.5 outline-none"
              autoComplete="tel"
              inputMode="tel"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">City</label>
            <input
              {...register("city")}
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3.5 outline-none"
              autoComplete="address-level2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-900">Qualification</label>
            <input
              {...register("qualification")}
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3.5 outline-none"
              placeholder="BS Computer Science, Web Development, etc."
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-900">Bio</label>
            <textarea
              rows={5}
              {...register("bio")}
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3.5 outline-none"
              placeholder="Tell the academy about your learning goals."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-[var(--brand)] px-6 py-3.5 font-semibold text-white disabled:opacity-70 md:col-span-2"
          >
            {isSubmitting ? "Saving..." : "Save profile"}
          </button>

          {isSubmitSuccessful ? (
            <p className="rounded-2xl bg-[var(--highlight)] px-4 py-3 text-sm text-[var(--brand-deep)] md:col-span-2">
              Profile updated successfully.
            </p>
          ) : null}
        </form>
      </section>
    </div>
  );
}
