CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  tag text NOT NULL DEFAULT '',
  url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.projects TO anon;
GRANT SELECT ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects are publicly readable"
  ON public.projects FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.projects (name, description, tag, sort_order) VALUES
  ('Nebula UI', 'Design system for animated dashboards.', 'Design System', 1),
  ('Pulsar API', 'Edge-first realtime data layer.', 'Backend', 2),
  ('Orbit', '3D data visualization playground.', 'WebGL', 3),
  ('Lumen', 'Content platform with instant previews.', 'Fullstack', 4);

INSERT INTO public.site_content (key, value) VALUES
  ('nav_home', 'Home'),
  ('nav_about', 'About'),
  ('nav_projects', 'Projects'),
  ('nav_blog', 'Blog'),
  ('nav_contact', 'Contact'),
  ('nav_stargaze', 'Stargaze'),
  ('nav_skyview', 'Skyview'),
  ('nav_admin', 'Admin'),
  ('projects_eyebrow', 'Projects'),
  ('projects_heading', 'Selected work')
ON CONFLICT (key) DO NOTHING;