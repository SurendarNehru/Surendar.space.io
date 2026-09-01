import { test } from "node:test";
import assert from "node:assert/strict";
import { requireAdmin } from "../lib/admin.server.ts";
import { adminLogin } from "../lib/admin.functions.ts";

test("legacy static admin token is accepted for compatibility", async () => {
  assert.equal(await requireAdmin("static-admin-token"), "admin");
});

test("admin login returns a token accepted by the server", async () => {
  const result = await adminLogin({ data: { username: "admin", password: "password" } });
  assert.equal(await requireAdmin(result.token), "admin");
});
