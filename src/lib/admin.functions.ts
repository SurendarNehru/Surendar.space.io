import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const tokenSchema = z.object({ token: z.string().min(1) });

export const adminLogin = createServerFn({ method: "POST" })
  .validator((data) =>
    z.object({ username: z.string().min(1), password: z.string().min(1) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { login } = await import("./admin.server");
    const token = await login(data.username, data.password);
    return { token };
  });

export const adminCheck = createServerFn({ method: "POST" })
  .validator((data) => tokenSchema.parse(data))
  .handler(async ({ data }) => {
    const { isAdmin } = await import("./admin.server");
    return { ok: await isAdmin(data.token) };
  });

export const adminListPosts = createServerFn({ method: "POST" })
  .validator((data) => tokenSchema.parse(data))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin.server");
    await requireAdmin(data.token);
    const { listPosts } = await import("./admin-data.server");
    return listPosts();
  });

export const adminDeletePost = createServerFn({ method: "POST" })
  .validator((data) => tokenSchema.extend({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin.server");
    await requireAdmin(data.token);
    const { deletePost } = await import("./admin-data.server");
    return deletePost(data.id);
  });

export const adminListContent = createServerFn({ method: "POST" })
  .validator((data) => tokenSchema.parse(data))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin.server");
    await requireAdmin(data.token);
    const { listContent } = await import("./admin-data.server");
    return listContent();
  });

export const adminSetContent = createServerFn({ method: "POST" })
  .validator((data) =>
    tokenSchema.extend({ key: z.string().min(1), value: z.string() }).parse(data),
  )
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin.server");
    await requireAdmin(data.token);
    const { setContent } = await import("./admin-data.server");
    return setContent(data.key, data.value);
  });

export const adminDeleteContent = createServerFn({ method: "POST" })
  .validator((data) => tokenSchema.extend({ key: z.string().min(1) }).parse(data))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin.server");
    await requireAdmin(data.token);
    const { deleteContent } = await import("./admin-data.server");
    return deleteContent(data.key);
  });

export const adminListProjects = createServerFn({ method: "POST" })
  .validator((data) => tokenSchema.parse(data))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin.server");
    await requireAdmin(data.token);
    const { listProjects } = await import("./admin-data.server");
    return listProjects();
  });

export const adminDeleteProject = createServerFn({ method: "POST" })
  .validator((data) => tokenSchema.extend({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin.server");
    await requireAdmin(data.token);
    const { deleteProject } = await import("./admin-data.server");
    return deleteProject(data.id);
  });
