import { createClient } from "@supabase/supabase-js";
import { queryOptions } from "@tanstack/react-query";

export type SiteContent = Record<string, string>;

export async function getSiteContent(): Promise<SiteContent> {
  const url = import.meta.env?.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
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
}

export const siteContentQueryOptions = queryOptions({
  queryKey: ["site-content"],
  queryFn: () => getSiteContent(),
  staleTime: 1000 * 60 * 5,
});
