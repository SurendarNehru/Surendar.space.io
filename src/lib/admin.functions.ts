type AdminPayload<T = Record<string, unknown>> = T | { data: T };

type LocalAdminState = {
  posts: Array<Record<string, unknown>>;
  content: Array<Record<string, unknown>>;
  projects: Array<Record<string, unknown>>;
};

const LOCAL_ADMIN_KEY = "local-admin-data";

// Mock AI responses for localhost development
const MOCK_RESPONSES: Record<string, string> = {
  "change the hero quote": "Updated hero_quote to match your request.",
  "add a project": "Created new project. Use the Projects tab to view and edit.",
  "make the accent color": "Updated UI accent color. Changes visible in preview.",
  "softer corners": "Applied new card styling with updated corners and surfaces.",
  "restyle": "Styling updated and applied across the site.",
  "change": "Content updated successfully.",
  "update": "Changes applied to the site.",
  "edit": "Site content modified.",
  "color": "Color scheme updated.",
  "corners": "Border radius updated for softer appearance.",
  "font": "Typography updated.",
};

function getMockAiResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  for (const [key, response] of Object.entries(MOCK_RESPONSES)) {
    if (lower.includes(key)) {
      return response;
    }
  }
  return `Your request "${userMessage}" has been processed. Changes reflected in the live preview.`;
}

function extractData<T>(input: AdminPayload<T> | undefined): T {
  if (!input) return {} as T;
  if (typeof input === "object" && "data" in input) {
    return (input as { data: T }).data;
  }
  return input as T;
}

function getLocalAdminState(): LocalAdminState {
  if (typeof window === "undefined") {
    return { posts: [], content: [], projects: [] };
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_ADMIN_KEY);
    if (!raw) {
      const initial: LocalAdminState = { posts: [], content: [], projects: [] };
      window.localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw) as Partial<LocalAdminState>;
    return {
      posts: Array.isArray(parsed.posts) ? parsed.posts : [],
      content: Array.isArray(parsed.content) ? parsed.content : [],
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
    };
  } catch {
    return { posts: [], content: [], projects: [] };
  }
}

function saveLocalAdminState(next: LocalAdminState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(next));
}

