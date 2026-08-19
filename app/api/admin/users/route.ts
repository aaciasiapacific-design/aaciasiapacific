import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../../../lib/supabase/database.types";

type InviteBody = { email?: string; displayName?: string; roleId?: string };

function json(message: string, status: number, extra: Record<string, unknown> = {}) {
  return Response.json({ message, ...extra }, { status });
}

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const secretKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !publishableKey || !secretKey) return json("User invitations are not configured on the server.", 503);

  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return json("Authentication is required.", 401);

  const caller = createClient<Database>(url, publishableKey, {
    global: { headers: { Authorization: authorization } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const token = authorization.slice(7);
  const { data: callerAuth, error: callerError } = await caller.auth.getUser(token);
  if (callerError || !callerAuth.user) return json("Your session is invalid or has expired.", 401);

  const { data: allowed, error: permissionError } = await caller.rpc("has_permission", { requested_permission: "users.create" });
  if (permissionError || !allowed) return json("You do not have permission to invite users.", 403);

  let body: InviteBody;
  try { body = await request.json() as InviteBody; } catch { return json("The invitation details are invalid.", 400); }
  const email = body.email?.trim().toLowerCase() ?? "";
  const displayName = body.displayName?.trim() ?? "";
  const roleId = body.roleId?.trim() ?? "";
  if (!/^\S+@\S+\.\S+$/.test(email) || !roleId) return json("A valid email address and role are required.", 400);

  const admin = createClient<Database>(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
  const { data: role, error: roleError } = await admin.from("roles").select("id, slug").eq("id", roleId).maybeSingle();
  if (roleError || !role) return json("The selected role no longer exists.", 400);
  if (role.slug === "admin") {
    const { data: canAssignSuperAdmin } = await caller.rpc("has_permission", { requested_permission: "roles.manage" });
    if (!canAssignSuperAdmin) return json("Only a Super Admin can assign the Super Admin role.", 403);
  }

  const redirectTo = `${new URL(request.url).origin}/admin/reset-password`;
  const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { display_name: displayName || undefined },
    redirectTo,
  });
  if (inviteError || !invited.user) {
    const duplicate = /already|registered|exists/i.test(inviteError?.message ?? "");
    return json(duplicate ? "A user with this email address already exists." : "The invitation could not be sent.", duplicate ? 409 : 502);
  }

  const { error: profileError } = await admin.from("admin_profiles").insert({
    id: invited.user.id,
    email,
    display_name: displayName || null,
    role_id: role.id,
    is_active: true,
  });
  if (profileError) {
    await admin.auth.admin.deleteUser(invited.user.id);
    return json("The account profile could not be created. Please try again.", 500);
  }

  await admin.from("admin_audit_log").insert({ actor_id: callerAuth.user.id, action: "user.invited", target_type: "admin_user", target_id: invited.user.id, details: { email, role_id: role.id } });

  return json("Invitation sent successfully.", 201, { userId: invited.user.id });
}
