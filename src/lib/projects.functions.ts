<<<<<<< HEAD
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { queryOptions } from "@tanstack/react-query";
=======
import { queryOptions } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
>>>>>>> ff8c7d592c716ee34ce90be01f9302b4ea4f9dba

export type SiteProject = {
  id: string;
  name: string;
  description: string;
  tag: string;
  url: string | null;
  image_url: string | null;
};

<<<<<<< HEAD
const FALLBACK_PROJECTS: SiteProject[] = [
  {
    id: "proj-1",
    name: "Cosmic Canvas",
    description: "An interactive, space-inspired web application featuring real-time 3D galaxy particle rendering, custom shaders, and dynamic sky mode transitions.",
    tag: "Full Stack / 3D",
    url: "https://github.com/SurendarNehru",
    image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1024&auto=format&fit=crop&q=80",
  },
  {
    id: "proj-2",
    name: "Nebula Engine",
    description: "High-performance TypeScript & WebGL canvas framework for interactive particle systems and procedural space landscapes.",
    tag: "TypeScript / WebGL",
    url: "https://github.com/SurendarNehru",
    image_url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1024&auto=format&fit=crop&q=80",
  },
  {
    id: "proj-3",
    name: "Starlight UI System",
    description: "Glassmorphic, accessible design system with customizable tokens, ambient blur effects, and smooth framer-motion micro-interactions.",
    tag: "Design System / React",
    url: "https://github.com/SurendarNehru",
    image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1024&auto=format&fit=crop&q=80",
  },
];

export const getProjects = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteProject[]> => {
    const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return FALLBACK_PROJECTS;

    try {
      const client = createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
      });

      const { data, error } = await client
        .from("projects")
        .select("id,name,description,tag,url,image_url")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error || !data || data.length === 0) return FALLBACK_PROJECTS;
      return data as SiteProject[];
    } catch {
      return FALLBACK_PROJECTS;
    }
  },
);
=======
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
>>>>>>> ff8c7d592c716ee34ce90be01f9302b4ea4f9dba

export const projectsQueryOptions = queryOptions({
  queryKey: ["projects"],
  queryFn: () => getProjects(),
});
