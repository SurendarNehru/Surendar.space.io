import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

function getBasePath() {
  if (typeof window === "undefined") return "/";
  const path = window.location.pathname.toLowerCase();
  if (path.startsWith("/surendar.space.io")) {
    return "/Surendar.space.io";
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
