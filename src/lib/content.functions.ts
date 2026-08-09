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

export const siteContentQueryOptions = queryOptions({
  queryKey: ["site-content"],
  queryFn: () => getSiteContent(),
});
