import { queryOptions } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";

export type SiteProject = {
  id: string;
  name: string;
  description: string;
  tag: string;
  url: string | null;
  image_url: string | null;
};

const DEFAULT_PROJECTS: SiteProject[] = [
  {
    id: "1",
    name: "Cosmic Canvas",
    description: "Interactive 3D galaxy visualization & interactive space portfolio built with Three.js & React.",
    tag: "React / Three.js / WebGL",
    url: "https://surendar.space",
    image_url: null,
  },
  {
    id: "2",
    name: "CareConnect",
    description: "Healthcare coordination platform connecting medical professionals and patients seamlessly.",
    tag: "Full Stack / Node / Postgres",
    url: null,
    image_url: null,
  },
  {
    id: "3",
    name: "EyeCursor",
    description: "Accessibility tool enabling eye-tracking mouse navigation using webcam & computer vision.",
    tag: "AI / Vision / TypeScript",
    url: null,
    image_url: null,
  },
];

export const getProjects = async (): Promise<SiteProject[]> => {
  try {
    const url = typeof process !== "undefined" ? process.env?.SUPABASE_URL : undefined;
    const key = typeof process !== "undefined" ? process.env?.SUPABASE_PUBLISHABLE_KEY : undefined;
    if (!url || !key) return DEFAULT_PROJECTS;

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

    const { data, error } = await client
      .from("projects")
      .select("id,name,description,tag,url,image_url")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) return DEFAULT_PROJECTS;
    return data as SiteProject[];
  } catch {
    return DEFAULT_PROJECTS;
  }
};

export const projectsQueryOptions = queryOptions({
  queryKey: ["projects"],
  queryFn: () => getProjects(),
});
