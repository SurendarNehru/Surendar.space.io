import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bot,
  LogOut,
  Lock,
  PencilLine,
  Trash2,
  FileText,
  Type,
  Code2,
  MonitorPlay,
} from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Tool, ToolHeader, ToolContent, ToolInput, ToolOutput } from "@/components/ai-elements/tool";
import { GlassCard } from "@/components/GlassCard";
import { LivePreview } from "@/components/admin/LivePreview";
import { PromptPresets } from "@/components/PromptPresets";
import {
  adminCheck,
  adminDeleteContent,
  adminDeletePost,
  adminDeleteProject,
  adminListContent,
  adminListPosts,
  adminListProjects,
  adminLogin,
  adminSetContent,
} from "@/lib/admin.functions";


const TOKEN_KEY = "admin-token";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Console — Surendar" },
      {
        name: "description",
        content:
          "Private admin console for Surendar's portfolio: sign in to edit site copy and posts with the built-in AI editor.",
      },
      { property: "og:title", content: "Admin Console — Surendar" },
      {
        property: "og:description",
        content: "Private console for editing the portfolio with an AI assistant.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.sessionStorage.getItem(TOKEN_KEY);
    if (!saved) {
      setReady(true);
      return;
    }
    adminCheck({ data: { token: saved } })
      .then((r) => {
        if (r.ok) setToken(saved);
        else window.sessionStorage.removeItem(TOKEN_KEY);
      })
      .catch(() => window.sessionStorage.removeItem(TOKEN_KEY))
      .finally(() => setReady(true));
  }, []);

  const signIn = (t: string) => {
    window.sessionStorage.setItem(TOKEN_KEY, t);
    setToken(t);
  };
  const signOut = () => {
    window.sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  if (!ready) {
    return (
      <div className="px-6 py-24 text-sm text-white/60">
        <Shimmer>Checking your session…</Shimmer>
      </div>
    );
  }

  return token ? (
    <Dashboard token={token} onSignOut={signOut} />
  ) : (
    <LoginForm onSuccess={signIn} />
  );
}

