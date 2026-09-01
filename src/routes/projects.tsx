import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { GlassCard } from "../components/GlassCard";
import { projectsQueryOptions } from "../lib/projects.functions";
import { siteContentQueryOptions } from "../lib/content.functions";
import { useSiteContent } from "../lib/use-site-content";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Surendar" },
      { name: "description", content: "Selected work by Surendar." },
      { property: "og:title", content: "Projects — Surendar" },
      { property: "og:description", content: "Selected work by Surendar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(projectsQueryOptions),
      context.queryClient.ensureQueryData(siteContentQueryOptions),
    ]);
  },
  errorComponent: ({ error }) => (
    <div role="alert" className="px-6 py-24 text-white/70">
      {error.message}
    </div>
  ),
  component: Projects,
});

function Projects() {
  const t = useSiteContent();
  const { data: projects } = useSuspenseQuery(projectsQueryOptions);

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">
        {t("projects_eyebrow", "Projects")}
      </p>
      <h1 className="mt-3 text-5xl font-semibold text-white">
        {t("projects_heading", "Selected work")}
      </h1>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {projects.length === 0 ? (
          <GlassCard>
            <p className="text-sm text-white/60">No projects yet.</p>
          </GlassCard>
        ) : (
          projects.map((p) => (
            <GlassCard key={p.id}>
              {p.image_url && (
                <img
                  src={p.image_url}
                  alt={`${p.name} cover`}
                  loading="lazy"
                  width={1024}
                  height={640}
                  className="mb-5 aspect-[16/10] w-full rounded-2xl border border-white/10 object-cover"
                />
              )}
              {p.tag && (
                <div className="text-xs uppercase tracking-widest text-white/50">{p.tag}</div>
              )}
              <h2 className="mt-2 font-display text-lg font-semibold text-white sm:text-xl">
                {p.name}
              </h2>
              <p className="mt-3 whitespace-pre-line text-white/70">{p.description}</p>
              {p.url && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-4 inline-flex text-sm font-medium text-white hover:underline"
                >
                  View demo on GitHub
                </a>
              )}
            </GlassCard>
          ))
        )}
      </div>
    </section>
  );
}
