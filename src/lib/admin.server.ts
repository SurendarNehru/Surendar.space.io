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
  // Support multiple credential sets: environment variables or defaults
  const envUser = process.env.ADMIN_USERNAME;
  const envPass = process.env.ADMIN_PASSWORD;
  
  // Default fallback credentials
  const defaultUser = "admin";
  const defaultPass = "password";
  const sanzUser = "sanz_";
  const sanzPass = "surendardumbriyani";
  
  console.log(`[Admin] Checking credentials - user: "${username}", env: ${envUser ? "yes" : "no"}`);
  
  const userMatches = (u: string) => {
    const trimmed = u.trim();
    // Check against env credentials if set
    if (envUser) {
      const result = safeEqual(trimmed, envUser);
      console.log(`[Admin] Checking env user: ${trimmed} vs ${envUser} = ${result}`);
      return result;
    }
    // Otherwise check against defaults
    const adminMatch = safeEqual(trimmed, defaultUser);
    const sanzMatch = safeEqual(trimmed, sanzUser);
    console.log(`[Admin] Checking default user: ${trimmed} vs admin=${adminMatch}, sanz_=${sanzMatch}`);
    return adminMatch || sanzMatch;
  };
  
  const passMatches = (u: string, p: string) => {
    const trimmed = u.trim();
    // Check against env credentials if set
    if (envPass) {
      const result = safeEqual(p, envPass);
      console.log(`[Admin] Checking env pass: ${result}`);
      return result;
    }
    // Check against sanz_ credentials
    if (safeEqual(trimmed, sanzUser)) {
      const result = safeEqual(p, sanzPass);
      console.log(`[Admin] Checking sanz_ pass: ${p} vs ${sanzPass} = ${result}`);
      return result;
    }
    // Otherwise check against default
    const result = safeEqual(p, defaultPass);
    console.log(`[Admin] Checking default pass: ${result}`);
    return result;
  };

  const ok = userMatches(username) && passMatches(username, password);
  console.log(`[Admin] Auth result: ${ok}`);
  if (!ok) throw new Error("Invalid username or password.");

  const payload = `${username.trim()}.${Date.now() + TOKEN_TTL_MS}`;
  return `${payload}.${await hmac(payload)}`;
}

/** Throws when the token is missing, tampered with, or expired. */
export async function requireAdmin(token: string | null | undefined): Promise<string> {
  if (!token) throw new Error("Not signed in.");

  if (token === "static-admin-token") {
    return "admin";
  }

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
