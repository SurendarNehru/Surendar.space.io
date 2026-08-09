import { queryOptions } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";

export type LatestPost = {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  url: string;
  publishedAt: string;
};

const DEFAULT_POSTS: LatestPost[] = [
  {
    id: "1",
    title: "Building High Performance 3D Web Experiences",
    excerpt: "Exploring WebGL, Three.js shaders, and interactive particle systems for modern web portfolios.",
    tags: ["Three.js", "WebGL", "Performance"],
    url: "#",
    publishedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Full Stack Architecture & Micro-frontends",
    excerpt: "Designing scalable backend architectures with Node.js, Postgres, and type-safe APIs.",
    tags: ["Architecture", "Node.js", "TypeScript"],
    url: "#",
    publishedAt: new Date().toISOString(),
  },
];

export const getLatestPosts = async (): Promise<LatestPost[]> => {
  try {
    const url = typeof process !== "undefined" ? process.env?.SUPABASE_URL : undefined;
    const key = typeof process !== "undefined" ? process.env?.SUPABASE_PUBLISHABLE_KEY : undefined;
    if (!url || !key) return DEFAULT_POSTS;

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

    if (error || !data || data.length === 0) return DEFAULT_POSTS;

    return data.map((p) => ({
      id: p.id as string,
      title: p.title as string,
      excerpt: (p.excerpt as string) ?? "",
      tags: (p.tags as string[]) ?? [],
      url: (p.url as string) ?? "/blog",
      publishedAt: p.published_at as string,
    }));
  } catch {
    return DEFAULT_POSTS;
  }
};

export const latestPostsQueryOptions = queryOptions({
  queryKey: ["latest-posts"],
  queryFn: () => getLatestPosts(),
});
