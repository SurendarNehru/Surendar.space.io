import { useSuspenseQuery } from "@tanstack/react-query";
import { siteContentQueryOptions } from "./content.functions";

/**
 * Reads editable site copy (managed from the admin panel) with a fallback.
 * Routes using this must ensure `siteContentQueryOptions` in their loader.
 */
export function useSiteContent() {
  const { data } = useSuspenseQuery(siteContentQueryOptions);
  return (key: string, fallback: string) => {
    const value = data[key];
    return value && value.trim().length > 0 ? value : fallback;
  };
}
