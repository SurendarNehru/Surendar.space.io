import { useState } from "react";

type Group = { label: string; prompts: string[] };

export const PRESET_GROUPS: Group[] = [
  {
    label: "Hero",
    prompts: [
      "Change the hero quote to “Building the full picture — frontend, backend and beyond.”",
      "Update hero_location to “Chennai, IN” and rename the primary CTA to “Know Me”.",
      "Rewrite the hero name plate and the three CTA labels in a calmer, more professional tone.",
    ],
  },
  {
    label: "About",
    prompts: [
      "Rewrite about_page_intro as two short sentences about full stack work.",
      "Update about_do_heading and about_do_body to focus on product engineering.",
      "Refresh about_work_body with a concise summary of how I collaborate.",
    ],
  },
  {
    label: "Contact",
    prompts: [
      "Set contact_email to hello@surendar.dev and update contact_intro to match.",
      "Update contact_github and contact_linkedin links.",
      "Rewrite contact_heading so it invites project enquiries.",
    ],
  },
  {
    label: "Nav labels",
    prompts: [
      "Rename nav_projects to “Work” and nav_blog to “Writing”.",
      "Show all current nav labels, then shorten every one to a single word.",
    ],
  },
  {
    label: "Projects",
    prompts: [
      "Add a project called Aurora — a realtime analytics dashboard, tag “Full Stack”.",
      "List all projects and reorder them so the newest is first.",
      "Update the description of my first project to be one crisp sentence.",
    ],
  },
  {
    label: "Posts",
    prompts: [
      "Write a short post titled “Rendering 50k stars in the browser” with an excerpt.",
      "List all posts and fix any title casing issues.",
    ],
  },
  {
    label: "UI / UX",
    prompts: [
      "Make the accent color gold and slightly widen heading letter spacing.",
      "Soften all corners: set ui_radius to 1.75rem and lighten the glass surfaces.",
      "Use a serif heading font with a clean sans body font.",
      "Add custom CSS so cards lift slightly on hover with a smooth transition.",
    ],
  },
];

export function PromptPresets({ onPick }: { onPick: (prompt: string) => void }) {
  const [active, setActive] = useState(PRESET_GROUPS[0].label);
  const group = PRESET_GROUPS.find((g) => g.label === active) ?? PRESET_GROUPS[0];

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold">Prompt presets</h3>
        <p className="text-xs opacity-60">
          Tap a preset to load it into the DOSAAA composer, then tweak before sending.
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {PRESET_GROUPS.map((g) => (
          <button
            key={g.label}
            type="button"
            onClick={() => setActive(g.label)}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              g.label === active
                ? "border-white/40 bg-white/15"
                : "border-white/15 hover:bg-white/10"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>
      <div className="grid gap-2">
        {group.prompts.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPick(p)}
            className="rounded-2xl border border-white/12 px-3 py-2 text-left text-xs leading-relaxed opacity-85 transition hover:bg-white/10 hover:opacity-100"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
