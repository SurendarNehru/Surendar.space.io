<<<<<<< HEAD
import { createServerFn } from "@tanstack/react-start";
=======
>>>>>>> ff8c7d592c716ee34ce90be01f9302b4ea4f9dba
import { queryOptions } from "@tanstack/react-query";

export type TechNews = {
  id: string;
  title: string;
  excerpt: string;
  source: string;
  url: string;
  publishedAt: string;
  imageUrl: string | null;
  tags: string[];
};

<<<<<<< HEAD
type NewsDataArticle = {
  article_id?: string;
  title?: string;
  description?: string;
  source_id?: string;
  source_name?: string;
  link?: string;
  pubDate?: string;
  image_url?: string | null;
  keywords?: string[] | null;
  category?: string[] | null;
};


/**
 * Live tech-world headlines from newsdata.io.
 * Runs server-side so the API key never reaches the browser.
 */
const FALLBACK_NEWS: TechNews[] = [
  {
    id: "fb-1",
    title: "React 19 & Server Components: Modern Architecture Patterns",
    excerpt: "Exploring asynchronous rendering, server actions, and type-safe data loading in modern web frameworks.",
    source: "Tech Crunch",
    url: "https://react.dev",
    publishedAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80",
    tags: ["React", "TypeScript", "Frontend"],
  },
  {
    id: "fb-2",
    title: "Rendering High-Performance WebGL Scenes in the Browser",
    excerpt: "How Three.js and custom shaders allow developers to render tens of thousands of particles at 60 FPS.",
    source: "Hacker News",
    url: "https://threejs.org",
    publishedAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80",
    tags: ["WebGL", "ThreeJS", "Performance"],
  },
  {
    id: "fb-3",
    title: "Building Real-Time Edge APIs with Modern Databases",
    excerpt: "A deep dive into distributed Postgres, webhooks, and low-latency API architecture.",
    source: "Ars Technica",
    url: "https://supabase.com",
    publishedAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
    tags: ["Postgres", "APIs", "Backend"],
  },
];

export const getTechNews = createServerFn({ method: "GET" })
  .inputValidator((input: { limit?: number } | undefined) => ({
    limit: Math.min(Math.max(input?.limit ?? 3, 1), 10),
  }))
  .handler(async ({ data }): Promise<TechNews[]> => {
    const apikey = process.env["NEWSDATA_API_KEY"];
    if (!apikey) return FALLBACK_NEWS.slice(0, data.limit);
=======
const DEFAULT_NEWS: TechNews[] = [
  {
    id: "news-1",
    title: "The Evolution of Modern Web Development & React 19",
    excerpt: "Exploring the latest frontend innovations, server components, and performance optimizations.",
    source: "Tech Crunch",
    url: "https://surendar.space",
    publishedAt: new Date().toISOString(),
    imageUrl: null,
    tags: ["React", "WebDev", "Frontend"],
  },
  {
    id: "news-2",
    title: "AI & Machine Learning Engineering in 2026",
    excerpt: "How agentic AI and neural architectures are reshaping software engineering workflows.",
    source: "MIT Technology Review",
    url: "https://surendar.space",
    publishedAt: new Date().toISOString(),
    imageUrl: null,
    tags: ["AI", "Machine Learning", "Tech"],
  },
];

export const getTechNews = async (input?: { limit?: number }): Promise<TechNews[]> => {
  try {
    const apikey = typeof process !== "undefined" ? process.env?.["NEWSDATA_API_KEY"] : undefined;
    if (!apikey) return DEFAULT_NEWS;
>>>>>>> ff8c7d592c716ee34ce90be01f9302b4ea4f9dba

    const url = new URL("https://newsdata.io/api/1/latest");
    url.searchParams.set("apikey", apikey);
    url.searchParams.set("category", "technology");
    url.searchParams.set("language", "en");

<<<<<<< HEAD
    try {
      const res = await fetch(url.toString());
      if (!res.ok) return FALLBACK_NEWS.slice(0, data.limit);
      const json = (await res.json()) as { results?: NewsDataArticle[] };
      const results = Array.isArray(json.results) ? json.results : [];

      if (results.length === 0) return FALLBACK_NEWS.slice(0, data.limit);

      return results
        .filter((a) => a.title && a.link)
        .slice(0, data.limit)
        .map((a, i) => ({
          id: a.article_id ?? `${i}-${a.title}`,
          title: a.title!,
          excerpt: (a.description ?? "").slice(0, 180),
          source: a.source_name ?? a.source_id ?? "Tech",
          url: a.link!,
          publishedAt: a.pubDate ?? new Date().toISOString(),
          imageUrl: a.image_url ?? null,
          tags: (a.keywords ?? a.category ?? [])
            .filter((k): k is string => typeof k === "string" && k.length < 26)
            .slice(0, 5),
        }));
    } catch {
      return FALLBACK_NEWS.slice(0, data.limit);
    }
  });

export const techNewsQueryOptions = queryOptions({
  queryKey: ["tech-news", 3],
  queryFn: () => getTechNews({ data: { limit: 3 } }),
  // keep it feeling live without hammering the API
  staleTime: 60 * 1000,
  refetchInterval: 60 * 1000,
  refetchIntervalInBackground: true,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
=======
    const res = await fetch(url.toString());
    if (!res.ok) return DEFAULT_NEWS;
    const json = (await res.json()) as { results?: any[] };
    const results = Array.isArray(json.results) ? json.results : [];

    const limit = Math.min(Math.max(input?.limit ?? 3, 1), 10);

    return results
      .filter((a) => a.title && a.link)
      .slice(0, limit)
      .map((a, i) => ({
        id: a.article_id ?? `${i}-${a.title}`,
        title: a.title!,
        excerpt: (a.description ?? "").slice(0, 180),
        source: a.source_name ?? a.source_id ?? "Tech",
        url: a.link!,
        publishedAt: a.pubDate ?? new Date().toISOString(),
        imageUrl: a.image_url ?? null,
        tags: (a.keywords ?? a.category ?? [])
          .filter((k): k is string => typeof k === "string" && k.length < 26)
          .slice(0, 5),
      }));
  } catch {
    return DEFAULT_NEWS;
  }
};

export const techNewsQueryOptions = queryOptions({
  queryKey: ["tech-news", 3],
  queryFn: () => getTechNews({ limit: 3 }),
  staleTime: 60 * 1000,
>>>>>>> ff8c7d592c716ee34ce90be01f9302b4ea4f9dba
});

export const techNewsFeedQueryOptions = queryOptions({
  queryKey: ["tech-news", 10],
<<<<<<< HEAD
  queryFn: () => getTechNews({ data: { limit: 10 } }),
  staleTime: 60 * 1000,
  refetchInterval: 60 * 1000,
  refetchIntervalInBackground: true,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
});

=======
  queryFn: () => getTechNews({ limit: 10 }),
  staleTime: 60 * 1000,
});
>>>>>>> ff8c7d592c716ee34ce90be01f9302b4ea4f9dba
