import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { queryOptions } from "@tanstack/react-query";

export type SiteProject = {
  id: string;
  name: string;
  description: string;
  tag: string;
  url: string | null;
  image_url: string | null;
};

export const getProjects = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteProject[]> => {
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
      .from("projects")
      .select("id,name,description,tag,url,image_url")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error || !data) return [];
    return data as SiteProject[];
  },
);

export const projectsQueryOptions = queryOptions({
  queryKey: ["projects"],
  queryFn: () => getProjects(),
});
