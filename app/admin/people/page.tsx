"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronUp, ImagePlus, Pencil, Plus, Trash2, UserRound, X } from "lucide-react";
import { getSupabaseBrowserClient } from "../../../lib/supabase/client";
import { useAdminPermissions } from "../../../lib/admin-access";
import AdminSidebar from "../AdminSidebar";
import {
  AdminRole,
  getPeoplePhotoUrl,
  PEOPLE_SECTIONS,
  PersonCountry,
  PersonRecord,
  PeopleSection,
  PeopleStatus,
  SPECIALTY_LABELS,
  STATUS_LABELS,
  SurveyorSpecialty,
} from "../../../lib/people";

type AssignmentQueryRow = {
  id: string;
  section: PeopleSection;
  role_title: string | null;
  organization_name: string | null;
  member_code: string | null;
  surveyor_specialty: SurveyorSpecialty | null;
  is_leadership: boolean;
  sort_order: number;
  status: PeopleStatus;
  people: {
    id: string;
    full_name: string;
    credentials: string | null;
    photo_path: string | null;
    biography: string | null;
  };
  person_assignment_countries: PersonCountry[];
};

type FormState = {
  full_name: string;
  credentials: string;
  biography: string;
  section: PeopleSection;
  role_title: string;
  organization_name: string;
  member_code: string;
  surveyor_specialty: SurveyorSpecialty | "";
  is_leadership: boolean;
  sort_order: number;
  status: PeopleStatus;
  countries: PersonCountry[];
};

const emptyForm = (section: PeopleSection, sortOrder = 1): FormState => ({
  full_name: "",
  credentials: "",
  biography: "",
  section,
  role_title: "",
  organization_name: "",
  member_code: "",
  surveyor_specialty: section === "surveyor" ? "clinical" : "",
  is_leadership: false,
  sort_order: sortOrder,
  status: "draft",
  countries: [],
});

function toRecord(row: AssignmentQueryRow): PersonRecord {
  return {
    id: row.people.id,
    assignmentId: row.id,
    full_name: row.people.full_name,
    credentials: row.people.credentials,
    photo_path: row.people.photo_path,
    biography: row.people.biography,
    section: row.section,
    role_title: row.role_title,
    organization_name: row.organization_name,
    member_code: row.member_code,
    surveyor_specialty: row.surveyor_specialty,
    is_leadership: row.is_leadership,
    sort_order: row.sort_order,
    status: row.status,
    countries: [...(row.person_assignment_countries ?? [])].sort((a, b) => a.sort_order - b.sort_order),
  };
}

function optional(value: string) {
  const trimmed = value.trim();
  return trimmed || null;
}

function safeFilename(filename: string) {
  return filename.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "") || "profile-image";
}

