import { useQuery } from "@tanstack/react-query";
import { siteContentQueryOptions } from "./content.functions";

/**
 * Reads editable site copy (managed from the admin panel) with a fallback.
 * Routes using this can safely render fallback text immediately while data fetches in background.
 */
export function useSiteContent() {
  const { data } = useQuery(siteContentQueryOptions);
  return (key: string, fallback: string) => {
    const value = data?.[key];
    return value && value.trim().length > 0 ? value : fallback;
  };
}
