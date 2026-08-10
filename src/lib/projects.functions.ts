import { createClient } from "@supabase/supabase-js";
import { queryOptions } from "@tanstack/react-query";

export type SiteProject = {
  id: string;
  name: string;
  description: string;
  tag: string;
  url: string | null;
  image_url: string | null;
};

const FALLBACK_PROJECTS: SiteProject[] = [
  {
    id: "proj-1",
    name: "Cosmic Canvas",
    description:
      "An interactive, space-inspired web application featuring real-time 3D galaxy particle rendering, custom shaders, and dynamic sky mode transitions.",
    tag: "Full Stack / 3D",
    url: "https://github.com/SurendarNehru",
    image_url:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1024&auto=format&fit=crop&q=80",
  },
  {
    id: "proj-2",
    name: "Nebula Engine",
    description:
      "High-performance TypeScript & WebGL canvas framework for interactive particle systems and procedural space landscapes.",
    tag: "TypeScript / WebGL",
    url: "https://github.com/SurendarNehru",
    image_url:
      "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1024&auto=format&fit=crop&q=80",
  },
  {
    id: "proj-3",
    name: "Starlight UI System",
    description:
      "Glassmorphic, accessible design system with customizable tokens, ambient blur effects, and smooth framer-motion micro-interactions.",
    tag: "Design System / React",
    url: "https://github.com/SurendarNehru",
    image_url:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1024&auto=format&fit=crop&q=80",
  },
];

export async function getProjects(): Promise<SiteProject[]> {
  const url = import.meta.env?.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
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
}

export const projectsQueryOptions = queryOptions({
  queryKey: ["projects"],
  queryFn: () => getProjects(),
  staleTime: 1000 * 60 * 5,
});
