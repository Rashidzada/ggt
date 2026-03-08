import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { api, extractApiErrorMessage, extractResults } from "../lib/api";
import type { ApplicationResponse, Course } from "../types/api";

interface ApplicationFormValues {
  course: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferred_contact_whatsapp: boolean;
  agreed_via_whatsapp: boolean;
}

export function ApplicationPage() {
  const [searchParams] = useSearchParams();
  const selectedCourseId = Number(searchParams.get("course") ?? 0);
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [submitted, setSubmitted] = useState<ApplicationResponse | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const {
    clearErrors,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ApplicationFormValues>({
    defaultValues: {
      course: selectedCourseId,
      name: user?.full_name ?? "",
      email: user?.email ?? "",
      phone: user?.phone_number ?? "",
      message: "",
      preferred_contact_whatsapp: true,
      agreed_via_whatsapp: true,
    },
  });

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get("/courses/");
        setCourses(extractResults<Course>(response.data));
        setLoadError(null);
      } catch (error) {
        setLoadError(extractApiErrorMessage(error, "Courses could not be loaded right now."));
      }
    };

    void load();
  }, []);

  useEffect(() => {
    reset({
      course: selectedCourseId,
      name: user?.full_name ?? "",
      email: user?.email ?? "",
      phone: user?.phone_number ?? "",
      message: "",
      preferred_contact_whatsapp: true,
      agreed_via_whatsapp: true,
    });
  }, [reset, selectedCourseId, user]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const payload = {
        ...values,
        course: Number(values.course),
      };
      const { data } = await api.post<ApplicationResponse>("/courses/applications/", payload);
      setSubmitted(data);
      clearErrors("root");
    } catch (error) {
      setError("root", { message: extractApiErrorMessage(error, "Application submission failed. Please try again.") });
    }
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="glass-panel rounded-[36px] px-6 py-10 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--brand)]">Application form</p>
        <h1 className="brand-title mt-4 text-5xl text-slate-950">Apply for a course</h1>
        <p className="mt-4 max-w-2xl text-[var(--muted)]">
          Submit your interest here. The application is stored in the backend, and you can continue the enrollment
          conversation directly on WhatsApp.
        </p>
        {loadError ? <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{loadError}</p> : null}
        <form onSubmit={onSubmit} className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-900">Select course</label>
            <select
              {...register("course", { required: "Please choose a course." })}
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 outline-none"
            >
              <option value="">Select one</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            {errors.course ? <p className="mt-2 text-sm text-red-600">{errors.course.message}</p> : null}
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">Name</label>
            <input
              {...register("name", { required: "Name is required." })}
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 outline-none"
            />
            {errors.name ? <p className="mt-2 text-sm text-red-600">{errors.name.message}</p> : null}
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">Email</label>
            <input
              {...register("email", { required: "Email is required." })}
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-900">Phone</label>
            <input
              {...register("phone", { required: "Phone number is required." })}
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-900">Message</label>
            <textarea
              rows={5}
              {...register("message")}
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 outline-none"
              placeholder="Tell the academy about your goals or preferred learning mode."
            />
          </div>
          <label className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-white px-4 py-3">
            <input type="checkbox" {...register("preferred_contact_whatsapp")} />
            Prefer contact on WhatsApp
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-white px-4 py-3">
            <input type="checkbox" {...register("agreed_via_whatsapp")} />
            Pricing can be finalized on WhatsApp
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="md:col-span-2 rounded-full bg-[var(--brand)] px-6 py-3 font-semibold text-white disabled:opacity-70"
          >
            {isSubmitting ? "Submitting..." : "Submit application"}
          </button>
          {errors.root ? <p className="md:col-span-2 text-sm text-red-600">{errors.root.message}</p> : null}
        </form>
      </section>

      {submitted ? (
        <section className="soft-card rounded-[30px] p-6">
          <h2 className="text-2xl font-semibold text-slate-950">Application submitted</h2>
          <p className="mt-3 text-[var(--muted)]">
            Your request for <span className="font-semibold text-slate-950">{submitted.course_title}</span> has been
            stored successfully.
          </p>
          <a
            href={submitted.whatsapp_url}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex rounded-full border border-[var(--brand)] px-5 py-3 font-semibold text-[var(--brand-deep)]"
          >
            Continue on WhatsApp
          </a>
        </section>
      ) : null}
    </div>
  );
}