export default function AdminPeoplePage() {
  const { can } = useAdminPermissions();
  const [role, setRole] = useState<AdminRole | null>(null);
  const [userLabel, setUserLabel] = useState("Administrator");
  const [activeSection, setActiveSection] = useState<PeopleSection>("asia_office");
  const [people, setPeople] = useState<PersonRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<PersonRecord | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm("asia_office"));
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<PersonRecord | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [reordering, setReordering] = useState(false);

  async function loadPeople() {
    setLoadError("");
    const { data, error } = await getSupabaseBrowserClient()
      .from("person_assignments")
      .select(`
        id, section, role_title, organization_name, member_code, surveyor_specialty,
        is_leadership, sort_order, status,
        people!inner(id, full_name, credentials, photo_path, biography),
        person_assignment_countries(id, country_code, country_name, sort_order)
      `)
      .order("sort_order", { ascending: true });

    if (error) {
      setLoadError("We could not load the people directory. Please refresh and try again.");
      setPeople([]);
      return;
    }
    setPeople(((data ?? []) as unknown as AssignmentQueryRow[]).map(toRecord));
  }

  useEffect(() => {
    let active = true;

    async function checkAccess() {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      if (!data.user) {
        window.location.replace("/admin");
        return;
      }

      const { data: profile } = await supabase
        .from("admin_profiles")
        .select("email, display_name, role")
        .eq("id", data.user.id)
        .eq("is_active", true)
        .maybeSingle();

      if (!active) return;
      if (!profile) {
        await supabase.auth.signOut();
        window.location.replace("/admin");
        return;
      }

      setRole(profile.role as AdminRole);
      setUserLabel(profile.display_name ?? profile.email);
      await loadPeople();
      if (active) setLoading(false);
    }

    checkAccess();
    return () => { active = false; };
  }, []);

  useEffect(() => () => {
    if (photoPreview?.startsWith("blob:")) URL.revokeObjectURL(photoPreview);
  }, [photoPreview]);

  const filteredPeople = useMemo(
    () => people.filter((person) => person.section === activeSection).sort((a, b) => a.sort_order - b.sort_order || a.full_name.localeCompare(b.full_name)),
    [activeSection, people],
  );

  function openCreate() {
    const nextOrder = Math.max(0, ...people.filter((person) => person.section === activeSection).map((person) => person.sort_order)) + 1;
    setEditing(null);
    setForm(emptyForm(activeSection, nextOrder));
    setPhotoFile(null);
    setPhotoPreview(null);
    setFormError("");
    setFormOpen(true);
  }

  function openEdit(person: PersonRecord) {
    setEditing(person);
    setForm({
      full_name: person.full_name,
      credentials: person.credentials ?? "",
      biography: person.biography ?? "",
      section: person.section,
      role_title: person.role_title ?? "",
      organization_name: person.organization_name ?? "",
      member_code: person.member_code ?? "",
      surveyor_specialty: person.surveyor_specialty ?? "",
      is_leadership: person.is_leadership,
      sort_order: person.sort_order,
      status: person.status,
      countries: person.countries.length ? person.countries.map((country) => ({ ...country })) : [],
    });
    setPhotoFile(null);
    setPhotoPreview(getPeoplePhotoUrl(person.photo_path));
    setFormError("");
    setFormOpen(true);
  }

  function closeForm() {
    if (saving) return;
    setFormOpen(false);
    setEditing(null);
    setPhotoFile(null);
    setPhotoPreview(null);
    setFormError("");
  }

  function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setFormError("");
    if (!file) return;
    if (!(["image/jpeg", "image/png", "image/webp"] as string[]).includes(file.type)) {
      setFormError("Profile photo must be a JPEG, PNG or WebP image.");
      event.target.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFormError("Profile photo must be smaller than 10 MB.");
      event.target.value = "";
      return;
    }
    if (photoPreview?.startsWith("blob:")) URL.revokeObjectURL(photoPreview);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function addCountry() {
    setForm((current) => ({ ...current, countries: [...current.countries, { country_code: "", country_name: "", sort_order: current.countries.length }] }));
  }

  function updateCountry(index: number, field: "country_code" | "country_name", value: string) {
    setForm((current) => ({
      ...current,
      countries: current.countries.map((country, countryIndex) => countryIndex === index ? { ...country, [field]: field === "country_code" ? value.toUpperCase().slice(0, 2) : value } : country),
    }));
  }

  function removeCountry(index: number) {
    setForm((current) => ({ ...current, countries: current.countries.filter((_, countryIndex) => countryIndex !== index) }));
  }

  async function removeStoredPhoto(path: string | null) {
    if (!path || path.startsWith("/") || /^https?:\/\//i.test(path)) return null;
    const { error } = await getSupabaseBrowserClient().storage.from("cms-images").remove([path]);
    return error;
  }

  async function normalizeSectionOrder(section: PeopleSection) {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("person_assignments")
      .select("id")
      .eq("section", section)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error || !data) return error;
    const results = await Promise.all(data.map((assignment, index) => supabase.from("person_assignments").update({ sort_order: index + 1 }).eq("id", assignment.id)));
    return results.find((result) => result.error)?.error ?? null;
  }

  async function submitPerson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setNotice("");

    if (!form.full_name.trim()) {
      setFormError("Full name is required.");
      return;
    }
    if (form.section === "surveyor" && !form.surveyor_specialty) {
      setFormError("Select a surveyor specialty.");
      return;
    }

    const countries = form.countries
      .filter((country) => country.country_code.trim() || country.country_name.trim())
      .map((country, index) => ({ country_code: country.country_code.trim().toUpperCase(), country_name: country.country_name.trim(), sort_order: index }));
    if (countries.some((country) => country.country_code.length !== 2 || !country.country_name)) {
      setFormError("Each country needs a name and a two-letter country code.");
      return;
    }
    if (form.section === "country_director" && countries.length === 0) {
      setFormError("Add at least one country for a Country Director.");
      return;
    }
    if (!can("people.publish") && form.status === "published") {
      setFormError("You do not have permission to publish a person.");
      return;
    }

    setSaving(true);
    const supabase = getSupabaseBrowserClient();
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id;
    if (!userId) {
      window.location.replace("/admin");
      return;
    }

    const personId = editing?.id ?? crypto.randomUUID();
    let nextPhotoPath = editing?.photo_path ?? null;
    let uploadedPath: string | null = null;

    if (photoFile) {
      uploadedPath = `people/${personId}/${Date.now()}-${safeFilename(photoFile.name)}`;
      const { error: uploadError } = await supabase.storage.from("cms-images").upload(uploadedPath, photoFile, { contentType: photoFile.type, upsert: false });
      if (uploadError) {
        setFormError(`Photo upload failed: ${uploadError.message}`);
        setSaving(false);
        return;
      }
      nextPhotoPath = uploadedPath;
    }

    const personValues = {
      full_name: form.full_name.trim(),
      credentials: optional(form.credentials),
      photo_path: nextPhotoPath,
      biography: optional(form.biography),
      status: form.status,
      updated_by: userId,
    };

    const personResult = editing
      ? await supabase.from("people").update(personValues).eq("id", personId)
      : await supabase.from("people").insert({ id: personId, ...personValues, created_by: userId });

    if (personResult.error) {
      if (uploadedPath) await removeStoredPhoto(uploadedPath);
      setFormError(`Person could not be saved: ${personResult.error.message}`);
      setSaving(false);
      return;
    }

    const assignmentValues = {
      section: form.section,
      role_title: optional(form.role_title),
      organization_name: optional(form.organization_name),
      member_code: optional(form.member_code),
      surveyor_specialty: form.section === "surveyor" ? form.surveyor_specialty || null : null,
      is_leadership: form.is_leadership,
      sort_order: Number.isFinite(form.sort_order) ? Math.max(1, form.sort_order) : 1,
      status: form.status,
      updated_by: userId,
    };

    const assignmentResult = editing
      ? await supabase.from("person_assignments").update(assignmentValues).eq("id", editing.assignmentId).select("id").single()
      : await supabase.from("person_assignments").insert({ person_id: personId, ...assignmentValues, created_by: userId }).select("id").single();

    if (assignmentResult.error || !assignmentResult.data) {
      if (uploadedPath) await removeStoredPhoto(uploadedPath);
      if (!editing) await supabase.from("people").update({ status: "archived", updated_by: userId }).eq("id", personId);
      setFormError(`Assignment could not be saved: ${assignmentResult.error?.message ?? "Unknown error"}`);
      setSaving(false);
      return;
    }

    const assignmentId = assignmentResult.data.id as string;
    if (editing) {
      const { error: countryDeleteError } = await supabase.from("person_assignment_countries").delete().eq("assignment_id", assignmentId);
      if (countryDeleteError) {
        setFormError(`Countries could not be updated: ${countryDeleteError.message}`);
        setSaving(false);
        return;
      }
    }

    if (countries.length) {
      const { error: countryError } = await supabase.from("person_assignment_countries").insert(countries.map((country) => ({ ...country, assignment_id: assignmentId })));
      if (countryError) {
        setFormError(`Countries could not be saved: ${countryError.message}`);
        setSaving(false);
        return;
      }
    }

    let photoCleanupFailed = false;
    if (uploadedPath && editing?.photo_path && editing.photo_path !== uploadedPath) {
      photoCleanupFailed = Boolean(await removeStoredPhoto(editing.photo_path));
    }

    await normalizeSectionOrder(form.section);
    if (editing && editing.section !== form.section) await normalizeSectionOrder(editing.section);

    await loadPeople();
    closeForm();
    setNotice(`${form.full_name.trim()} was ${editing ? "updated" : "added"} successfully.${photoCleanupFailed ? " The old photo could not be removed." : ""}`);
    setSaving(false);
  }

  async function confirmDelete() {
    if (!deleting || !can("people.delete")) return;
    setDeleteBusy(true);
    setNotice("");
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.from("people").delete().eq("id", deleting.id);
    if (error) {
      setLoadError(`Delete failed: ${error.message}`);
      setDeleteBusy(false);
      return;
    }
    const photoError = await removeStoredPhoto(deleting.photo_path);
    setPeople((current) => current.filter((person) => person.id !== deleting.id));
    setNotice(`${deleting.full_name} was deleted.${photoError ? " The profile photo could not be removed." : ""}`);
    setDeleting(null);
    setDeleteBusy(false);
  }

  async function movePerson(person: PersonRecord, direction: -1 | 1) {
    const currentIndex = filteredPeople.findIndex((item) => item.assignmentId === person.assignmentId);
    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= filteredPeople.length) return;

    const reordered = [...filteredPeople];
    [reordered[currentIndex], reordered[targetIndex]] = [reordered[targetIndex], reordered[currentIndex]];
    setReordering(true);
    setLoadError("");
    const supabase = getSupabaseBrowserClient();
    const results = await Promise.all(reordered.map((item, index) => supabase.from("person_assignments").update({ sort_order: index + 1 }).eq("id", item.assignmentId)));
    const failed = results.find((result) => result.error);
    if (failed?.error) {
      setLoadError(`Order could not be saved: ${failed.error.message}`);
      await loadPeople();
    } else {
      const orderById = new Map(reordered.map((item, index) => [item.assignmentId, index + 1]));
      setPeople((current) => current.map((item) => orderById.has(item.assignmentId) ? { ...item, sort_order: orderById.get(item.assignmentId)! } : item));
      setNotice("Display order updated.");
    }
    setReordering(false);
  }

  async function signOut() {
    await getSupabaseBrowserClient().auth.signOut();
    window.location.replace("/admin");
  }

  if (loading || !role) return <main className="admin-dashboard admin-people"><div className="admin-loading" role="status">Checking access and loading people…</div></main>;

  return <div className="admin-workspace"><AdminSidebar active="people" userLabel={userLabel} role={role} onSignOut={signOut} /><main className="admin-dashboard admin-people">
    <header className="admin-people__header">
      <div><Link className="admin-back" href="/admin"><ArrowLeft size={17} /> Administration</Link><p className="admin-kicker">AACI CONTENT MANAGEMENT</p><h1>People Management</h1><p>Manage public leadership, directors, advisory board members and surveyors.</p></div>
      {can("people.create") && <button className="button button-red admin-add-person" type="button" onClick={openCreate}><Plus size={18} /> Add person</button>}
    </header>

    <nav className="admin-people__tabs" aria-label="People sections">{PEOPLE_SECTIONS.map((section) => <button key={section.value} type="button" aria-current={activeSection === section.value ? "page" : undefined} onClick={() => setActiveSection(section.value)}>{section.label}<span>{people.filter((person) => person.section === section.value).length}</span></button>)}</nav>

    {notice && <div className="admin-notice" role="status">{notice}<button type="button" aria-label="Dismiss notification" onClick={() => setNotice("")}><X size={16} /></button></div>}
    {loadError && <div className="admin-error admin-people__error" role="alert">{loadError}<button type="button" onClick={loadPeople}>Try again</button></div>}

    <section className="admin-people__list" aria-live="polite">
      <div className="admin-people__list-header"><div><h2>{PEOPLE_SECTIONS.find((section) => section.value === activeSection)?.label}</h2><p>{filteredPeople.length} {filteredPeople.length === 1 ? "person" : "people"}</p></div><small>Use the arrow buttons to change the public display order.</small></div>
      {filteredPeople.length === 0 ? <div className="admin-people__empty"><UserRound size={34} strokeWidth={1.5} /><h3>No people in this section</h3><p>Add the first person to begin building this directory.</p>{can("people.create") && <button className="button button-red" type="button" onClick={openCreate}><Plus size={17} /> Add person</button>}</div> : <div className="admin-people__rows">{filteredPeople.map((person, index) => {
        const photoUrl = getPeoplePhotoUrl(person.photo_path);
        return <article className="admin-person-row" key={person.assignmentId}>
          <div className="admin-person-row__order"><button type="button" disabled={index === 0 || reordering} onClick={() => movePerson(person, -1)} aria-label={`Move ${person.full_name} up`}><ChevronUp size={17} /></button><span>{index + 1}</span><button type="button" disabled={index === filteredPeople.length - 1 || reordering} onClick={() => movePerson(person, 1)} aria-label={`Move ${person.full_name} down`}><ChevronDown size={17} /></button></div>
          <div className="admin-person-row__photo">{photoUrl ? <img src={photoUrl} alt="" /> : <span>{person.full_name.charAt(0)}</span>}</div>
          <div className="admin-person-row__identity"><h3>{person.full_name}{person.credentials ? `, ${person.credentials}` : ""}</h3><p>{person.role_title || "No role title"}</p><small>{person.countries.map((country) => country.country_name).join(", ") || person.organization_name || "No country or organization"}</small></div>
          <span className={`admin-status admin-status--${person.status}`}>{STATUS_LABELS[person.status]}</span>
          <div className="admin-person-row__actions">{can("people.update") && <button type="button" onClick={() => openEdit(person)}><Pencil size={16} /> Edit</button>}{can("people.delete") && <button className="admin-person-row__delete" type="button" onClick={() => setDeleting(person)}><Trash2 size={16} /> Delete</button>}</div>
        </article>;
      })}</div>}
    </section>

    {formOpen && <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeForm(); }}><section className="admin-person-form" role="dialog" aria-modal="true" aria-labelledby="person-form-title">
      <header><div><p className="admin-kicker">{editing ? "EDIT PERSON" : "ADD PERSON"}</p><h2 id="person-form-title">{editing ? editing.full_name : "Create a new profile"}</h2></div><button type="button" onClick={closeForm} aria-label="Close form"><X size={22} /></button></header>
      <form onSubmit={submitPerson}>
        <fieldset><legend>Profile</legend><div className="admin-form-grid">
          <label className="admin-field admin-field--wide">Full name <span>*</span><input value={form.full_name} onChange={(event) => setForm({ ...form, full_name: event.target.value })} required /></label>
          <label className="admin-field">Credentials<input value={form.credentials} onChange={(event) => setForm({ ...form, credentials: event.target.value })} placeholder="MD, PhD" /></label>
          <label className="admin-field">Member code<input value={form.member_code} onChange={(event) => setForm({ ...form, member_code: event.target.value })} placeholder="AACI A 01 2020" /></label>
          <label className="admin-field admin-field--wide">Biography<textarea value={form.biography} onChange={(event) => setForm({ ...form, biography: event.target.value })} rows={4} /></label>
          <label className="admin-photo-field admin-field--wide"><span>Profile photo</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhoto} />
            <span className="admin-photo-picker">{photoPreview ? <img src={photoPreview} alt="Profile preview" /> : <ImagePlus size={25} />}<span><strong>{photoFile ? photoFile.name : "Choose an image"}</strong><small>JPEG, PNG or WebP · maximum 10 MB</small></span></span>
          </label>
        </div></fieldset>

        <fieldset><legend>Assignment</legend><div className="admin-form-grid">
          <label className="admin-field">Section <span>*</span><select value={form.section} onChange={(event) => { const section = event.target.value as PeopleSection; setForm({ ...form, section, surveyor_specialty: section === "surveyor" ? form.surveyor_specialty || "clinical" : "" }); }}>{PEOPLE_SECTIONS.map((section) => <option key={section.value} value={section.value}>{section.label}</option>)}</select></label>
          <label className="admin-field">Role title<input value={form.role_title} onChange={(event) => setForm({ ...form, role_title: event.target.value })} /></label>
          <label className="admin-field">Organization<input value={form.organization_name} onChange={(event) => setForm({ ...form, organization_name: event.target.value })} /></label>
          {form.section === "surveyor" && <label className="admin-field">Surveyor specialty <span>*</span><select value={form.surveyor_specialty} onChange={(event) => setForm({ ...form, surveyor_specialty: event.target.value as SurveyorSpecialty })}>{Object.entries(SPECIALTY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>}
          <label className="admin-field">Sort order<input type="number" min={1} value={form.sort_order} onChange={(event) => setForm({ ...form, sort_order: Math.max(1, Number(event.target.value)) })} /><small>The section is automatically renumbered from 1 after saving.</small></label>
          <label className="admin-field">Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as PeopleStatus })}><option value="draft">Draft</option><option value="published" disabled={!can("people.publish")}>Published</option><option value="archived">Archived</option></select>{!can("people.publish") && <small>A role with Publish permission must publish profiles.</small>}</label>
          <label className="admin-checkbox admin-field--wide"><input type="checkbox" checked={form.is_leadership} onChange={(event) => setForm({ ...form, is_leadership: event.target.checked })} /><span><strong>Leadership profile</strong><small>Feature this person in the leadership group when the page supports it.</small></span></label>
        </div></fieldset>

        <fieldset><legend>Countries</legend><p className="admin-field-help">Country Directors require at least one country. Regional Advisory Board members can have several.</p>
          <div className="admin-country-list">{form.countries.map((country, index) => <div className="admin-country-row" key={`${country.id ?? "new"}-${index}`}>
            <label className="admin-field">Country name<input value={country.country_name} onChange={(event) => updateCountry(index, "country_name", event.target.value)} placeholder="Thailand" /></label>
            <label className="admin-field admin-country-code">Code<input value={country.country_code} onChange={(event) => updateCountry(index, "country_code", event.target.value)} placeholder="TH" maxLength={2} /></label>
            <button type="button" onClick={() => removeCountry(index)} aria-label={`Remove country ${index + 1}`}><Trash2 size={17} /></button>
          </div>)}</div>
          <button className="admin-add-country" type="button" onClick={addCountry}><Plus size={16} /> Add country</button>
        </fieldset>

        {formError && <p className="admin-error" role="alert">{formError}</p>}
        <footer><button type="button" className="admin-cancel" onClick={closeForm} disabled={saving}>Cancel</button><button type="submit" className="button button-red" disabled={saving}>{saving ? "Saving…" : editing ? "Save changes" : "Add person"}</button></footer>
      </form>
    </section></div>}

    {deleting && <div className="admin-modal-backdrop"><section className="admin-confirm" role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description"><div className="admin-confirm__icon"><Trash2 size={23} /></div><h2 id="delete-title">Delete {deleting.full_name}?</h2><p id="delete-description">This permanently removes the profile, every assignment, associated countries and its uploaded photo. This action cannot be undone.</p><div><button type="button" className="admin-cancel" onClick={() => setDeleting(null)} disabled={deleteBusy}>Cancel</button><button type="button" className="admin-delete-confirm" onClick={confirmDelete} disabled={deleteBusy}>{deleteBusy ? "Deleting…" : "Delete person"}</button></div></section></div>}
  </main></div>;
}