function createMockStreamResponse(userMessage: string): Response {
  const mockResponse = getMockAiResponse(userMessage);
  const messageId = `msg-${Date.now()}`;
  
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Text start event
      const textStart = {
        type: "text-start",
        id: messageId,
      };
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify(textStart)}\n\n`)
      );
      
      // Text content
      const textDelta = {
        type: "text-delta",
        id: messageId,
        delta: mockResponse,
      };
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify(textDelta)}\n\n`)
      );
      
      // Text end event
      const textEnd = {
        type: "text-end",
        id: messageId,
      };
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify(textEnd)}\n\n`)
      );
      
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}

async function localFallbackAdminRequest<T>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  const username = String(payload.username ?? "").trim();
  const password = String(payload.password ?? "");
  const token = typeof payload.token === "string" ? payload.token : "";

  if (action === "login") {
    if (username === "sanz_" && password === "surendardumbriyani") {
      const localToken = `local-dev-${Date.now()}`;
      window.sessionStorage.setItem("admin-token", localToken);
      return { token: localToken } as T;
    }
    throw new Error("Invalid username or password.");
  }

  if (action === "check") {
    if (!token || !token.startsWith("local-dev-")) throw new Error("Not signed in.");
    return { ok: true } as T;
  }

  if (!token || !token.startsWith("local-dev-")) throw new Error("Not signed in.");

  const state = getLocalAdminState();

  switch (action) {
    case "listPosts":
      return state.posts as T;
    case "deletePost": {
      const id = String(payload.id ?? "");
      const nextPosts = state.posts.filter((post) => String((post as { id?: string }).id ?? "") !== id);
      saveLocalAdminState({ ...state, posts: nextPosts });
      return { deleted: id } as T;
    }
    case "listContent":
      return state.content as T;
    case "setContent": {
      const key = String(payload.key ?? "");
      const value = String(payload.value ?? "");
      const nextContent = [...state.content.filter((row) => String((row as { key?: string }).key ?? "") !== key), { key, value }];
      saveLocalAdminState({ ...state, content: nextContent });
      return { key, value } as T;
    }
    case "deleteContent": {
      const key = String(payload.key ?? "");
      const nextContent = state.content.filter((row) => String((row as { key?: string }).key ?? "") !== key);
      saveLocalAdminState({ ...state, content: nextContent });
      return { deleted: key } as T;
    }
    case "listProjects":
      return state.projects as T;
    case "deleteProject": {
      const id = String(payload.id ?? "");
      const nextProjects = state.projects.filter((project) => String((project as { id?: string }).id ?? "") !== id);
      saveLocalAdminState({ ...state, projects: nextProjects });
      return { deleted: id } as T;
    }
    default:
      throw new Error("Unknown admin action.");
  }
}

async function requestAdmin<T>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  try {
    const response = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...payload }),
    });

    const text = await response.text();
    let data: unknown = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { error: text };
      }
    }

    if (!response.ok) {
      throw new Error(
        typeof data === "object" && data && "error" in data && typeof data.error === "string"
          ? data.error
          : "Admin request failed.",
      );
    }

    return data as T;
  } catch (error) {
    if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
      return localFallbackAdminRequest<T>(action, payload);
    }
    throw error;
  }
}

// Intercept fetch for /api/chat on localhost to provide mock streaming responses
if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
  const originalFetch = window.fetch;
  window.fetch = function (...args: Parameters<typeof fetch>) {
    const [resource, config] = args;
    const url = resource instanceof Request ? resource.url : String(resource);
    
    if (url.includes("/api/chat") && config?.method === "POST") {
      try {
        const body = config.body ? JSON.parse(String(config.body)) : {};
        const messages = Array.isArray(body.messages) ? body.messages : [];
        
        // Extract user message from the messages array
        let userMessage = "test";
        if (messages.length > 0) {
          const lastMessage = messages[messages.length - 1];
          
          // Try multiple ways to extract text from the message
          if (typeof lastMessage === "string") {
            userMessage = lastMessage;
          } else if (typeof lastMessage === "object" && lastMessage !== null) {
            // Try different possible paths
            if ("content" in lastMessage && typeof lastMessage.content === "string") {
              userMessage = lastMessage.content;
            } else if ("text" in lastMessage && typeof lastMessage.text === "string") {
              userMessage = lastMessage.text;
            } else if ("message" in lastMessage && typeof lastMessage.message === "string") {
              userMessage = lastMessage.message;
            } else if ("parts" in lastMessage && Array.isArray(lastMessage.parts)) {
              // Look for text in parts array
              const textPart = (lastMessage.parts as Array<{ type: string; text?: string }>).find(p => p.type === "text");
              if (textPart && "text" in textPart) {
                userMessage = String(textPart.text);
              }
            }
          }
        }
        
        // Debug: log the extraction
        console.log("[Mock Chat] User message extracted:", userMessage);
        
        return Promise.resolve(createMockStreamResponse(userMessage));
      } catch (e) {
        console.error("[Mock Chat] Error in fetch intercept:", e);
        // Fall back to original fetch if something goes wrong
        return originalFetch.apply(window, args);
      }
    }
    
    return originalFetch.apply(window, args);
  } as typeof fetch;
}

export async function adminLogin(payload: AdminPayload<{ username?: string; password?: string }>) {
  const data = extractData(payload);
  return requestAdmin<{ token: string }>("login", {
    username: data?.username,
    password: data?.password,
  });
}

export async function adminCheck(payload: AdminPayload<{ token?: string }>) {
  const data = extractData(payload);
  return requestAdmin<{ ok: boolean }>("check", { token: data?.token });
}

export async function adminListPosts(payload: AdminPayload<{ token?: string }> = {}) {
  const data = extractData(payload);
  return requestAdmin<unknown[]>("listPosts", { token: data?.token });
}

export async function adminDeletePost(payload: AdminPayload<{ token?: string; id: string }>) {
  const data = extractData(payload);
  return requestAdmin<{ deleted: string }>("deletePost", { token: data?.token, id: data?.id });
}

export async function adminListContent(payload: AdminPayload<{ token?: string }> = {}) {
  const data = extractData(payload);
  return requestAdmin<unknown[]>("listContent", { token: data?.token });
}

export async function adminSetContent(payload: AdminPayload<{ token?: string; key: string; value: string }>) {
  const data = extractData(payload);
  return requestAdmin<{ key: string; value: string }>("setContent", {
    token: data?.token,
    key: data?.key,
    value: data?.value,
  });
}

export async function adminDeleteContent(payload: AdminPayload<{ token?: string; key: string }>) {
  const data = extractData(payload);
  return requestAdmin<{ deleted: string }>("deleteContent", {
    token: data?.token,
    key: data?.key,
  });
}

export async function adminListProjects(payload: AdminPayload<{ token?: string }> = {}) {
  const data = extractData(payload);
  return requestAdmin<unknown[]>("listProjects", { token: data?.token });
}

export async function adminDeleteProject(payload: AdminPayload<{ token?: string; id: string }>) {
  const data = extractData(payload);
  return requestAdmin<{ deleted: string }>("deleteProject", { token: data?.token, id: data?.id });
}
