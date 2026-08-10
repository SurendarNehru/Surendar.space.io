<<<<<<< HEAD
import { useQuery } from "@tanstack/react-query";
=======
import { useSuspenseQuery } from "@tanstack/react-query";
>>>>>>> ff8c7d592c716ee34ce90be01f9302b4ea4f9dba
import { siteContentQueryOptions } from "./content.functions";

/**
 * Reads editable site copy (managed from the admin panel) with a fallback.
<<<<<<< HEAD
 * Routes using this can safely render fallback text immediately while data fetches in background.
 */
export function useSiteContent() {
  const { data } = useQuery(siteContentQueryOptions);
  return (key: string, fallback: string) => {
    const value = data?.[key];
=======
 * Routes using this must ensure `siteContentQueryOptions` in their loader.
 */
export function useSiteContent() {
  const { data } = useSuspenseQuery(siteContentQueryOptions);
  return (key: string, fallback: string) => {
    const value = data[key];
>>>>>>> ff8c7d592c716ee34ce90be01f9302b4ea4f9dba
    return value && value.trim().length > 0 ? value : fallback;
  };
}
