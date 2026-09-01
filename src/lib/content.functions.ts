import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { queryOptions } from "@tanstack/react-query";

export type SiteContent = Record<string, string>;

export const getSiteContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteContent> => {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;
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
  },
);

export const siteContentQueryOptions = queryOptions({
  queryKey: ["site-content"],
  queryFn: () => getSiteContent(),
  // Realtime-ish: small admin edits show up across the site within seconds
  // and immediately when the tab regains focus.
  staleTime: 0,
  refetchInterval: 5000,
  refetchIntervalInBackground: false,
  refetchOnWindowFocus: true,
  refetchOnMount: "always",
});
