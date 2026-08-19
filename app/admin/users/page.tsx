"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MailPlus, Pencil, Search, UserCog, X } from "lucide-react";
import { getSupabaseBrowserClient } from "../../../lib/supabase/client";
import { useAdminPermissions } from "../../../lib/admin-access";
import AdminSidebar from "../AdminSidebar";

type Role = { id: string; name: string; slug: string; description: string };
type UserRow = { id: string; email: string; display_name: string | null; role: string; role_id: string; is_active: boolean; created_at: string; updated_at: string };
type UserDraft = { displayName: string; roleId: string; isActive: boolean };

export default function AdminUsersPage() {
  const { can, loading: permissionsLoading } = useAdminPermissions();
  const [role, setRole] = useState("");
  const [userLabel, setUserLabel] = useState("Administrator");
  const [currentUserId, setCurrentUserId] = useState("");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invite, setInvite] = useState({ email: "", displayName: "", roleId: "" });
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [draft, setDraft] = useState<UserDraft>({ displayName: "", roleId: "", isActive: true });
  const [saving, setSaving] = useState(false);

  async function loadData() {
    const supabase = getSupabaseBrowserClient();
    const [{ data: userRows, error: usersError }, { data: roleRows, error: rolesError }] = await Promise.all([
      supabase.from("admin_profiles").select("id, email, display_name, role, role_id, is_active, created_at, updated_at").order("created_at"),
      supabase.from("roles").select("id, name, slug, description").order("name"),
    ]);
    if (usersError || rolesError) { setError("We could not load administration users."); return; }
    setUsers(userRows ?? []);
    setRoles(roleRows ?? []);
    setInvite((current) => ({ ...current, roleId: current.roleId || roleRows?.find((item) => item.slug === "editor")?.id || roleRows?.[0]?.id || "" }));
  }

  useEffect(() => {
    let active = true;
    (async () => {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getUser();
      if (!data.user) { window.location.replace("/admin"); return; }
      const { data: profile } = await supabase.from("admin_profiles").select("email, display_name, role").eq("id", data.user.id).eq("is_active", true).maybeSingle();
      if (!active) return;
      if (!profile) { await supabase.auth.signOut(); window.location.replace("/admin"); return; }
      setCurrentUserId(data.user.id); setRole(profile.role); setUserLabel(profile.display_name ?? profile.email);
      await loadData(); if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => { const term = search.trim().toLowerCase(); return users.filter((item) => !term || `${item.display_name ?? ""} ${item.email} ${item.role}`.toLowerCase().includes(term)); }, [search, users]);
  const roleName = (roleId: string) => roles.find((item) => item.id === roleId)?.name ?? "Unknown role";
  const assignableRoles = roles.filter((item) => item.slug !== "admin" || can("roles.manage"));

  async function submitInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError(""); setNotice("");
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase.auth.getSession();
    const response = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session?.access_token ?? ""}` }, body: JSON.stringify(invite) });
    const result = await response.json() as { message?: string };
    if (!response.ok) { setError(result.message ?? "The invitation could not be sent."); setSaving(false); return; }
    await loadData(); setInviteOpen(false); setInvite({ email: "", displayName: "", roleId: roles.find((item) => item.slug === "editor")?.id ?? roles[0]?.id ?? "" });
    setNotice(`Invitation sent to ${invite.email.trim().toLowerCase()}.`); setSaving(false);
  }

  function openEdit(item: UserRow) {
    setEditing(item); setDraft({ displayName: item.display_name ?? "", roleId: item.role_id, isActive: item.is_active }); setError("");
  }

  async function submitEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!editing) return; setSaving(true); setError(""); setNotice("");
    const { error: updateError } = await getSupabaseBrowserClient().rpc("admin_update_user", { target_user_id: editing.id, new_display_name: draft.displayName, new_role_id: draft.roleId, new_is_active: draft.isActive });
    if (updateError) { setError(updateError.message); setSaving(false); return; }
    await loadData(); setEditing(null); setNotice(`${editing.email} was updated successfully.`); setSaving(false);
  }

  async function signOut() { await getSupabaseBrowserClient().auth.signOut(); window.location.replace("/admin"); }
  if (loading || permissionsLoading || !role) return <main className="admin-dashboard admin-people"><div className="admin-loading" role="status">Checking access and loading users…</div></main>;
  if (!can("users.view")) return <main className="admin-dashboard admin-people"><div className="admin-empty-access"><UserCog size={34} /><h1>Access denied</h1><p>You do not have permission to view administration users.</p><Link href="/admin">Return to Administration</Link></div></main>;

  return <div className="admin-workspace"><AdminSidebar active="users" userLabel={userLabel} role={role} onSignOut={signOut} /><main className="admin-dashboard admin-people admin-access-page">
    <header className="admin-people__header"><div><Link className="admin-back" href="/admin"><ArrowLeft size={17} /> Administration</Link><p className="admin-kicker">ACCESS CONTROL</p><h1>Administration Users</h1><p>Invite team members, assign roles and suspend access when needed.</p></div>{can("users.create") && <button className="button button-red admin-add-person" type="button" onClick={() => setInviteOpen(true)}><MailPlus size={18} /> Invite user</button>}</header>
    <div className="admin-news__controls"><label className="admin-news__search"><Search size={17} /><span className="sr-only">Search users</span><input type="search" placeholder="Search users" value={search} onChange={(event) => setSearch(event.target.value)} /></label></div>
    {notice && <div className="admin-notice" role="status">{notice}<button type="button" aria-label="Dismiss notification" onClick={() => setNotice("")}><X size={16} /></button></div>}
    {error && <p className="admin-error admin-access-error" role="alert">{error}</p>}
    <section className="admin-people__list"><div className="admin-people__list-header"><div><h2>Team access</h2><p>{filtered.length} {filtered.length === 1 ? "user" : "users"}</p></div><small>Disabled users are rejected by database access rules immediately.</small></div>
      <div className="admin-user-rows">{filtered.map((item) => <article className="admin-user-row" key={item.id}><div className="admin-user-avatar">{(item.display_name ?? item.email).charAt(0).toUpperCase()}</div><div><h3>{item.display_name || "Name not provided"}{item.id === currentUserId && <small>YOU</small>}</h3><p>{item.email}</p></div><span>{roleName(item.role_id)}</span><span className={`admin-status admin-status--${item.is_active ? "published" : "archived"}`}>{item.is_active ? "Active" : "Disabled"}</span>{can("users.update") && <button type="button" onClick={() => openEdit(item)}><Pencil size={16} /> Edit</button>}</article>)}</div>
    </section>
  </main>
  {inviteOpen && <div className="admin-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setInviteOpen(false); }}><section className="admin-person-form admin-access-form" role="dialog" aria-modal="true" aria-labelledby="invite-title"><header><div><p className="admin-kicker">NEW ADMINISTRATION USER</p><h2 id="invite-title">Invite a team member</h2></div><button type="button" aria-label="Close" onClick={() => setInviteOpen(false)}><X size={22} /></button></header><form onSubmit={submitInvite}><fieldset><div className="admin-form-grid"><label className="admin-field">Display name<input value={invite.displayName} onChange={(event) => setInvite({ ...invite, displayName: event.target.value })} /></label><label className="admin-field">Email address <span>*</span><input type="email" value={invite.email} onChange={(event) => setInvite({ ...invite, email: event.target.value })} required /></label><label className="admin-field admin-field--wide">Role <span>*</span><select value={invite.roleId} onChange={(event) => setInvite({ ...invite, roleId: event.target.value })} required>{assignableRoles.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><small>The user will receive an email to create a password.</small></label></div></fieldset>{error && <p className="admin-error admin-form-error">{error}</p>}<footer><button type="button" className="admin-cancel" onClick={() => setInviteOpen(false)} disabled={saving}>Cancel</button><button className="button button-red" type="submit" disabled={saving}>{saving ? "Sending…" : "Send invitation"}</button></footer></form></section></div>}
  {editing && <div className="admin-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setEditing(null); }}><section className="admin-person-form admin-access-form" role="dialog" aria-modal="true" aria-labelledby="edit-user-title"><header><div><p className="admin-kicker">USER ACCESS</p><h2 id="edit-user-title">Edit {editing.email}</h2></div><button type="button" aria-label="Close" onClick={() => setEditing(null)}><X size={22} /></button></header><form onSubmit={submitEdit}><fieldset><div className="admin-form-grid"><label className="admin-field">Display name<input value={draft.displayName} onChange={(event) => setDraft({ ...draft, displayName: event.target.value })} /></label><label className="admin-field">Role<select value={draft.roleId} disabled={editing.id === currentUserId} onChange={(event) => setDraft({ ...draft, roleId: event.target.value })}>{assignableRoles.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label className="admin-checkbox admin-field--wide"><input type="checkbox" checked={draft.isActive} disabled={editing.id === currentUserId || !can("users.disable")} onChange={(event) => setDraft({ ...draft, isActive: event.target.checked })} /><span><strong>Active account</strong><small>Disabled accounts cannot access administration data.</small></span></label></div></fieldset>{error && <p className="admin-error admin-form-error">{error}</p>}<footer><button type="button" className="admin-cancel" onClick={() => setEditing(null)} disabled={saving}>Cancel</button><button className="button button-red" type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button></footer></form></section></div>}
  </div>;
}
