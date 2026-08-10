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

type NewsDataArticle = {
  article_id?: string;
  title?: string;
  link?: string;
  description?: string;
  pubDate?: string;
  source_id?: string;
  source_name?: string;
  image_url?: string | null;
  category?: string[];
  keywords?: string[];
};

const FALLBACK_NEWS: TechNews[] = [
  {
    id: "fb-1",
    title: "The Evolution of Modern Web Development & React 19",
    excerpt:
      "Exploring the latest frontend innovations, server components, and performance optimizations.",
    source: "TechCrunch",
    url: "https://techcrunch.com",
    publishedAt: new Date().toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    tags: ["React", "WebDev", "Frontend"],
  },
  {
    id: "fb-2",
    title: "AI & Machine Learning Engineering in 2026",
    excerpt:
      "How agentic AI and neural architectures are reshaping software engineering workflows.",
    source: "MIT Technology Review",
    url: "https://technologyreview.com",
    publishedAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80",
    tags: ["WebGL", "ThreeJS", "Performance"],
  },
  {
    id: "fb-3",
    title: "Building Real-Time Edge APIs with Modern Databases",
    excerpt:
      "A deep dive into distributed Postgres, webhooks, and low-latency API architecture.",
    source: "Ars Technica",
    url: "https://supabase.com",
    publishedAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
    tags: ["Postgres", "APIs", "Backend"],
  },
];

export async function getTechNews(options?: { limit?: number }): Promise<TechNews[]> {
  const limit = Math.min(Math.max(options?.limit ?? 3, 1), 10);
  const apikey = import.meta.env?.VITE_NEWSDATA_API_KEY || process.env.NEWSDATA_API_KEY;
  if (!apikey) return FALLBACK_NEWS.slice(0, limit);

  const url = new URL("https://newsdata.io/api/1/latest");
  url.searchParams.set("apikey", apikey);
  url.searchParams.set("category", "technology");
  url.searchParams.set("language", "en");

  try {
    const res = await fetch(url.toString());
    if (!res.ok) return FALLBACK_NEWS.slice(0, limit);
    const json = (await res.json()) as { results?: NewsDataArticle[] };
    const results = Array.isArray(json.results) ? json.results : [];

    if (results.length === 0) return FALLBACK_NEWS.slice(0, limit);

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
    return FALLBACK_NEWS.slice(0, limit);
  }
}

export const techNewsQueryOptions = (limit = 3) =>
  queryOptions({
    queryKey: ["tech-news", limit],
    queryFn: () => getTechNews({ limit }),
    staleTime: 1000 * 60 * 5,
  });
