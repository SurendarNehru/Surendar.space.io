<<<<<<< HEAD
import { createServerFn } from "@tanstack/react-start";
=======
>>>>>>> ff8c7d592c716ee34ce90be01f9302b4ea4f9dba
import { z } from "zod";

const tokenSchema = z.object({ token: z.string().min(1) });

<<<<<<< HEAD
export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({ username: z.string().min(1), password: z.string().min(1) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { login } = await import("./admin.server");
    const token = await login(data.username, data.password);
    return { token };
  });

export const adminCheck = createServerFn({ method: "POST" })
  .inputValidator((data) => tokenSchema.parse(data))
  .handler(async ({ data }) => {
    const { isAdmin } = await import("./admin.server");
    return { ok: await isAdmin(data.token) };
  });

export const adminListPosts = createServerFn({ method: "POST" })
  .inputValidator((data) => tokenSchema.parse(data))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin.server");
    await requireAdmin(data.token);
    const { listPosts } = await import("./admin-data.server");
    return listPosts();
  });

export const adminDeletePost = createServerFn({ method: "POST" })
  .inputValidator((data) => tokenSchema.extend({ id: z.string().min(1) }).parse(data))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin.server");
    await requireAdmin(data.token);
    const { deletePost } = await import("./admin-data.server");
    return deletePost(data.id);
  });

export const adminListContent = createServerFn({ method: "POST" })
  .inputValidator((data) => tokenSchema.parse(data))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin.server");
    await requireAdmin(data.token);
    const { listContent } = await import("./admin-data.server");
    return listContent();
  });

export const adminSetContent = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    tokenSchema.extend({ key: z.string().min(1), value: z.string() }).parse(data),
  )
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin.server");
    await requireAdmin(data.token);
    const { setContent } = await import("./admin-data.server");
    return setContent(data.key, data.value);
  });

export const adminDeleteContent = createServerFn({ method: "POST" })
  .inputValidator((data) => tokenSchema.extend({ key: z.string().min(1) }).parse(data))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin.server");
    await requireAdmin(data.token);
    const { deleteContent } = await import("./admin-data.server");
    return deleteContent(data.key);
  });

export const adminListProjects = createServerFn({ method: "POST" })
  .inputValidator((data) => tokenSchema.parse(data))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin.server");
    await requireAdmin(data.token);
    const { listProjects } = await import("./admin-data.server");
    return listProjects();
  });

export const adminDeleteProject = createServerFn({ method: "POST" })
  .inputValidator((data) => tokenSchema.extend({ id: z.string().min(1) }).parse(data))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin.server");
    await requireAdmin(data.token);
    const { deleteProject } = await import("./admin-data.server");
    return deleteProject(data.id);
  });

=======
export const adminLogin = async (data: { username?: string; password?: string }) => {
  try {
    const { login } = await import("./admin.server");
    const token = await login(data.username ?? "", data.password ?? "");
    return { token };
  } catch {
    return { token: null };
  }
};

export const adminCheck = async (data: { token?: string }) => {
  try {
    const { isAdmin } = await import("./admin.server");
    return { ok: await isAdmin(data.token ?? "") };
  } catch {
    return { ok: false };
  }
};

export const adminListPosts = async (data: { token?: string }) => {
  try {
    const { requireAdmin } = await import("./admin.server");
    await requireAdmin(data.token ?? "");
    const { listPosts } = await import("./admin-data.server");
    return listPosts();
  } catch {
    return [];
  }
};

export const adminDeletePost = async (data: { token?: string; id?: string }) => {
  try {
    const { requireAdmin } = await import("./admin.server");
    await requireAdmin(data.token ?? "");
    const { deletePost } = await import("./admin-data.server");
    return deletePost(data.id ?? "");
  } catch {
    return { ok: false };
  }
};

export const adminListContent = async (data: { token?: string }) => {
  try {
    const { requireAdmin } = await import("./admin.server");
    await requireAdmin(data.token ?? "");
    const { listContent } = await import("./admin-data.server");
    return listContent();
  } catch {
    return [];
  }
};

export const adminSetContent = async (data: { token?: string; key?: string; value?: string }) => {
  try {
    const { requireAdmin } = await import("./admin.server");
    await requireAdmin(data.token ?? "");
    const { setContent } = await import("./admin-data.server");
    return setContent(data.key ?? "", data.value ?? "");
  } catch {
    return { ok: false };
  }
};

export const adminDeleteContent = async (data: { token?: string; key?: string }) => {
  try {
    const { requireAdmin } = await import("./admin.server");
    await requireAdmin(data.token ?? "");
    const { deleteContent } = await import("./admin-data.server");
    return deleteContent(data.key ?? "");
  } catch {
    return { ok: false };
  }
};

export const adminListProjects = async (data: { token?: string }) => {
  try {
    const { requireAdmin } = await import("./admin.server");
    await requireAdmin(data.token ?? "");
    const { listProjects } = await import("./admin-data.server");
    return listProjects();
  } catch {
    return [];
  }
};

export const adminDeleteProject = async (data: { token?: string; id?: string }) => {
  try {
    const { requireAdmin } = await import("./admin.server");
    await requireAdmin(data.token ?? "");
    const { deleteProject } = await import("./admin-data.server");
    return deleteProject(data.id ?? "");
  } catch {
    return { ok: false };
  }
};
>>>>>>> ff8c7d592c716ee34ce90be01f9302b4ea4f9dba
