import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

function getBasePath() {
  if (typeof window === "undefined") return "/";
  const path = window.location.pathname;
  // If served from a project subpath like `/Surendar.space.io/...`, detect
  // that prefix robustly (case-insensitive) and return it as the basePath.
  const m = path.match(/^\/[^/]+\.io/i);
  if (m) return m[0];
  return "/";
}

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    basePath: getBasePath(),
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
