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

    const url = new URL("https://newsdata.io/api/1/latest");
    url.searchParams.set("apikey", apikey);
    url.searchParams.set("category", "technology");
    url.searchParams.set("language", "en");

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
});

export const techNewsFeedQueryOptions = queryOptions({
  queryKey: ["tech-news", 10],
  queryFn: () => getTechNews({ limit: 10 }),
  staleTime: 60 * 1000,
});
