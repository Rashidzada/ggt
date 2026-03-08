import { ArrowRight, PlayCircle, Youtube } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { LoadingBlock } from "../components/LoadingBlock";
import { SectionHeading } from "../components/SectionHeading";
import { api, extractApiErrorMessage, extractResults } from "../lib/api";
import { YOUTUBE_CHANNEL_HANDLE, YOUTUBE_CHANNEL_NAME } from "../lib/brand-links";
import type { FreeLearningVideo, PaginatedResponse } from "../types/api";

export function FreeLearningPage() {
  const [videos, setVideos] = useState<FreeLearningVideo[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get<PaginatedResponse<FreeLearningVideo> | FreeLearningVideo[]>("/website/free-videos/");
        const nextVideos = extractResults(data);
        setVideos(nextVideos);
        setSelectedVideoId(nextVideos[0]?.id ?? null);
        setLoadError(null);
      } catch (error) {
        setLoadError(extractApiErrorMessage(error, "Free learning videos could not be loaded right now."));
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const activeVideo = useMemo(
    () => videos.find((video) => video.id === selectedVideoId) ?? videos[0] ?? null,
    [selectedVideoId, videos],
  );

  if (isLoading) {
    return <LoadingBlock label="Loading free learning videos..." />;
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="glass-panel rounded-[30px] px-5 py-7 sm:rounded-[36px] sm:px-8 sm:py-10 lg:px-10">
        <SectionHeading
          eyebrow="Free Learning"
          title={`Learn free in Pashto from ${YOUTUBE_CHANNEL_NAME}`}
          description="These lessons are managed in Django admin and shown inside the platform, so logged-in students can study here without being pushed out of the experience."
        />

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm font-semibold text-[var(--muted)]">
          <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-red-700">
            <Youtube className="size-4" />
            {YOUTUBE_CHANNEL_HANDLE}
          </span>
          <span className="rounded-full bg-[var(--highlight)] px-4 py-2 text-[var(--brand-deep)]">
            {videos.length} lessons ready inside GoGreenTech
          </span>
        </div>

        {loadError ? <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{loadError}</p> : null}
      </section>

      {videos.length === 0 && !loadError ? (
        <section className="soft-card rounded-[28px] p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-slate-950 sm:text-2xl">Free lessons will appear here soon.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
            The admin can upload and publish Pashto free-learning videos from Django, and this student library will update
            automatically.
          </p>
        </section>
      ) : null}

      {activeVideo ? (
        <section className="grid gap-5 xl:grid-cols-[1.18fr_0.82fr]">
          <article className="soft-card overflow-hidden rounded-[28px]">
            <div className="overflow-hidden bg-slate-950">
              <iframe
                src={activeVideo.embed_url}
                title={activeVideo.title}
                className="aspect-video w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 text-[var(--brand)]">
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--highlight)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-deep)]">
                  <PlayCircle className="size-3.5" />
                  Now playing
                </span>
                <span className="rounded-full border border-[var(--line)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                  {activeVideo.language || "Pashto"}
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-slate-950 sm:text-3xl">{activeVideo.title}</h2>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)] sm:text-base sm:leading-8">
                {activeVideo.description ||
                  "Watch this lesson directly here, then continue into the course catalog when you want guided study."}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand)] px-5 py-3 font-semibold text-white"
                >
                  Continue to courses
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  to="/apply"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-white px-5 py-3 font-semibold text-[var(--copy)]"
                >
                  Apply for admission
                  <ArrowRight className="size-4 text-[var(--brand)]" />
                </Link>
              </div>
            </div>
          </article>

          <aside className="soft-card rounded-[28px] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-950 sm:text-xl">Playlist</h3>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                Pick a lesson
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {videos.map((video) => {
                const isActive = video.id === activeVideo.id;

                return (
                  <button
                    key={video.id}
                    type="button"
                    onClick={() => setSelectedVideoId(video.id)}
                    className={`w-full rounded-[22px] border p-3 text-left transition ${
                      isActive
                        ? "border-[var(--brand)] bg-[var(--highlight)]/70 shadow-sm"
                        : "border-[var(--line)] bg-white hover:border-[var(--line-strong)]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="aspect-video w-28 shrink-0 rounded-2xl object-cover"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[var(--brand)]">
                          <PlayCircle className="size-4" />
                          <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
                            {isActive ? "Playing" : "Play"}
                          </span>
                        </div>
                        <p className="mt-2 line-clamp-2 font-semibold text-slate-950">{video.title}</p>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                          {video.description || "Free lesson managed from Django admin."}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        </section>
      ) : null}
    </div>
  );
}
