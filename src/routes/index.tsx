import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, RefreshCw } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { Timeline } from "../components/Timeline";
import { SkillIcons } from "../components/SkillIcons";
import { Typewriter } from "../components/Typewriter";
import { techNewsQueryOptions } from "../lib/news.functions";
import { siteContentQueryOptions } from "../lib/content.functions";
import { useSiteContent } from "../lib/use-site-content";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Surendar — Full Stack Developer" },
      {
        name: "description",
        content:
          "Surendar, full stack developer in Chennai. Building the full picture — frontend, backend and beyond.",
      },
      { property: "og:title", content: "Surendar — Full Stack Developer" },
      {
        property: "og:description",
        content:
          "Full stack developer in Chennai building animated, space-inspired web experiences.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(siteContentQueryOptions);
  },

  errorComponent: ({ error }) => (
    <div role="alert" className="px-6 py-24 text-white/70">
      {error.message}
    </div>
  ),
  component: Index,
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const POLL_OPTIONS = [
  { label: "30s", value: 30_000 },
  { label: "1m", value: 60_000 },
  { label: "5m", value: 300_000 },
  { label: "Off", value: 0 },
];

function PostSkeleton() {
  return (
    <GlassCard className="!p-4">
      <div className="flex gap-4">
        <div className="h-24 w-32 shrink-0 animate-pulse rounded-xl bg-white/10" />
        <div className="min-w-0 flex-1">
          <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
          <div className="mt-2 h-3 w-full animate-pulse rounded bg-white/10" />
          <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-white/10" />
        </div>
      </div>
    </GlassCard>
  );
}

function LatestPosts() {
  const [pollMs, setPollMs] = useState(60_000);
  const { data: posts, isPending, isFetching, isError, refetch } = useQuery({
    ...techNewsQueryOptions,
    refetchInterval: pollMs > 0 ? pollMs : false,
  });

  const controls = (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <span className="text-[11px] uppercase tracking-wider text-white/40">Refresh</span>
      <div className="flex overflow-hidden rounded-full border border-white/15">
        {POLL_OPTIONS.map((o) => (
          <button
            key={o.label}
            type="button"
            onClick={() => setPollMs(o.value)}
            className={`px-2.5 py-1 text-[11px] transition-colors ${
              pollMs === o.value ? "bg-white/90 text-[#0b0b14]" : "text-white/65 hover:bg-white/10"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => refetch()}
        disabled={isFetching}
        className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] text-white/80 transition-colors hover:bg-white/10 disabled:opacity-60"
      >
        <RefreshCw className={`h-3 w-3 ${isFetching ? "animate-spin" : ""}`} />
        {isFetching ? "Updating" : "Refresh now"}
      </button>
    </div>
  );

  let body: React.ReactNode;

  if (isPending) {
    body = (
      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  } else if (isError || !posts || posts.length === 0) {
    body = (
      <GlassCard className="!p-5">
        <p className="text-sm text-white/60">
          Tech headlines are unavailable right now.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-white hover:underline"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Try again
        </button>
      </GlassCard>
    );
  } else {
    body = (
      <div
        className={`space-y-4 transition-opacity duration-300 ${isFetching ? "opacity-70" : "opacity-100"}`}
      >
        {posts.map((p) => (
          <GlassCard key={p.id} className="!p-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              {p.imageUrl && (
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  loading="lazy"
                  className="h-40 w-full shrink-0 rounded-xl object-cover sm:h-28 sm:w-40"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-wider text-white/45">
                  <span className="truncate">{p.source}</span>
                  <time dateTime={p.publishedAt} className="shrink-0">
                    {formatDate(p.publishedAt)}
                  </time>
                </div>
                <h3 className="mt-1.5 text-lg font-semibold leading-snug text-white">
                  {p.title}
                </h3>
                {p.excerpt && (
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-white/65">
                    {p.excerpt}
                  </p>
                )}
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-2 inline-block text-sm font-semibold text-white hover:underline"
                >
                  Read more
                </a>
                {p.tags.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] capitalize text-white/70"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    );
  }

  return (
    <div>
      {controls}
      {body}
    </div>
  );
}



function Index() {
  const t = useSiteContent();

  return (
    <>
      {/* Hero */}
      <section className="relative mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 px-5 pb-16 pt-6 sm:px-6 sm:pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 lg:pt-10">
        <div className="min-w-0">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl font-semibold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-6xl font-display"
          >
            <Typewriter text={t("hero_name", "Surendar")} />
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="mt-3 font-display text-xs font-semibold uppercase tracking-widest text-white/90 sm:text-sm"
          >
            {t("hero_role", "FULL STACK DEVELOPER")}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
          >
            {t("hero_quote", "Building the full picture — frontend, backend and beyond.")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="mt-5 flex items-center gap-2 text-white/60"
          >
            <MapPin className="h-5 w-5 shrink-0" />
            <span className="text-base">{t("hero_location", "Chennai, IN")}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/about"
              className="inline-flex items-center rounded-full border border-white/70 bg-white/90 px-5 py-2.5 text-sm font-medium text-[#0b0b14] transition-colors hover:bg-white"
            >
              {t("hero_cta_primary", "Know Me")}
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              {t("hero_cta_secondary", "Contact Me")}
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              {t("hero_cta_tertiary", "Schedule a Call")}
            </Link>
          </motion.div>



          {/* Skills — directly under the nameplate */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45 }}
            className="mt-12 min-w-0"
          >
            <h2 className="text-xs uppercase tracking-[0.3em] text-white/45">
              {t("home_skills_heading", "Skills")}
            </h2>
            <div className="mt-5">
              <SkillIcons />
            </div>
          </motion.div>
        </div>

        {/* Latest tech-world posts — right rail */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="min-w-0"
        >
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {t("home_posts_heading", "Latest Posts")}
            </h2>
            <Link to="/blog" className="text-sm text-white/60 hover:text-white">
              View all
            </Link>
          </div>
          <p className="mt-2 text-sm text-white/55">Live headlines from the tech world.</p>
          <div className="mt-6">
            <LatestPosts />
          </div>
        </motion.div>
      </section>



      {/* About / Process */}
      <section className="relative mx-auto max-w-6xl px-5 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <GlassCard>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              About
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              {t("about_heading", "A developer who moves like light")}
            </h2>
            <p className="mt-4 whitespace-pre-line leading-relaxed text-white/70">
              {t(
                "about_body",
                "I'm Surendar — a full stack developer obsessed with the space between engineering and art.",
              )}
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-3 text-sm">
              {["TypeScript", "React / R3F", "Node / Edge", "Postgres", "Motion", "Design Systems"].map(
                (t) => (
                  <li
                    key={t}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white/80"
                  >
                    {t}
                  </li>
                ),
              )}
            </ul>
          </GlassCard>

          <GlassCard>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Process
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              {t("process_heading", "A tactical playbook")}
            </h2>
            <ol className="mt-6 space-y-4">
              {[
                { t: "Chart the mission", d: "Understand the product, users, and constraints before writing a line." },
                { t: "Engineer the core", d: "Ship a robust foundation — data, types, and boundaries first." },
                { t: "Layer the light", d: "Add motion, texture, and interaction with intention, never noise." },
                { t: "Measure & refine", d: "Instrument, benchmark, and polish until it feels effortless." },
              ].map((s, i) => (
                <li key={s.t} className="flex gap-4">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-medium text-white">
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-medium text-white">{s.t}</div>
                    <div className="text-sm text-white/60">{s.d}</div>
                  </div>
                </li>
              ))}
            </ol>
          </GlassCard>
        </div>
      </section>

      <Timeline />
    </>
  );
}
