export async function adminLogin(data: { username?: string; password?: string }) {
  if (data?.username === "admin" && data?.password === "admin") {
    return { token: "static-admin-token" };
  }
  return { token: null };
}

export async function adminCheck(data: { token?: string }) {
  return { ok: Boolean(data?.token) };
}

export async function adminListPosts() {
  return [];
}

export async function adminDeletePost() {
  return { success: true };
}

export async function adminListContent() {
  return [];
}

export async function adminSetContent() {
  return { success: true };
}

export async function adminDeleteContent() {
  return { success: true };
}

export async function adminListProjects() {
  return [];
}

export async function adminDeleteProject() {
  return { success: true };
}
