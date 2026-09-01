CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  url TEXT,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.posts TO anon;
GRANT SELECT ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published posts are publicly readable"
ON public.posts FOR SELECT
TO anon, authenticated
USING (published_at <= now());

INSERT INTO public.posts (title, slug, excerpt, tags, url, published_at) VALUES
('Building a galaxy in 50,000 points', 'building-a-galaxy-in-50000-points', 'How the Stargaze scene draws a four-arm spiral with instanced points and keeps it smooth on mobile.', ARRAY['WebGL','Three.js','Performance'], '/blog', now() - interval '2 days'),
('Motion as a design language', 'motion-as-a-design-language', 'Easing curves, parallax and restraint — using movement to explain an interface instead of decorating it.', ARRAY['Motion','Design Systems'], '/blog', now() - interval '9 days'),
('Edge-first data patterns', 'edge-first-data-patterns', 'Loaders, caching and server functions that keep the first paint fast wherever the request lands.', ARRAY['Edge','TanStack','Postgres'], '/blog', now() - interval '21 days');