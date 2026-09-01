import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "../components/GlassCard";
import { Mail, Github, Linkedin, Instagram, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
  loader: ({ context }) => context.queryClient.ensureQueryData(siteContentQueryOptions),
  errorComponent: ({ error }) => (
    <div role="alert" className="px-6 py-24 text-white/70">
      {error.message}
    </div>
  ),
  notFoundComponent: () => <div className="px-6 py-24 text-white/70">Not found.</div>,
  component: Contact,
});

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label} copied to clipboard`);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Couldn't copy — try selecting the text");
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label}`}
      className="ml-auto shrink-0 rounded-full border border-white/15 bg-white/5 p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

function Contact() {
  const t = useSiteContent();
  const email = t("contact_email", "surendarnehru2004@gmail.com");
  const github = t("contact_github", "https://github.com/SurendarNehru");
  const linkedin = t("contact_linkedin", "https://www.linkedin.com/in/surendar-n-55a8482a1");
  const instagram = t(
    "contact_instagram",
    "https://www.instagram.com/sanz.______?igsh=b2xsY2pwcWQzOGJh",
  );
  const strip = (u: string) => u.replace(/^https?:\/\//, "");

  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Contact</p>
      <h1 className="mt-3 text-5xl font-semibold text-white">
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
            <CopyButton value={email} label="Email" />
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
            <CopyButton value={`https://${strip(github)}`} label="GitHub link" />
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
            <CopyButton value={`https://${strip(linkedin)}`} label="LinkedIn link" />
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
            <CopyButton value={`https://${strip(instagram)}`} label="Instagram link" />
          </li>
        </ul>
      </GlassCard>
    </section>
  );
}
