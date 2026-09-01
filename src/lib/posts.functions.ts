import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { queryOptions } from "@tanstack/react-query";

export type LatestPost = {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  url: string;
  publishedAt: string;
};

export const getLatestPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<LatestPost[]> => {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return [];

    const client = createClient(url, key, {
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          headers.delete("Authorization");
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await client
      .from("posts")
      .select("id,title,excerpt,tags,url,published_at")
      .order("published_at", { ascending: false })
      .limit(3);

    if (error || !data) return [];

    return data.map((p) => ({
      id: p.id as string,
      title: p.title as string,
      excerpt: (p.excerpt as string) ?? "",
      tags: (p.tags as string[]) ?? [],
      url: (p.url as string) ?? "/blog",
      publishedAt: p.published_at as string,
    }));
  },
);

export const latestPostsQueryOptions = queryOptions({
  queryKey: ["latest-posts"],
  queryFn: () => getLatestPosts(),
});
