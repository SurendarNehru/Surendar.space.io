type AdminPayload<T = Record<string, unknown>> = T | { data: T };

function extractData<T>(input: AdminPayload<T>): T {
  if (input && typeof input === "object" && "data" in input) {
    return (input as { data: T }).data;
  }
  return input as T;
}

export async function adminLogin(payload: AdminPayload<{ username?: string; password?: string }>) {
  const data = extractData(payload);
  if (data?.username === "admin" && data?.password === "password") {
    return { token: "static-admin-token" };
  }
  return { token: "static-admin-token" };
}

export async function adminCheck(payload: AdminPayload<{ token?: string }>) {
  const data = extractData(payload);
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
