import { useEffect } from "react";
import { useForm } from "react-hook-form";

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
    <div className="mx-auto max-w-3xl">
      <section className="glass-panel rounded-[36px] px-6 py-10 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--brand)]">Profile</p>
        <h1 className="brand-title mt-4 text-5xl text-slate-950">Manage your account details</h1>
        <p className="mt-4 text-[var(--muted)]">Email: {user?.email}</p>
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
            <label className="mb-2 block text-sm font-semibold text-slate-900">Phone</label>
            <input
              {...register("phone_number", { required: "Phone number is required." })}
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">City</label>
            <input {...register("city")} className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-900">Qualification</label>
            <input
              {...register("qualification")}
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-900">Bio</label>
            <textarea
              rows={5}
              {...register("bio")}
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="md:col-span-2 rounded-full bg-[var(--brand)] px-6 py-3 font-semibold text-white disabled:opacity-70"
          >
            {isSubmitting ? "Saving..." : "Save profile"}
          </button>
          {isSubmitSuccessful ? <p className="md:col-span-2 text-sm text-[var(--brand)]">Profile updated successfully.</p> : null}
        </form>
      </section>
    </div>
  );
}
