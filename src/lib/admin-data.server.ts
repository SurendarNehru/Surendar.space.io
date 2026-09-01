/**
 * Shared data operations for the admin panel.
 * Server-only — uses the service role client, so every caller must be
 * verified with requireAdmin() first.
 */
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type AdminPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  url: string | null;
  published_at: string;
};

export async function listPosts(): Promise<AdminPost[]> {
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("id,title,slug,excerpt,tags,url,published_at")
    .order("published_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminPost[];
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function createPost(input: {
  title: string;
  excerpt?: string;
  slug?: string;
  tags?: string[];
  url?: string;
  publishedAt?: string;
}) {
  const slug = input.slug?.trim() || slugify(input.title);
  const { data, error } = await supabaseAdmin
    .from("posts")
    .insert({
      title: input.title,
      slug,
      excerpt: input.excerpt ?? "",
      tags: input.tags ?? [],
      url: input.url ?? "/blog",
      ...(input.publishedAt ? { published_at: input.publishedAt } : {}),
    })
    .select("id,title,slug,excerpt,tags,url,published_at")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updatePost(input: {
  id: string;
  title?: string;
  excerpt?: string;
  slug?: string;
  tags?: string[];
  url?: string;
  publishedAt?: string;
}) {
  const patch: {
    title?: string;
    excerpt?: string;
    slug?: string;
    tags?: string[];
    url?: string;
    published_at?: string;
  } = {};
  if (input.title !== undefined) patch.title = input.title;
  if (input.excerpt !== undefined) patch.excerpt = input.excerpt;
  if (input.slug !== undefined) patch.slug = input.slug;
  if (input.tags !== undefined) patch.tags = input.tags;
  if (input.url !== undefined) patch.url = input.url;
  if (input.publishedAt !== undefined) patch.published_at = input.publishedAt;

  const { data, error } = await supabaseAdmin
    .from("posts")
    .update(patch)
    .eq("id", input.id)
    .select("id,title,slug,excerpt,tags,url,published_at")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deletePost(id: string) {
  const { error } = await supabaseAdmin.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { deleted: id };
}

export async function listContent() {
  const { data, error } = await supabaseAdmin
    .from("site_content")
    .select("key,value,updated_at")
    .order("key");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function setContent(key: string, value: string) {
  const { data, error } = await supabaseAdmin
    .from("site_content")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" })
    .select("key,value")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteContent(key: string) {
  const { error } = await supabaseAdmin.from("site_content").delete().eq("key", key);
  if (error) throw new Error(error.message);
  return { deleted: key };
}

/* ---------------------------------- projects --------------------------------- */

export type AdminProject = {
  id: string;
  name: string;
  description: string;
  tag: string;
  url: string | null;
  sort_order: number;
};

const PROJECT_COLS = "id,name,description,tag,url,sort_order";

export async function listProjects(): Promise<AdminProject[]> {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select(PROJECT_COLS)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminProject[];
}

export async function createProject(input: {
  name: string;
  description?: string;
  tag?: string;
  url?: string;
  sortOrder?: number;
}) {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .insert({
      name: input.name,
      description: input.description ?? "",
      tag: input.tag ?? "",
      url: input.url ?? null,
      ...(input.sortOrder !== undefined ? { sort_order: input.sortOrder } : {}),
    })
    .select(PROJECT_COLS)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateProject(input: {
  id: string;
  name?: string;
  description?: string;
  tag?: string;
  url?: string;
  sortOrder?: number;
}) {
  const patch: {
    name?: string;
    description?: string;
    tag?: string;
    url?: string;
    sort_order?: number;
  } = {};
  if (input.name !== undefined) patch.name = input.name;
  if (input.description !== undefined) patch.description = input.description;
  if (input.tag !== undefined) patch.tag = input.tag;
  if (input.url !== undefined) patch.url = input.url;
  if (input.sortOrder !== undefined) patch.sort_order = input.sortOrder;

  const { data, error } = await supabaseAdmin
    .from("projects")
    .update(patch)
    .eq("id", input.id)
    .select(PROJECT_COLS)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteProject(id: string) {
  const { error } = await supabaseAdmin.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { deleted: id };
}
