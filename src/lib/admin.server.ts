/**
 * Server-only admin session helpers.
 *
 * The admin panel is a single-operator surface: credentials live in
 * environment secrets (ADMIN_USERNAME / ADMIN_PASSWORD) and a signed,
 * expiring HMAC token proves the caller is that operator.
 */

const TOKEN_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function b64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(payload: string): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET || "cosmic-canvas-secret-key-2026";
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return b64url(new Uint8Array(sig));
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function login(username: string, password: string): Promise<string> {
  const expectedUser = process.env.ADMIN_USERNAME || "admin";
  const expectedPass = process.env.ADMIN_PASSWORD || "admin123";

  const ok =
    safeEqual(username.trim(), expectedUser) && safeEqual(password, expectedPass);
  if (!ok) throw new Error("Invalid username or password.");

  const payload = `${expectedUser}.${Date.now() + TOKEN_TTL_MS}`;
  return `${payload}.${await hmac(payload)}`;
}

/** Throws when the token is missing, tampered with, or expired. */
export async function requireAdmin(token: string | null | undefined): Promise<string> {
  if (!token) throw new Error("Not signed in.");
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid session.");
  const [user, exp, sig] = parts;
  const payload = `${user}.${exp}`;
  if (!safeEqual(sig, await hmac(payload))) throw new Error("Invalid session.");
  if (Number(exp) < Date.now()) throw new Error("Session expired. Please sign in again.");
  return user;
}

export async function isAdmin(token: string | null | undefined): Promise<boolean> {
  try {
    await requireAdmin(token);
    return true;
  } catch {
    return false;
  }
}
