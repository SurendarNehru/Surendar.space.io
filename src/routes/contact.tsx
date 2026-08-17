import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "../components/GlassCard";
import { Mail, Github, Linkedin, Instagram, Coffee, Send } from "lucide-react";
import { siteContentQueryOptions } from "../lib/content.functions";
import { useSiteContent } from "../lib/use-site-content";
import { useState } from "react";

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
  loader: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(siteContentQueryOptions);
    } catch {
      // Safe fallback
    }
  },
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
  const [message, setMessage] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderEmail.trim() || !message.trim()) {
      return;
    }
    setIsLoading(true);
    try {
      // For now, just log the message and show success
      console.log("Contact form submission:", {
        name: senderName,
        email: senderEmail,
        message,
      });
      setSubmitted(true);
      setSenderName("");
      setSenderEmail("");
      setMessage("");
      setTimeout(() => setSubmitted(false), 4000);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-24">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Contact</p>
      <h1 className="mt-3 text-3xl min-[380px]:text-4xl sm:text-5xl font-semibold text-white">
        {t("contact_heading", "Send a signal")}
      </h1>
      <p className="mt-4 whitespace-pre-line text-white/70">
        {t("contact_intro", "For projects, collaborations, or a friendly hello.")}
      </p>
      
      <div className="mt-10 space-y-8">
        {/* Contact Links */}
        <GlassCard>
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

        {/* Send Message Form */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-6">
            <Send className="h-5 w-5 text-white/70" />
            <h2 className="text-lg font-semibold text-white">Send a message</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-white/50">Your name</span>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Your name"
                className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/40"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-white/50">Your email</span>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="your@email.com"
                className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/40"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-white/50">Message</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What's on your mind?"
                rows={4}
                className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/40 resize-none"
              />
            </label>
            <button
              type="submit"
              disabled={isLoading || !senderName.trim() || !senderEmail.trim() || !message.trim()}
              className="w-full rounded-full border border-white/70 bg-white/90 px-5 py-2.5 text-sm font-medium text-[#0b0b14] transition-colors hover:bg-white disabled:opacity-50"
            >
              {isLoading ? "Sending…" : "Send message"}
            </button>
            {submitted && (
              <p className="text-sm text-green-400 text-center">
                Message sent! Thanks for reaching out.
              </p>
            )}
          </form>
        </GlassCard>

        {/* Coffee */}
        <GlassCard>
          <div className="flex items-start gap-4">
            <Coffee className="h-6 w-6 text-white/70 shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-white">Buy me a coffee</h2>
              <p className="mt-2 text-sm text-white/70">
                If my work has been helpful or inspired you, consider buying me a coffee. Every cup fuels late-night coding sessions and creative ideas.
              </p>
              <a
                href="https://buymeacoffee.com/surendar"
                target="_blank"
                rel="noreferrer noopener"
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white transition-colors hover:bg-white/10"
              >
                <Coffee className="h-4 w-4" /> Buy a coffee
              </a>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
