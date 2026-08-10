import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "../components/GlassCard";
import { Mail, Github, Linkedin, Instagram } from "lucide-react";
import { siteContentQueryOptions } from "../lib/content.functions";
import { useSiteContent } from "../lib/use-site-content";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Surendar" },
      { name: "description", content: "Get in touch with Surendar." },
      { property: "og:title", content: "Contact — Surendar" },
      { property: "og:description", content: "Get in touch with Surendar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
<<<<<<< HEAD
  loader: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(siteContentQueryOptions);
    } catch {
      // Safe fallback
    }
  },
=======
  loader: ({ context }) => context.queryClient.ensureQueryData(siteContentQueryOptions),
>>>>>>> ff8c7d592c716ee34ce90be01f9302b4ea4f9dba
  errorComponent: ({ error }) => (
    <div role="alert" className="px-6 py-24 text-white/70">
      {error.message}
    </div>
  ),
  notFoundComponent: () => <div className="px-6 py-24 text-white/70">Not found.</div>,
  component: Contact,
});

function Contact() {
  const t = useSiteContent();
  const email = t("contact_email", "surendarnehru2004@gmail.com");
  const github = t("contact_github", "https://github.com/SurendarNehru");
  const linkedin = t(
    "contact_linkedin",
    "https://www.linkedin.com/in/surendar-n-55a8482a1",
  );
  const instagram = t(
    "contact_instagram",
    "https://www.instagram.com/sanz.______?igsh=b2xsY2pwcWQzOGJh",
  );
  const strip = (u: string) => u.replace(/^https?:\/\//, "");

  return (
<<<<<<< HEAD
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-24">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Contact</p>
      <h1 className="mt-3 text-3xl min-[380px]:text-4xl sm:text-5xl font-semibold text-white">
=======
    <section className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Contact</p>
      <h1 className="mt-3 text-5xl font-semibold text-white">
>>>>>>> ff8c7d592c716ee34ce90be01f9302b4ea4f9dba
        {t("contact_heading", "Send a signal")}
      </h1>
      <p className="mt-4 whitespace-pre-line text-white/70">
        {t("contact_intro", "For projects, collaborations, or a friendly hello.")}
      </p>
      <GlassCard className="mt-10">
        <ul className="space-y-4">
          <li className="flex items-center gap-3 text-white/90">
            <Mail className="h-4 w-4 shrink-0 text-white/70" />
            <a href={`mailto:${email}`} className="break-all hover:text-white">
              {email}
            </a>
          </li>
          <li className="flex items-center gap-3 text-white/90">
            <Github className="h-4 w-4 shrink-0 text-white/70" />
            <a
              href={`https://${strip(github)}`}
              target="_blank"
              rel="noreferrer noopener"
              className="break-all hover:text-white"
            >
              {strip(github)}
            </a>
          </li>
          <li className="flex items-center gap-3 text-white/90">
            <Linkedin className="h-4 w-4 shrink-0 text-white/70" />
            <a
              href={`https://${strip(linkedin)}`}
              target="_blank"
              rel="noreferrer noopener"
              className="break-all hover:text-white"
            >
              {strip(linkedin)}
            </a>
          </li>
          <li className="flex items-center gap-3 text-white/90">
            <Instagram className="h-4 w-4 shrink-0 text-white/70" />
            <a
              href={`https://${strip(instagram)}`}
              target="_blank"
              rel="noreferrer noopener"
              className="break-all hover:text-white"
            >
              @sanz.______
            </a>
          </li>
        </ul>
      </GlassCard>
    </section>
  );
}
