import { queryOptions } from "@tanstack/react-query";
import { getSiteContent } from "./content.functions";
import { getProjects } from "./projects.functions";
import { getLatestPosts } from "./posts.functions";
import { getTechNews } from "./news.functions";

export const siteContentQueryOptions = queryOptions({
  queryKey: ["site-content"],
  queryFn: () => getSiteContent(),
});

export const projectsQueryOptions = queryOptions({
  queryKey: ["projects"],
  queryFn: () => getProjects(),
});

export const latestPostsQueryOptions = queryOptions({
  queryKey: ["latest-posts"],
  queryFn: () => getLatestPosts(),
});

export const techNewsQueryOptions = queryOptions({
  queryKey: ["tech-news", 3],
  queryFn: () => getTechNews({ limit: 3 }),
  staleTime: 60 * 1000,
  refetchInterval: 60 * 1000,
  refetchIntervalInBackground: true,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
});

export const techNewsFeedQueryOptions = queryOptions({
  queryKey: ["tech-news", 10],
  queryFn: () => getTechNews({ limit: 10 }),
  staleTime: 60 * 1000,
  refetchInterval: 60 * 1000,
  refetchIntervalInBackground: true,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
});
