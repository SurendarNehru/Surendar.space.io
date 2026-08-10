import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

function getBasePath() {
  if (typeof window === "undefined") return "/";
  const path = window.location.pathname;
  const match = path.match(/^\/surendar\.space\.io/i);
  if (match) {
    return match[0];
  }
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
