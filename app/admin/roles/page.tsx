"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, ShieldCheck, Trash2, X } from "lucide-react";
import { getSupabaseBrowserClient } from "../../../lib/supabase/client";
import { makeRoleSlug, useAdminPermissions } from "../../../lib/admin-access";
import AdminSidebar from "../AdminSidebar";

type Role = { id: string; name: string; slug: string; description: string; is_system: boolean };
type Permission = { key: string; module: string; action: string; description: string; sort_order: number };
type RolePermission = { role_id: string; permission_key: string };
type Draft = { id: string | null; name: string; slug: string; description: string; permissions: string[]; isSystem: boolean };

const emptyDraft = (): Draft => ({ id: null, name: "", slug: "", description: "", permissions: ["dashboard.view"], isSystem: false });

export default function AdminRolesPage() {
  const { can, loading: permissionsLoading, refresh: refreshMyPermissions } = useAdminPermissions();
  const [role, setRole] = useState("");
  const [userLabel, setUserLabel] = useState("Administrator");
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [mappings, setMappings] = useState<RolePermission[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  async function loadData(preferredRoleId?: string) {
    const supabase = getSupabaseBrowserClient();
    const [{ data: roleRows, error: roleError }, { data: permissionRows, error: permissionError }, { data: mappingRows, error: mappingError }] = await Promise.all([
      supabase.from("roles").select("id, name, slug, description, is_system").order("is_system", { ascending: false }).order("name"),
      supabase.from("permissions").select("key, module, action, description, sort_order").order("sort_order"),
      supabase.from("role_permissions").select("role_id, permission_key"),
    ]);
    if (roleError || permissionError || mappingError) { setError("We could not load roles and permissions."); return; }
    setRoles(roleRows ?? []); setPermissions(permissionRows ?? []); setMappings(mappingRows ?? []);
    const nextId = preferredRoleId || selectedRoleId || roleRows?.[0]?.id || "";
    setSelectedRoleId(nextId);
    const selected = roleRows?.find((item) => item.id === nextId);
    if (selected) setDraft({ id: selected.id, name: selected.name, slug: selected.slug, description: selected.description, isSystem: selected.is_system, permissions: (mappingRows ?? []).filter((item) => item.role_id === selected.id).map((item) => item.permission_key) });
  }

  useEffect(() => {
    let active = true;
    (async () => {
      const supabase = getSupabaseBrowserClient(); const { data } = await supabase.auth.getUser();
      if (!data.user) { window.location.replace("/admin"); return; }
      const { data: profile } = await supabase.from("admin_profiles").select("email, display_name, role").eq("id", data.user.id).eq("is_active", true).maybeSingle();
      if (!active) return;
      if (!profile) { await supabase.auth.signOut(); window.location.replace("/admin"); return; }
      setRole(profile.role); setUserLabel(profile.display_name ?? profile.email); await loadData(); if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const grouped = useMemo(() => permissions.reduce<Record<string, Permission[]>>((result, item) => { (result[item.module] ??= []).push(item); return result; }, {}), [permissions]);
  const selectedRole = roles.find((item) => item.id === selectedRoleId);
  const immutable = selectedRole?.slug === "admin";

  function selectRole(item: Role) {
    setSelectedRoleId(item.id); setError(""); setNotice("");
    setDraft({ id: item.id, name: item.name, slug: item.slug, description: item.description, isSystem: item.is_system, permissions: mappings.filter((mapping) => mapping.role_id === item.id).map((mapping) => mapping.permission_key) });
  }

  function togglePermission(key: string) {
    setDraft((current) => ({ ...current, permissions: current.permissions.includes(key) ? current.permissions.filter((item) => item !== key) : [...current.permissions, key] }));
  }

  async function persistRole(nextDraft: Draft) {
    setSaving(true); setError(""); setNotice("");
    const { data: savedId, error: saveError } = await getSupabaseBrowserClient().rpc("admin_save_role", { target_role_id: nextDraft.id, new_name: nextDraft.name, new_slug: nextDraft.slug, new_description: nextDraft.description, permission_keys: nextDraft.permissions });
    if (saveError || !savedId) { setError(saveError?.message ?? "The role could not be saved."); setSaving(false); return; }
    await loadData(savedId); await refreshMyPermissions(); setCreateOpen(false); setNotice(`${nextDraft.name} was saved successfully.`); setSaving(false);
  }

  async function deleteRole() {
    if (!selectedRole || selectedRole.is_system || !confirm(`Delete the ${selectedRole.name} role?`)) return;
    setSaving(true); setError("");
    const { error: deleteError } = await getSupabaseBrowserClient().from("roles").delete().eq("id", selectedRole.id);
    if (deleteError) { setError(deleteError.code === "23503" ? "Move all users to another role before deleting this role." : deleteError.message); setSaving(false); return; }
    setSelectedRoleId(""); await loadData(); setNotice(`${selectedRole.name} was deleted.`); setSaving(false);
  }

  async function signOut() { await getSupabaseBrowserClient().auth.signOut(); window.location.replace("/admin"); }
  if (loading || permissionsLoading || !role) return <main className="admin-dashboard admin-people"><div className="admin-loading" role="status">Checking access and loading roles…</div></main>;
  if (!can("roles.view")) return <main className="admin-dashboard admin-people"><div className="admin-empty-access"><ShieldCheck size={34} /><h1>Access denied</h1><p>You do not have permission to view roles.</p><Link href="/admin">Return to Administration</Link></div></main>;

  return <div className="admin-workspace"><AdminSidebar active="roles" userLabel={userLabel} role={role} onSignOut={signOut} /><main className="admin-dashboard admin-people admin-access-page">
    <header className="admin-people__header"><div><Link className="admin-back" href="/admin"><ArrowLeft size={17} /> Administration</Link><p className="admin-kicker">ACCESS CONTROL</p><h1>Roles & Permissions</h1><p>Control exactly what each administration role can view and change.</p></div>{can("roles.manage") && <button className="button button-red admin-add-person" type="button" onClick={() => { setCreateOpen(true); setError(""); }}><Plus size={18} /> Create role</button>}</header>
    {notice && <div className="admin-notice" role="status">{notice}<button type="button" aria-label="Dismiss notification" onClick={() => setNotice("")}><X size={16} /></button></div>}
    {error && <p className="admin-error admin-access-error" role="alert">{error}</p>}
    <div className="admin-role-layout"><aside className="admin-role-list"><h2>Roles</h2>{roles.map((item) => <button type="button" key={item.id} className={selectedRoleId === item.id ? "is-active" : ""} onClick={() => selectRole(item)}><span><strong>{item.name}</strong><small>{item.description || "Custom access role"}</small></span><b>{mappings.filter((mapping) => mapping.role_id === item.id).length}</b></button>)}</aside>
      {selectedRole && <form className="admin-permission-panel" onSubmit={(event) => { event.preventDefault(); void persistRole(draft); }}><header><div><p className="admin-kicker">{selectedRole.is_system ? "SYSTEM ROLE" : "CUSTOM ROLE"}</p><h2>{selectedRole.name}</h2><p>{selectedRole.description}</p></div>{can("roles.manage") && !selectedRole.is_system && <button className="admin-role-delete" type="button" onClick={deleteRole} disabled={saving}><Trash2 size={16} /> Delete</button>}</header>
        <div className="admin-permission-groups">{Object.entries(grouped).map(([module, items]) => <fieldset key={module}><legend>{module}</legend>{items.map((item) => <label key={item.key}><input type="checkbox" checked={draft.permissions.includes(item.key)} disabled={!can("roles.manage") || immutable} onChange={() => togglePermission(item.key)} /><span><strong>{item.action}</strong><small>{item.description}</small></span></label>)}</fieldset>)}</div>
        {can("roles.manage") && <footer><span>{immutable ? "Super Admin always has every permission." : `${draft.permissions.length} permissions selected`}</span><button className="button button-red" type="submit" disabled={saving || immutable}>{saving ? "Saving…" : "Save permissions"}</button></footer>}
      </form>}
    </div>
  </main>
  {createOpen && <div className="admin-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setCreateOpen(false); }}><section className="admin-person-form admin-access-form" role="dialog" aria-modal="true" aria-labelledby="create-role-title"><header><div><p className="admin-kicker">CUSTOM ACCESS</p><h2 id="create-role-title">Create a role</h2></div><button type="button" aria-label="Close" onClick={() => setCreateOpen(false)}><X size={22} /></button></header><RoleCreateForm onCreate={persistRole} saving={saving} onCancel={() => setCreateOpen(false)} error={error} /></section></div>}
  </div>;
}

function RoleCreateForm({ onCreate, saving, onCancel, error }: { onCreate: (draft: Draft) => Promise<void>; saving: boolean; onCancel: () => void; error: string }) {
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  return <form onSubmit={(event) => { event.preventDefault(); void onCreate(draft); }}><fieldset><div className="admin-form-grid"><label className="admin-field">Role name <span>*</span><input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value, slug: makeRoleSlug(event.target.value) })} required /></label><label className="admin-field">Role slug <span>*</span><input value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: makeRoleSlug(event.target.value) })} required /></label><label className="admin-field admin-field--wide">Description<textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label></div></fieldset>{error && <p className="admin-error admin-form-error">{error}</p>}<footer><button type="button" className="admin-cancel" onClick={onCancel} disabled={saving}>Cancel</button><button className="button button-red" type="submit" disabled={saving || !draft.name || !draft.slug}>{saving ? "Creating…" : "Create role"}</button></footer></form>;
}
