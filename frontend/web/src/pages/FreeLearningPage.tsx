import { ArrowRight, PlayCircle, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { LoadingBlock } from "../components/LoadingBlock";
import { SectionHeading } from "../components/SectionHeading";
import { api, extractApiErrorMessage, extractResults } from "../lib/api";
import { YOUTUBE_CHANNEL_HANDLE, YOUTUBE_CHANNEL_NAME } from "../lib/brand-links";
import type { PaginatedResponse } from "../types/api";
import type { FreeLearningVideo } from "../types/api";

export function FreeLearningPage() {
  const [videos, setVideos] = useState<FreeLearningVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get<PaginatedResponse<FreeLearningVideo> | FreeLearningVideo[]>("/website/free-videos/");
        setVideos(extractResults(data));
        setLoadError(null);
      } catch (error) {
        setLoadError(extractApiErrorMessage(error, "Free learning videos could not be loaded right now."));
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  if (isLoading) {
    return <LoadingBlock label="Loading free learning videos..." />;
  }

  return (
    <div className="space-y-10">
      <section className="glass-panel rounded-[36px] px-6 py-10 sm:px-10">
        <SectionHeading
          eyebrow="Free Learning"
          title={`Learn free in Pashto from ${YOUTUBE_CHANNEL_NAME}`}
          description="These free lessons are managed in Django admin and embedded directly into the platform, so logged-in students can study here without being pushed to YouTube first."
        />
        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm font-semibold text-[var(--muted)]">
          <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-red-700">
            <Youtube className="size-4" />
            {YOUTUBE_CHANNEL_HANDLE}
          </span>
          <span className="rounded-full bg-[var(--highlight)] px-4 py-2 text-[var(--brand-deep)]">
            Embedded playback inside GoGreenTech
          </span>
        </div>
        {loadError ? <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{loadError}</p> : null}
      </section>

      {videos.length === 0 && !loadError ? (
        <section className="soft-card rounded-[30px] p-8">
          <h2 className="text-2xl font-semibold text-slate-950">Free lessons will appear here soon.</h2>
          <p className="mt-3 max-w-2xl text-[var(--muted)]">
            The admin can upload and publish Pashto free-learning videos from Django, and this student library will update automatically.
          </p>
        </section>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-2">
        {videos.map((video) => (
          <article key={video.id} className="soft-card overflow-hidden rounded-[30px]">
            <div className="overflow-hidden bg-slate-950">
              <iframe
                src={video.embed_url}
                title={video.title}
                className="aspect-video w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-[var(--brand)]">
                <PlayCircle className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.24em]">Free Pashto lesson</span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-slate-950">{video.title}</h2>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                {video.description || "Watch this lesson directly here, then continue into the course catalog when you want guided study."}
              </p>
              <Link to="/courses" className="mt-6 inline-flex items-center gap-2 font-semibold text-[var(--brand)]">
                Continue to courses
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
