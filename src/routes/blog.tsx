import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { GlassCard } from "../components/GlassCard";
import { techNewsFeedQueryOptions } from "../lib/news.functions";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Tech Feed — Surendar" },
      {
        name: "description",
        content: "Live headlines from the tech world, refreshed in real time.",
      },
      { property: "og:title", content: "Tech Feed — Surendar" },
      {
        property: "og:description",
        content: "Live headlines from the tech world, refreshed in real time.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Blog,
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Blog() {
  const { data, isLoading } = useQuery(techNewsFeedQueryOptions);

  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Blog</p>
      <h1 className="mt-3 text-5xl font-semibold text-white">Tech feed</h1>
      <p className="mt-3 text-sm text-white/60">
        Real-time headlines from across the tech world.
      </p>
      <div className="mt-10 space-y-4">
        {isLoading &&
          [0, 1, 2, 3].map((i) => (
            <GlassCard key={i} className="!p-6">
              <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
              <div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-white/10" />
            </GlassCard>
          ))}

        {!isLoading && (!data || data.length === 0) && (
          <GlassCard className="!p-6">
            <p className="text-sm text-white/60">
              Tech headlines are unavailable right now.
            </p>
          </GlassCard>
        )}

        {data?.map((p) => (
          <GlassCard key={p.id} className="!p-6">
            <div className="flex items-center justify-between gap-3 text-xs text-white/50">
              <span className="truncate">{p.source}</span>
              <time dateTime={p.publishedAt}>{formatDate(p.publishedAt)}</time>
            </div>
            <div className="mt-1 text-xl font-medium text-white">{p.title}</div>
            {p.excerpt && (
              <p className="mt-2 text-sm leading-relaxed text-white/65">{p.excerpt}</p>
            )}
            <a
              href={p.url}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-3 inline-block text-sm font-medium text-white hover:underline"
            >
              Read the story
            </a>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
