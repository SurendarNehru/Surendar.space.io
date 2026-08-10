<<<<<<< HEAD
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { queryOptions } from "@tanstack/react-query";

export type SiteContent = Record<string, string>;

export const getSiteContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteContent> => {
    const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return {};

    try {
      const client = createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
      });

      const { data, error } = await client.from("site_content").select("key,value");
      if (error || !data) return {};

      const out: SiteContent = {};
      for (const row of data) out[row.key as string] = (row.value as string) ?? "";
      return out;
    } catch {
      return {};
    }
  },
);
=======
import { queryOptions } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";

export type SiteContent = Record<string, string>;

export const getSiteContent = async (): Promise<SiteContent> => {
  try {
    const url = typeof process !== "undefined" ? process.env?.SUPABASE_URL : undefined;
    const key = typeof process !== "undefined" ? process.env?.SUPABASE_PUBLISHABLE_KEY : undefined;
    if (!url || !key) return {};

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

    const { data, error } = await client.from("site_content").select("key,value");
    if (error || !data) return {};

    const out: SiteContent = {};
    for (const row of data) out[row.key as string] = (row.value as string) ?? "";
    return out;
  } catch {
    return {};
  }
};
>>>>>>> ff8c7d592c716ee34ce90be01f9302b4ea4f9dba

export const siteContentQueryOptions = queryOptions({
  queryKey: ["site-content"],
  queryFn: () => getSiteContent(),
});
