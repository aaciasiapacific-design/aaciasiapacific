import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the AACI website", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>AACI Asia Pacific \| Advancing healthcare standards<\/title>/i);
  assert.match(html, /Advancing Global Healthcare Standards in Asia Pacific/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
});

test("includes database-backed role and user administration", async () => {
  const [migration, usersPage, rolesPage, invitationRoute] = await Promise.all([
    readFile(new URL("../supabase/migrations/20260819000000_role_based_access_control.sql", import.meta.url), "utf8"),
    readFile(new URL("../app/admin/users/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/admin/roles/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/admin/users/route.ts", import.meta.url), "utf8"),
  ]);
  assert.match(migration, /create table public\.roles/i);
  assert.match(migration, /create table public\.role_permissions/i);
  assert.match(migration, /create or replace function public\.has_permission/i);
  assert.match(migration, /enable row level security/i);
  assert.match(usersPage, /Invite user/i);
  assert.match(rolesPage, /Roles & Permissions/i);
  assert.match(invitationRoute, /inviteUserByEmail/);
  assert.match(invitationRoute, /SUPABASE_SECRET_KEY/);
  assert.doesNotMatch(invitationRoute, /NEXT_PUBLIC_SUPABASE_SECRET/);
});