function LoginForm({ onSuccess }: { onSuccess: (token: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { token } = await adminLogin({ data: { username, password } });
      onSuccess(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mx-auto flex max-w-md flex-col px-5 py-16 sm:px-6 sm:py-24">
      <GlassCard>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10">
            <Lock className="h-4 w-4 text-white" />
          </span>
          <div>
            <h1 className="text-xl font-semibold text-white">Admin console</h1>
            <p className="text-xs text-white/60">Operator access only</p>
          </div>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.2em] text-white/50">Username</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/40"
              placeholder="username"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-[0.2em] text-white/50">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/40"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p role="alert" className="text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy || !username || !password}
            className="w-full rounded-full border border-white/70 bg-white/90 px-5 py-2.5 text-sm font-medium text-[#0b0b14] transition-colors hover:bg-white disabled:opacity-50"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </GlassCard>
    </section>
  );
}

function Dashboard({ token, onSignOut }: { token: string; onSignOut: () => void }) {
  const [tab, setTab] = useState<"ai" | "posts" | "projects" | "content" | "preview">("ai");

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 sm:pt-8">

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Admin console
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Edit the site with the built-in AI, or by hand.
          </p>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white transition-colors hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {(
          [
            { id: "ai", label: "AI editor", icon: Bot },
            { id: "preview", label: "Live preview", icon: MonitorPlay },
            { id: "posts", label: "Posts", icon: FileText },
            { id: "projects", label: "Projects", icon: Code2 },
            { id: "content", label: "Site copy", icon: Type },
          ] as const

        ).map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                active
                  ? "border-white/25 bg-white/15 text-white"
                  : "border-white/10 bg-white/5 text-white/60 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" /> {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {tab === "ai" && <AiEditor token={token} />}
        {tab === "preview" && (
          <GlassCard className="!p-0">
            <div className="h-[65vh] sm:h-[78vh] min-h-[380px]">
              <LivePreview />
            </div>
          </GlassCard>
        )}
        {tab === "posts" && <PostsPanel token={token} />}
        {tab === "projects" && <ProjectsPanel token={token} />}
        {tab === "content" && <ContentPanel token={token} />}
      </div>

    </section>
  );
}

function AiEditor({ token }: { token: string }) {
  const queryClient = useQueryClient();
  const [input, setInput] = useState("");
  const [reload, setReload] = useState(0);
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat", body: { token } }),
    [token],
  );
  const { messages, sendMessage, status, error } = useChat({
    id: "admin-editor",
    transport,
    onFinish: () => {
      queryClient.invalidateQueries();
      setReload((n) => n + 1);
    },
  });

  const busy = status === "submitted" || status === "streaming";

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <GlassCard className="!p-0">
        <div className="flex h-[55vh] sm:h-[65vh] min-h-[360px] flex-col">

        <Conversation className="flex-1">
          <ConversationContent className="gap-4">
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<Bot className="h-6 w-6 text-white/70" />}
                title="DOSAAA, your site editor"
                description="Try: “change the hero quote”, “add a project called Aurora”, “make the accent color gold and headings wider”, “restyle the cards with softer corners”. Content and UI/UX both update live in the preview."
              />
            ) : (
              messages.map((m) => (
                <Message key={m.id} from={m.role}>
                  <MessageContent>
                    {m.parts.map((part, i) => {
                      if (part.type === "text") {
                        return m.role === "assistant" ? (
                          <MessageResponse key={i}>{part.text}</MessageResponse>
                        ) : (
                          <span key={i}>{part.text}</span>
                        );
                      }
                      if (part.type.startsWith("tool-")) {
                        const p = part as never as {
                          type: string;
                          state: "input-streaming" | "input-available" | "output-available" | "output-error";
                          input?: unknown;
                          output?: unknown;
                          errorText?: string;
                        };
                        return (
                          <Tool key={i} defaultOpen={false}>
                            <ToolHeader type={p.type as `tool-${string}`} state={p.state} />
                            <ToolContent>
                              <ToolInput input={p.input} />
                              <ToolOutput
                                output={
                                  p.output ? (
                                    <pre className="overflow-x-auto text-xs">
                                      {JSON.stringify(p.output, null, 2)}
                                    </pre>
                                  ) : undefined
                                }
                                errorText={p.errorText}
                              />
                            </ToolContent>
                          </Tool>
                        );
                      }
                      return null;
                    })}
                  </MessageContent>
                </Message>
              ))
            )}
            {status === "submitted" && (
              <Shimmer className="text-sm">DOSAAA is thinking…</Shimmer>
            )}
            {error && (
              <p role="alert" className="text-sm text-red-300">
                {error.message}
              </p>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="border-t border-white/10 p-3">
          <PromptInput
            onSubmit={(_message, event) => {
              event.preventDefault();
              const text = input.trim();
              if (!text || busy) return;
              setInput("");
              void sendMessage({ text });
            }}
          >
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              placeholder="Tell DOSAAA what to change on the site…"
            />
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit status={status} disabled={!input.trim() && !busy} />
            </PromptInputFooter>
          </PromptInput>
        </div>
        </div>
      </GlassCard>

      <div className="grid gap-4">
        <GlassCard className="!p-0">
          <div className="h-[35vh] sm:h-[42vh] min-h-[260px]">
            <LivePreview reloadSignal={reload} />
          </div>
        </GlassCard>
        <GlassCard>
          <PromptPresets onPick={(p) => setInput(p)} />
        </GlassCard>
      </div>
    </div>
  );
}

