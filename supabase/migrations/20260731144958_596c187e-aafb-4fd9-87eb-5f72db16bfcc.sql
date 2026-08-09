CREATE TABLE public.site_content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_content TO anon;
GRANT SELECT ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site content is publicly readable" ON public.site_content FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.site_content (key, value) VALUES
  ('hero_name', 'Surendar'),
  ('hero_quote', 'Building the full picture — frontend, backend and beyond.'),
  ('hero_location', 'Chennai, IN'),
  ('about_heading', 'A developer who moves like light'),
  ('about_body', 'I''m Surendar — a full stack developer obsessed with the space between engineering and art. I build interfaces that feel like instruments: responsive, precise, and quietly beautiful.');