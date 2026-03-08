import { ArrowRight, CheckCircle2, MessageCircleMore, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { api, extractApiErrorMessage, extractResults } from "../lib/api";
import type { ApplicationResponse, Course, HomepageContent } from "../types/api";

interface ApplicationFormValues {
  course: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferred_contact_whatsapp: boolean;
  agreed_via_whatsapp: boolean;
}

const fallbackContent: HomepageContent = {
  id: 0,
  site_name: "GoGreenTech Learning Academy",
  tagline: "Project-based learning with WhatsApp-first enrollment",
  hero_title: "",
  hero_subtitle: "",
  intro_text: "",
  about_title: "",
  about_description: "",
  intro_video_urls: [],
  why_choose_us: [
    "Preview the academy style before enrollment",
    "Discuss the best course and pricing on WhatsApp",
    "Move into a practical track with clear next steps",
  ],
  learning_modes: [],
  owner_name: "Rashid Zada",
  owner_role: "Software Engineer",
  owner_email: "rashidzad6@gmail.com",
  owner_whatsapp: "03470983567",
  owner_qualification: "",
  owner_photo: null,
  owner_photo_display_url: "",
  owner_photo_url: "",
  owner_profile_url: "https://rashidzada.pythonanywhere.com/",
  footer_note: "",
};

export function ApplicationPage() {
  const [searchParams] = useSearchParams();
  const selectedCourseId = Number(searchParams.get("course") ?? 0);
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [content, setContent] = useState<HomepageContent>(fallbackContent);
  const [submitted, setSubmitted] = useState<ApplicationResponse | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const {
    control,
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

  const watchedCourseId = useWatch({ control, name: "course" });
  const selectedCourse = courses.find((course) => course.id === Number(watchedCourseId));

  useEffect(() => {
    const load = async () => {
      try {
        const [courseResponse, homepageResponse] = await Promise.all([
          api.get("/courses/"),
          api.get<HomepageContent>("/website/homepage/"),
        ]);
        setCourses(extractResults<Course>(courseResponse.data));
        setContent(homepageResponse.data);
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
      setError("root", {
        message: extractApiErrorMessage(error, "Application submission failed. Please try again."),
      });
    }
  });

  return (
    <div className="space-y-8">
      <section className="glass-panel rounded-[40px] px-6 py-10 sm:px-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--brand)]">Admission form</p>
            <h1 className="brand-title mt-4 max-w-3xl text-4xl leading-tight text-slate-950 sm:text-5xl">
              Make admission easy for the student from the first message
            </h1>
            <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
              Submit interest here, store the lead in Django, and continue the conversation directly on WhatsApp with pricing and guidance.
            </p>

            <div className="mt-8 space-y-4">
              {content.why_choose_us.slice(0, 3).map((point, index) => (
                <div key={point} className="soft-card rounded-[26px] p-5">
                  <div className="inline-flex items-center gap-3">
                    {index === 2 ? (
                      <ShieldCheck className="size-5 text-[var(--brand)]" />
                    ) : (
                      <CheckCircle2 className="size-5 text-[var(--brand)]" />
                    )}
                    <p className="font-semibold text-slate-950">{point}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[28px] bg-[var(--highlight)] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--brand)]">Owner support</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">{content.owner_name}</h2>
              <p className="mt-1 text-sm font-semibold text-[var(--muted)]">{content.owner_role}</p>
              <p className="mt-4 text-sm leading-7 text-[var(--copy)]">
                Students who are unsure about the right track can submit this form first, then continue the conversation on WhatsApp for course fit and pricing.
              </p>
            </div>
          </div>

          <div className="soft-card rounded-[34px] p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--brand)]">Student application</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-950">Apply now</h2>
              </div>
              {selectedCourse ? (
                <span className="rounded-full bg-[var(--highlight)] px-4 py-2 text-sm font-semibold text-[var(--brand-deep)]">
                  {selectedCourse.level}
                </span>
              ) : null}
            </div>

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
                  placeholder="Tell the academy about the student's goals, schedule, or preferred learning mode."
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
                className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand)] px-6 py-3 font-semibold text-white disabled:opacity-70"
              >
                {isSubmitting ? "Submitting..." : "Submit application"}
                <ArrowRight className="size-4" />
              </button>
              {errors.root ? <p className="md:col-span-2 text-sm text-red-600">{errors.root.message}</p> : null}
            </form>

            {selectedCourse ? (
              <div className="mt-6 rounded-[24px] border border-[var(--line)] bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--brand)]">Selected course</p>
                <h3 className="mt-3 text-xl font-semibold text-slate-950">{selectedCourse.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{selectedCourse.short_description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[var(--highlight)] px-3 py-1.5 text-sm font-semibold text-[var(--brand-deep)]">
                    {selectedCourse.price_display}
                  </span>
                  <span className="rounded-full border border-[var(--line)] px-3 py-1.5 text-sm font-semibold text-[var(--copy)]">
                    {selectedCourse.duration}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {submitted ? (
        <section className="soft-card rounded-[34px] p-7">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--brand)]">Application submitted</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">The student request is stored successfully.</h2>
          <p className="mt-4 max-w-2xl text-[var(--muted)]">
            Your request for <span className="font-semibold text-slate-950">{submitted.course_title}</span> has been saved in the backend. Continue on WhatsApp to confirm the best path and pricing.
          </p>
          <a
            href={submitted.whatsapp_url}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--brand)] px-5 py-3 font-semibold text-[var(--brand-deep)]"
          >
            <MessageCircleMore className="size-4" />
            Continue on WhatsApp
          </a>
        </section>
      ) : null}
    </div>
  );
}
