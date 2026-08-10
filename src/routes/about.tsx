import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "../components/GlassCard";
import { siteContentQueryOptions } from "../lib/content.functions";
import { useSiteContent } from "../lib/use-site-content";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Surendar" },
      { name: "description", content: "About Surendar, full stack developer." },
      { property: "og:title", content: "About — Surendar" },
      { property: "og:description", content: "About Surendar, full stack developer." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(siteContentQueryOptions);
    } catch {
      // Safe fallback
    }
  },
  errorComponent: ({ error }) => (
    <div role="alert" className="px-6 py-24 text-white/70">
      {error.message}
    </div>
  ),
  notFoundComponent: () => <div className="px-6 py-24 text-white/70">Not found.</div>,
  component: About,
});

function About() {
  const t = useSiteContent();

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-24">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">About</p>
      <h1 className="mt-3 text-3xl min-[380px]:text-4xl sm:text-5xl font-semibold text-white">
        {t("about_page_heading", "Surendar")}
      </h1>
      <p className="mt-6 max-w-2xl text-white/70">
        {t(
          "about_page_intro",
          "Full stack developer building interfaces where engineering meets art — precise, animated, and quietly beautiful.",
        )}
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <GlassCard>
          <h2 className="text-xl font-semibold text-white">
            {t("about_do_heading", "What I do")}
          </h2>
          <p className="mt-3 whitespace-pre-line text-white/70">
            {t(
              "about_do_body",
              "End-to-end product engineering: type-safe APIs, realtime systems, motion, and 3D — shipped as cohesive experiences.",
            )}
          </p>
        </GlassCard>
        <GlassCard>
          <h2 className="text-xl font-semibold text-white">
            {t("about_work_heading", "How I work")}
          </h2>
          <p className="mt-3 whitespace-pre-line text-white/70">
            {t(
              "about_work_body",
              "Small commits, tight loops, sharp taste. I care about performance, accessibility, and the feel of every interaction.",
            )}
          </p>
        </GlassCard>
      </div>
    </section>
  );
}
