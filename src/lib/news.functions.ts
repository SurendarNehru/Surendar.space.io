import { createServerFn } from "@tanstack/react-start";
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
export const getTechNews = createServerFn({ method: "GET" })
  .validator((input: { limit?: number } | undefined) => ({
    limit: Math.min(Math.max(input?.limit ?? 3, 1), 10),
  }))
  .handler(async ({ data }): Promise<TechNews[]> => {
    const apikey = process.env["NEWSDATA_API_KEY"];
    if (!apikey) return [];

    const url = new URL("https://newsdata.io/api/1/latest");
    url.searchParams.set("apikey", apikey);
    url.searchParams.set("category", "technology");
    url.searchParams.set("language", "en");

    try {
      const res = await fetch(url.toString());
      if (!res.ok) return [];
      const json = (await res.json()) as { results?: NewsDataArticle[] };
      const results = Array.isArray(json.results) ? json.results : [];

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
      return [];
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
});

export const techNewsFeedQueryOptions = queryOptions({
  queryKey: ["tech-news", 10],
  queryFn: () => getTechNews({ data: { limit: 10 } }),
  staleTime: 60 * 1000,
  refetchInterval: 60 * 1000,
  refetchIntervalInBackground: true,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
});
