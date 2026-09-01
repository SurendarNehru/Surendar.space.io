import { createFileRoute } from "@tanstack/react-router";
import { login, requireAdmin } from "@/lib/admin.server";
import * as data from "@/lib/admin-data.server";

export const Route = createFileRoute("/api/admin")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: Record<string, unknown> = {};
        try {
          body = (await request.json()) as Record<string, unknown>;
        } catch {
          body = {};
        }

        const action = typeof body.action === "string" ? body.action : "";
        const token = typeof body.token === "string" ? body.token : undefined;

        try {
          switch (action) {
            case "login": {
              const username = String(body.username ?? "").trim();
              const password = String(body.password ?? "");
              console.log(`[Admin] Login attempt - username: ${username}`);
              const nextToken = await login(username, password);
              console.log(`[Admin] Login successful for: ${username}`);
              return Response.json({ token: nextToken });
            }
            case "check": {
              await requireAdmin(token ?? null);
              return Response.json({ ok: true });
            }
            case "listPosts": {
              await requireAdmin(token ?? null);
              return Response.json(await data.listPosts());
            }
            case "deletePost": {
              await requireAdmin(token ?? null);
              const id = String(body.id ?? "");
              if (!id) throw new Error("Missing post id.");
              return Response.json(await data.deletePost(id));
            }
            case "listContent": {
              await requireAdmin(token ?? null);
              return Response.json(await data.listContent());
            }
            case "setContent": {
              await requireAdmin(token ?? null);
              const key = String(body.key ?? "");
              const value = String(body.value ?? "");
              if (!key) throw new Error("Missing content key.");
              return Response.json(await data.setContent(key, value));
            }
            case "deleteContent": {
              await requireAdmin(token ?? null);
              const key = String(body.key ?? "");
              if (!key) throw new Error("Missing content key.");
              return Response.json(await data.deleteContent(key));
            }
            case "listProjects": {
              await requireAdmin(token ?? null);
              return Response.json(await data.listProjects());
            }
            case "deleteProject": {
              await requireAdmin(token ?? null);
              const id = String(body.id ?? "");
              if (!id) throw new Error("Missing project id.");
              return Response.json(await data.deleteProject(id));
            }
            default:
              return Response.json({ error: "Unknown admin action." }, { status: 400 });
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : "Admin action failed.";
          console.error(`[Admin] Error - Action: ${action}, Error: ${errorMsg}`);
          return Response.json(
            {
              error: errorMsg,
            },
            { status: 400 },
          );
        }
      },
    },
  },
});
