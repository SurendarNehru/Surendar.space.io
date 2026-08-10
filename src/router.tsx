import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const isGitHubPages =
  typeof window !== "undefined" &&
  window.location.pathname.toLowerCase().startsWith("/surendar.space.io");

const basePath = isGitHubPages ? "/Surendar.space.io" : "/";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    basePath,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
