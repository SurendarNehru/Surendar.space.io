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
    id: "proj-swapit",
    name: "SwapIt",
    description:
      "Secure Campus-Based Student Exchange Platform\n\nSwapIt is a dedicated digital marketplace designed for university students to buy, sell, and exchange products within a verified campus community.\n\nKey Features\n• Verified student-only access\n• Product listing with images and descriptions\n• Search and filtering\n• Firebase Authentication\n• Firebase Storage\n• Buyer–seller communication\n• Secure campus-based trading\n• Encourages reuse and sustainable consumption\n\nTechnology\nHTML5 · CSS3 · JavaScript · Tailwind CSS · Express.js · MongoDB · Firebase",
    tag: "Marketplace",
    url: "https://github.com/SurendarNehru",
    image_url: "/__l5e/assets-v1/1edb384d-0b56-42cf-9cb0-87c335a553ad/proj-swapit.jpg",
  },
  {
    id: "proj-careconnect",
    name: "Care Connect",
    description:
      "Doctor Home Visit Booking Platform\n\nCare Connect is a digital healthcare platform that allows patients to discover verified doctors and schedule medical consultations at home.\n\nKey Features\n• Doctor verification\n• Specialization-based search\n• Location-based doctor discovery\n• Appointment booking\n• Appointment approval and rescheduling\n• Patient–doctor communication\n• Ratings and feedback\n• Firebase authentication\n• Role-based access\n\nTechnology\nJava · XML · Android Studio · Firebase Authentication · Firestore · Realtime Database",
    tag: "Healthcare",
    url: "https://github.com/SurendarNehru",
    image_url: "/__l5e/assets-v1/af9030c1-3ef3-48db-92ed-0b763fb0e555/proj-careconnect.jpg",
  },
  {
    id: "proj-eyecursor",
    name: "EyeCursor",
    description:
      "Controlling Cursor With Eye Movements\n\nEyeCursor is an assistive computer-vision system that enables users to control their computer cursor using eye movements captured through a standard webcam.\n\nKey Features\n• Real-time eye tracking\n• Hands-free cursor movement\n• Eye-gesture clicking\n• Facial landmark detection\n• Webcam-based operation\n• Accessibility-focused interaction\n• Minimal hardware requirements\n\nTechnology\nPython · OpenCV · MediaPipe · PyAutoGUI · Computer Vision",
    tag: "Computer Vision",
    url: "https://github.com/SurendarNehru",
    image_url: "/__l5e/assets-v1/f9b1daa3-a2c7-4414-9c95-719310bf6e8b/proj-eyecursor.jpg",
  },
  {
    id: "proj-portfolio",
    name: "My Portfolio",
    description:
      "Personal Developer Portfolio\n\nA modern personal portfolio designed and developed to showcase my projects, technical skills, experience, achievements, and development journey.\n\nKey Features\n• Responsive portfolio design\n• Project showcase\n• About section\n• Skills and technologies\n• Experience and achievements\n• Contact section\n• GitHub and professional links\n• Interactive navigation\n• Modern animations and visual effects\n\nTechnology\nReact · JavaScript · HTML · CSS · Tailwind CSS · Vercel",
    tag: "Portfolio",
    url: "https://github.com/SurendarNehru",
    image_url: "/__l5e/assets-v1/f8cbc4b6-ac4e-48ce-8a27-9478e308d621/proj-portfolio.jpg",
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