function ProjectsPanel({ token }: { token: string }) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: () => adminListProjects({ data: { token } }),
  });
  const remove = useMutation({
    mutationFn: (id: string) => adminDeleteProject({ data: { token, id } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      void queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  if (isLoading) return <p className="text-sm text-white/60">Loading projects…</p>;

  return (
    <div className="space-y-3">
      {(data ?? []).map((p) => (
        <GlassCard key={p.id} className="!p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-white">{p.name}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-white/65">{p.description}</p>
              <p className="mt-2 text-[11px] uppercase tracking-wider text-white/45">
                {p.tag || "untagged"} · #{p.sort_order}
              </p>
            </div>
            <button
              type="button"
              onClick={() => remove.mutate(p.id)}
              aria-label={`Delete ${p.name}`}
              className="shrink-0 rounded-full border border-white/15 p-2 text-white/70 transition-colors hover:border-white/40 hover:text-white"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </GlassCard>
      ))}
      {(data ?? []).length === 0 && (
        <p className="text-sm text-white/60">No projects yet — ask DOSAAA to add one.</p>
      )}
    </div>
  );
}


function PostsPanel({ token }: { token: string }) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: () => adminListPosts({ data: { token } }),
  });
  const remove = useMutation({
    mutationFn: (id: string) => adminDeletePost({ data: { token, id } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      void queryClient.invalidateQueries({ queryKey: ["latest-posts"] });
    },
  });

  if (isLoading) return <p className="text-sm text-white/60">Loading posts…</p>;

  return (
    <div className="space-y-3">
      {(data ?? []).map((p) => (
        <GlassCard key={p.id} className="!p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-white">{p.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-white/65">{p.excerpt}</p>
              <p className="mt-2 text-[11px] uppercase tracking-wider text-white/45">
                {new Date(p.published_at).toLocaleDateString()} · /{p.slug}
              </p>
            </div>
            <button
              type="button"
              onClick={() => remove.mutate(p.id)}
              aria-label={`Delete ${p.title}`}
              className="shrink-0 rounded-full border border-white/15 p-2 text-white/70 transition-colors hover:border-white/40 hover:text-white"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </GlassCard>
      ))}
      {(data ?? []).length === 0 && (
        <p className="text-sm text-white/60">No posts yet — ask DOSAAA to write one.</p>
      )}
    </div>
  );
}

function ContentPanel({ token }: { token: string }) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-content"],
    queryFn: () => adminListContent({ data: { token } }),
  });

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin-content"] });
    void queryClient.invalidateQueries({ queryKey: ["site-content"] });
  };

  const save = useMutation({
    mutationFn: (vars: { key: string; value: string }) =>
      adminSetContent({ data: { token, ...vars } }),
    onSuccess: refresh,
  });
  const remove = useMutation({
    mutationFn: (key: string) => adminDeleteContent({ data: { token, key } }),
    onSuccess: refresh,
  });

  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [savedKey, setSavedKey] = useState<string | null>(null);

  const commit = (key: string, value: string) => {
    save.mutate(
      { key, value },
      {
        onSuccess: () => {
          setDrafts((d) => {
            const next = { ...d };
            delete next[key];
            return next;
          });
          setSavedKey(key);
          window.setTimeout(() => setSavedKey(null), 1600);
        },
      },
    );
  };

  if (isLoading) return <p className="text-sm text-white/60">Loading site copy…</p>;

  return (
    <div className="space-y-3">
      <GlassCard className="!p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">Add a new key</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,220px)_minmax(0,1fr)_auto]">
          <input
            value={newKey}
            onChange={(e) => setNewKey(e.target.value.replace(/\s+/g, "_").toLowerCase())}
            placeholder="hero_name"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/40"
          />
          <input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Value shown on the site"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/40"
          />
          <button
            type="button"
            disabled={!newKey.trim() || save.isPending}
            onClick={() => {
              commit(newKey.trim(), newValue);
              setNewKey("");
              setNewValue("");
            }}
            className="rounded-full border border-white/70 bg-white/90 px-5 py-2.5 text-sm font-medium text-[#0b0b14] transition-colors hover:bg-white disabled:opacity-40"
          >
            Add
          </button>
        </div>
      </GlassCard>

      {(data ?? []).map((row) => {
        const key = row.key as string;
        const stored = (row.value as string) ?? "";
        const value = drafts[key] ?? stored;
        return (
          <GlassCard key={key} className="!p-4">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-white/50">{key}</span>
              <textarea
                value={value}
                rows={2}
                onChange={(e) => setDrafts((d) => ({ ...d, [key]: e.target.value }))}
                className="mt-2 w-full resize-y rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-white/40"
              />
            </label>
            <div className="mt-3 flex items-center justify-end gap-2">
              {savedKey === key && <span className="mr-auto text-xs text-white/60">Saved</span>}
              <button
                type="button"
                onClick={() => remove.mutate(key)}
                aria-label={`Delete ${key}`}
                className="rounded-full border border-white/15 p-2 text-white/70 transition-colors hover:border-white/40 hover:text-white"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={value === stored || save.isPending}
                onClick={() => commit(key, value)}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white transition-colors hover:bg-white/10 disabled:opacity-40"
              >
                <PencilLine className="h-4 w-4" /> Save
              </button>
            </div>
          </GlassCard>
        );
      })}

      {(save.error || remove.error) && (
        <p role="alert" className="text-sm text-red-300">
          {(save.error ?? remove.error)?.message}
        </p>
      )}
    </div>
  );
}

