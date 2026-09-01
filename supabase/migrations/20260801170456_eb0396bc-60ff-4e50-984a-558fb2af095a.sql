insert into public.site_content (key, value) values
  ('hero_cta_primary', 'Know Me'),
  ('hero_cta_secondary', 'Contact Me'),
  ('hero_cta_tertiary', 'Schedule a Call'),
  ('home_posts_heading', 'Latest Posts'),
  ('process_heading', 'A tactical playbook'),
  ('about_page_heading', 'Surendar'),
  ('about_page_intro', 'Full stack developer building interfaces where engineering meets art — precise, animated, and quietly beautiful.'),
  ('about_do_heading', 'What I do'),
  ('about_do_body', 'End-to-end product engineering: type-safe APIs, realtime systems, motion, and 3D — shipped as cohesive experiences.'),
  ('about_work_heading', 'How I work'),
  ('about_work_body', 'Small commits, tight loops, sharp taste. I care about performance, accessibility, and the feel of every interaction.'),
  ('contact_heading', 'Send a signal'),
  ('contact_intro', 'For projects, collaborations, or a friendly hello.'),
  ('contact_email', 'hello@surendar.dev'),
  ('contact_github', 'github.com/surendar'),
  ('contact_linkedin', 'linkedin.com/in/surendar')
on conflict (key) do nothing;