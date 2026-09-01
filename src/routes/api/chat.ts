import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, tool, stepCountIs, type UIMessage } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

type ChatRequestBody = { messages?: unknown; token?: unknown };

const SYSTEM = `You are "DOSAAA", the site assistant built into Surendar's portfolio admin panel.
Your name is DOSAAA. You are NOT "Nova" and must never call yourself Nova or any other name, even if earlier messages used one.
You edit the live website — content AND look & feel — through your tools.

You can:
- read, create, update and delete blog posts (posts tool family)
- read, create, update and delete portfolio projects (projects tool family)
- read and update site copy stored as key/value content
- restyle the entire UI/UX (colors, fonts, radius, spacing, glass surfaces, raw CSS)

Site copy keys that drive the pages (create new keys freely if asked):
- Hero: hero_name, hero_quote, hero_location, hero_cta_primary, hero_cta_secondary, hero_cta_tertiary, home_posts_heading
- Home about/process: about_heading, about_body, process_heading
- About page: about_page_heading, about_page_intro, about_do_heading, about_do_body, about_work_heading, about_work_body
- Contact page: contact_heading, contact_intro, contact_email, contact_github, contact_linkedin
- Projects page: projects_eyebrow, projects_heading
- Nav labels: nav_home, nav_about, nav_projects, nav_blog, nav_contact, nav_stargaze, nav_skyview, nav_admin

UI/UX design keys (use set_ui_style / set_custom_css, read with get_ui_style):
- ui_accent (CSS color), ui_text_color, ui_muted_color, ui_bg_color
- ui_heading_font, ui_body_font (CSS font-family lists), ui_font_url (web font stylesheet URL)
- ui_radius (e.g. 1.5rem), ui_glass_bg, ui_glass_border, ui_max_width
- ui_heading_weight, ui_letter_spacing
- ui_custom_css: raw CSS appended last — use it for anything the keys above cannot express
  (layout tweaks, hover states, animations, per-page rules, spacing, shadows).

Rules:
- Always call a tool to make a change; never claim a change you did not perform.
- Read the current value (get_site_content / get_ui_style / list_posts / list_projects) before rewriting something you were asked to tweak.
- For visual/UI/UX requests, prefer set_ui_style tokens first; fall back to set_custom_css for anything else. Keep custom CSS valid and scoped; never break readability or the space theme unless asked.
- Before deleting anything, confirm with the operator unless they were explicit.
- Keep copy professional and concise, matching the site's calm space theme.
- After a change, reply with a one-line summary of exactly what changed.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as ChatRequestBody;
        const token =
          typeof body.token === "string"
            ? body.token
            : (request.headers.get("x-admin-token") ?? "");

        const { requireAdmin } = await import("@/lib/admin.server");
        try {
          await requireAdmin(token);
        } catch {
          return new Response("Unauthorized", { status: 401 });
        }

        if (!Array.isArray(body.messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const data = await import("@/lib/admin-data.server");

        const tools = {
          list_posts: tool({
            description: "List every blog post on the site with its id, title and date.",
            inputSchema: z.object({}),
            execute: async () => data.listPosts(),
          }),
          create_post: tool({
            description: "Create a new blog post.",
            inputSchema: z.object({
              title: z.string(),
              excerpt: z.string().optional(),
              slug: z.string().optional(),
              tags: z.array(z.string()).optional(),
              url: z.string().optional(),
              publishedAt: z.string().optional(),
            }),
            execute: async (input) => data.createPost(input),
          }),
          update_post: tool({
            description: "Update fields on an existing blog post, found by its id.",
            inputSchema: z.object({
              id: z.string(),
              title: z.string().optional(),
              excerpt: z.string().optional(),
              slug: z.string().optional(),
              tags: z.array(z.string()).optional(),
              url: z.string().optional(),
              publishedAt: z.string().optional(),
            }),
            execute: async (input) => data.updatePost(input),
          }),
          delete_post: tool({
            description: "Permanently delete a blog post by id.",
            inputSchema: z.object({ id: z.string() }),
            execute: async ({ id }) => data.deletePost(id),
          }),
          get_site_content: tool({
            description: "Read all editable site copy as key/value pairs.",
            inputSchema: z.object({}),
            execute: async () => data.listContent(),
          }),
          set_site_content: tool({
            description:
              "Create or update a piece of site copy by key. Use this for hero, about, contact, projects headings and nav labels.",
            inputSchema: z.object({ key: z.string(), value: z.string() }),
            execute: async ({ key: k, value }) => data.setContent(k, value),
          }),
          delete_site_content: tool({
            description: "Delete a site copy key.",
            inputSchema: z.object({ key: z.string() }),
            execute: async ({ key: k }) => data.deleteContent(k),
          }),
          get_ui_style: tool({
            description:
              "Read the current UI/UX design settings (all ui_* keys: colors, fonts, radius, glass surfaces, custom CSS).",
            inputSchema: z.object({}),
            execute: async () => {
              const rows = await data.listContent();
              return rows.filter((r) => String(r.key).startsWith("ui_"));
            },
          }),
          set_ui_style: tool({
            description:
              "Set one or more UI/UX design tokens. Allowed keys: ui_accent, ui_text_color, ui_muted_color, ui_bg_color, ui_heading_font, ui_body_font, ui_font_url, ui_radius, ui_glass_bg, ui_glass_border, ui_max_width, ui_heading_weight, ui_letter_spacing.",
            inputSchema: z.object({
              updates: z.array(z.object({ key: z.string(), value: z.string() })),
            }),
            execute: async ({ updates }) => {
              const out = [];
              for (const u of updates) {
                const k = u.key.startsWith("ui_") ? u.key : `ui_${u.key}`;
                out.push(await data.setContent(k, u.value));
              }
              return out;
            },
          }),
          set_custom_css: tool({
            description:
              "Replace the site-wide custom CSS (ui_custom_css). Applied last, so it can restyle any element, layout, hover state or animation. Send the full CSS you want live.",
            inputSchema: z.object({ css: z.string() }),
            execute: async ({ css }) => data.setContent("ui_custom_css", css),
          }),

          list_projects: tool({
            description: "List every portfolio project with id, name, tag and order.",
            inputSchema: z.object({}),
            execute: async () => data.listProjects(),
          }),
          create_project: tool({
            description: "Add a new portfolio project to the Projects page.",
            inputSchema: z.object({
              name: z.string(),
              description: z.string().optional(),
              tag: z.string().optional(),
              url: z.string().optional(),
              sortOrder: z.number().optional(),
            }),
            execute: async (input) => data.createProject(input),
          }),
          update_project: tool({
            description: "Update an existing portfolio project, found by its id.",
            inputSchema: z.object({
              id: z.string(),
              name: z.string().optional(),
              description: z.string().optional(),
              tag: z.string().optional(),
              url: z.string().optional(),
              sortOrder: z.number().optional(),
            }),
            execute: async (input) => data.updateProject(input),
          }),
          delete_project: tool({
            description: "Permanently delete a portfolio project by id.",
            inputSchema: z.object({ id: z.string() }),
            execute: async ({ id }) => data.deleteProject(id),
          }),
        };

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3.6-flash"),
          system: SYSTEM,
          messages: await convertToModelMessages(body.messages as UIMessage[]),
          tools,
          stopWhen: stepCountIs(50),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: body.messages as UIMessage[],
        });
      },
    },
  },
});
