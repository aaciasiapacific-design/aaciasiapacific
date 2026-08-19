"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, ChevronDown, ChevronUp, Eye, ImagePlus, Newspaper, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { getSupabaseBrowserClient } from "../../../lib/supabase/client";
import { useAdminPermissions } from "../../../lib/admin-access";
import { AdminRole, formatNewsDate, getNewsImageUrl, NEWS_STATUS_LABELS, NewsContentImage, NewsRecord, NewsStatus, slugifyNewsTitle } from "../../../lib/news";
import AdminSidebar from "../AdminSidebar";

type NewsFilter = "all" | NewsStatus;
type FormState = {
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  author_name: string;
  status: NewsStatus;
  published_at: string;
};

type ContentImageDraft = NewsContentImage & { file?: File; preview: string };

const NEWS_SELECT = "id, slug, title, category, summary, content, cover_image_path, content_images, author_name, status, published_at, created_at, updated_at";
const FILTERS: Array<{ value: NewsFilter; label: string }> = [
  { value: "all", label: "All news" },
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

const emptyForm = (): FormState => ({ title: "", slug: "", category: "AACI Insights", summary: "", content: "", author_name: "", status: "draft", published_at: "" });

function optional(value: string) {
  return value.trim() || null;
}

function safeFilename(filename: string) {
  return filename.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "") || "cover-image";
}

function toDateTimeLocal(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
}

export default function AdminNewsPage() {
  const { can } = useAdminPermissions();
  const [role, setRole] = useState<AdminRole | null>(null);
  const [userLabel, setUserLabel] = useState("Administrator");
  const [articles, setArticles] = useState<NewsRecord[]>([]);
  const [filter, setFilter] = useState<NewsFilter>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<NewsRecord | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [slugTouched, setSlugTouched] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [contentImages, setContentImages] = useState<ContentImageDraft[]>([]);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<NewsRecord | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  async function loadNews() {
    setLoadError("");
    const { data, error } = await getSupabaseBrowserClient().from("news").select(NEWS_SELECT).order("published_at", { ascending: false }).order("created_at", { ascending: false });
    if (error) {
      setLoadError("We could not load the news library. Please refresh and try again.");
      setArticles([]);
      return;
    }
    setArticles((data ?? []) as NewsRecord[]);
  }

  useEffect(() => {
    let active = true;
    async function checkAccess() {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      if (!data.user) { window.location.replace("/admin"); return; }
      const { data: profile } = await supabase.from("admin_profiles").select("email, display_name, role").eq("id", data.user.id).eq("is_active", true).maybeSingle();
      if (!active) return;
      if (!profile) { await supabase.auth.signOut(); window.location.replace("/admin"); return; }
      setRole(profile.role as AdminRole);
      setUserLabel(profile.display_name ?? profile.email);
      await loadNews();
      if (active) setLoading(false);
    }
    checkAccess();
    return () => { active = false; };
  }, []);

  useEffect(() => () => {
    if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
  }, [coverPreview]);

  const filteredArticles = useMemo(() => {
    const term = search.trim().toLowerCase();
    return articles.filter((article) => (filter === "all" || article.status === filter) && (!term || `${article.title} ${article.category} ${article.author_name ?? ""}`.toLowerCase().includes(term)));
  }, [articles, filter, search]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm());
    setSlugTouched(false);
    setCoverFile(null);
    setCoverPreview(null);
    setContentImages([]);
    setFormError("");
    setFormOpen(true);
  }

  function openEdit(article: NewsRecord) {
    setEditing(article);
    setForm({
      title: article.title,
      slug: article.slug,
      category: article.category,
      summary: article.summary,
      content: article.content,
      author_name: article.author_name ?? "",
      status: article.status,
      published_at: toDateTimeLocal(article.published_at),
    });
    setSlugTouched(true);
    setCoverFile(null);
    setCoverPreview(getNewsImageUrl(article.cover_image_path));
    setContentImages((Array.isArray(article.content_images) ? article.content_images : []).map((item) => ({ ...item, preview: getNewsImageUrl(item.path) ?? "" })));
    setFormError("");
    setFormOpen(true);
  }

  function closeForm() {
    if (saving) return;
    setFormOpen(false);
    setEditing(null);
    setCoverFile(null);
    setCoverPreview(null);
    setContentImages([]);
    setFormError("");
  }

  function updateTitle(value: string) {
    setForm((current) => ({ ...current, title: value, slug: slugTouched ? current.slug : slugifyNewsTitle(value) }));
  }

  function handleCover(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setFormError("");
    if (!file) return;
    if (!(["image/jpeg", "image/png", "image/webp"] as string[]).includes(file.type)) {
      setFormError("Cover image must be a JPEG, PNG or WebP image.");
      event.target.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFormError("Cover image must be smaller than 10 MB.");
      event.target.value = "";
      return;
    }
    if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  function handleContentImages(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    setFormError("");
    const invalidType = files.find((file) => !(["image/jpeg", "image/png", "image/webp"] as string[]).includes(file.type));
    if (invalidType) { setFormError(`${invalidType.name} must be a JPEG, PNG or WebP image.`); event.target.value = ""; return; }
    const oversized = files.find((file) => file.size > 10 * 1024 * 1024);
    if (oversized) { setFormError(`${oversized.name} must be smaller than 10 MB.`); event.target.value = ""; return; }
    const paragraphCount = Math.max(1, form.content.split(/\n\s*\n/).filter(Boolean).length);
    setContentImages((current) => [...current, ...files.map((file, index) => ({ path: "", alt_text: form.title.trim() || file.name.replace(/\.[^.]+$/, ""), caption: "", after_paragraph: Math.min(paragraphCount, current.length + index + 1), file, preview: URL.createObjectURL(file) }))]);
    event.target.value = "";
  }

  function updateContentImage(index: number, values: Partial<ContentImageDraft>) {
    setContentImages((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...values } : item));
  }

  function removeContentImage(index: number) {
    setContentImages((current) => {
      const target = current[index];
      if (target?.preview.startsWith("blob:")) URL.revokeObjectURL(target.preview);
      return current.filter((_, itemIndex) => itemIndex !== index);
    });
  }

  function moveContentImage(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= contentImages.length) return;
    setContentImages((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function removeStoredCover(path: string | null) {
    if (!path || path.startsWith("/") || /^https?:\/\//i.test(path)) return null;
    const { error } = await getSupabaseBrowserClient().storage.from("cms-images").remove([path]);
    return error;
  }

  async function submitNews(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setNotice("");
    const slug = slugifyNewsTitle(form.slug);
    if (!form.title.trim()) { setFormError("Title is required."); return; }
    if (!slug) { setFormError("Add a valid URL slug using English letters and numbers."); return; }
    if (!form.category.trim()) { setFormError("Category is required."); return; }
    if (!form.summary.trim()) { setFormError("Summary is required."); return; }
    if (!form.content.trim()) { setFormError("Article content is required."); return; }
    if (form.status === "published" && !can("news.publish")) { setFormError("You do not have permission to publish an article. Save it as Draft for review."); return; }

    setSaving(true);
    const supabase = getSupabaseBrowserClient();
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id;
    if (!userId) { window.location.replace("/admin"); return; }

    const articleId = editing?.id ?? crypto.randomUUID();
    let nextCoverPath = editing?.cover_image_path ?? null;
    let uploadedPath: string | null = null;
    const uploadedContentPaths: string[] = [];
    if (coverFile) {
      uploadedPath = `news/${articleId}/${Date.now()}-${safeFilename(coverFile.name)}`;
      const { error: uploadError } = await supabase.storage.from("cms-images").upload(uploadedPath, coverFile, { contentType: coverFile.type, upsert: false });
      if (uploadError) { setFormError(`Cover upload failed: ${uploadError.message}`); setSaving(false); return; }
      nextCoverPath = uploadedPath;
    }

    const savedContentImages: NewsContentImage[] = [];
    for (let index = 0; index < contentImages.length; index += 1) {
      const item = contentImages[index];
      let path = item.path;
      if (item.file) {
        path = `news/${articleId}/content/${Date.now()}-${index}-${safeFilename(item.file.name)}`;
        const { error: supportingUploadError } = await supabase.storage.from("cms-images").upload(path, item.file, { contentType: item.file.type, upsert: false });
        if (supportingUploadError) {
          if (uploadedPath) await removeStoredCover(uploadedPath);
          for (const uploadedContentPath of uploadedContentPaths) await removeStoredCover(uploadedContentPath);
          setFormError(`Supporting image upload failed: ${supportingUploadError.message}`);
          setSaving(false);
          return;
        }
        uploadedContentPaths.push(path);
      }
      savedContentImages.push({ path, alt_text: item.alt_text.trim() || form.title.trim(), caption: item.caption.trim(), after_paragraph: Math.max(1, Number(item.after_paragraph) || 1) });
    }

    const publishedAt = form.status === "published" ? (form.published_at ? new Date(form.published_at).toISOString() : editing?.published_at ?? new Date().toISOString()) : null;
    const values = {
      slug,
      title: form.title.trim(),
      category: form.category.trim(),
      summary: form.summary.trim(),
      content: form.content.trim(),
      cover_image_path: nextCoverPath,
      content_images: savedContentImages,
      author_name: optional(form.author_name),
      status: form.status,
      published_at: publishedAt,
      updated_by: userId,
    };
    const result = editing
      ? await supabase.from("news").update(values).eq("id", articleId)
      : await supabase.from("news").insert({ id: articleId, ...values, created_by: userId });

    if (result.error) {
      if (uploadedPath) await removeStoredCover(uploadedPath);
      for (const uploadedContentPath of uploadedContentPaths) await removeStoredCover(uploadedContentPath);
      const message = result.error.code === "23505" ? "This URL slug is already in use. Choose a different slug." : result.error.message;
      setFormError(`Article could not be saved: ${message}`);
      setSaving(false);
      return;
    }

    let cleanupFailed = false;
    if (can("news.delete") && uploadedPath && editing?.cover_image_path && editing.cover_image_path !== uploadedPath) cleanupFailed = Boolean(await removeStoredCover(editing.cover_image_path));
    if (can("news.delete") && editing) {
      const retainedPaths = new Set(savedContentImages.map((item) => item.path));
      const removedPaths = (Array.isArray(editing.content_images) ? editing.content_images : []).map((item) => item.path).filter((path) => !retainedPaths.has(path));
      for (const removedPath of removedPaths) cleanupFailed = Boolean(await removeStoredCover(removedPath)) || cleanupFailed;
    }
    await loadNews();
    closeForm();
    setNotice(`${form.title.trim()} was ${editing ? "updated" : "created"} successfully.${cleanupFailed ? " The previous cover image could not be removed." : ""}`);
    setSaving(false);
  }

  async function confirmDelete() {
    if (!deleting || !can("news.delete")) return;
    setDeleteBusy(true);
    setNotice("");
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.from("news").delete().eq("id", deleting.id);
    if (error) { setLoadError(`Delete failed: ${error.message}`); setDeleteBusy(false); return; }
    let coverError = await removeStoredCover(deleting.cover_image_path);
    for (const item of (Array.isArray(deleting.content_images) ? deleting.content_images : [])) coverError = (await removeStoredCover(item.path)) || coverError;
    setArticles((current) => current.filter((article) => article.id !== deleting.id));
    setNotice(`${deleting.title} was deleted.${coverError ? " The cover image could not be removed." : ""}`);
    setDeleting(null);
    setDeleteBusy(false);
  }

  async function signOut() {
    await getSupabaseBrowserClient().auth.signOut();
    window.location.replace("/admin");
  }

  if (loading || !role) return <main className="admin-dashboard admin-people"><div className="admin-loading" role="status">Checking access and loading news…</div></main>;

  return <div className="admin-workspace"><AdminSidebar active="news" userLabel={userLabel} role={role} onSignOut={signOut} /><main className="admin-dashboard admin-people admin-news">
    <header className="admin-people__header"><div><Link className="admin-back" href="/admin"><ArrowLeft size={17} /> Administration</Link><p className="admin-kicker">AACI CONTENT MANAGEMENT</p><h1>News Management</h1><p>Create, review and publish AACI news and insights.</p></div>{can("news.create") && <button className="button button-red admin-add-person" type="button" onClick={openCreate}><Plus size={18} /> Add article</button>}</header>

    <div className="admin-news__controls"><nav className="admin-people__tabs" aria-label="News status filters">{FILTERS.map((item) => <button key={item.value} type="button" aria-current={filter === item.value ? "page" : undefined} onClick={() => setFilter(item.value)}>{item.label}<span>{item.value === "all" ? articles.length : articles.filter((article) => article.status === item.value).length}</span></button>)}</nav><label className="admin-news__search"><Search size={17} /><span className="sr-only">Search news</span><input type="search" placeholder="Search news" value={search} onChange={(event) => setSearch(event.target.value)} /></label></div>
    {notice && <div className="admin-notice" role="status">{notice}<button type="button" aria-label="Dismiss notification" onClick={() => setNotice("")}><X size={16} /></button></div>}
    {loadError && <div className="admin-error admin-people__error" role="alert">{loadError}<button type="button" onClick={loadNews}>Try again</button></div>}

    <section className="admin-people__list" aria-live="polite"><div className="admin-people__list-header"><div><h2>{FILTERS.find((item) => item.value === filter)?.label}</h2><p>{filteredArticles.length} {filteredArticles.length === 1 ? "article" : "articles"}</p></div><small>Only published articles appear on the public website.</small></div>
      {filteredArticles.length === 0 ? <div className="admin-people__empty"><Newspaper size={34} strokeWidth={1.5} /><h3>No articles found</h3><p>{search ? "Try a different search term or status filter." : "Create the first article for this section."}</p>{can("news.create") && <button className="button button-red" type="button" onClick={openCreate}><Plus size={17} /> Add article</button>}</div> : <div className="admin-news__rows">{filteredArticles.map((article) => {
        const image = getNewsImageUrl(article.cover_image_path);
        return <article className="admin-news-row" key={article.id}><div className="admin-news-row__image">{image ? <img src={image} alt="" /> : <Newspaper size={24} strokeWidth={1.5} />}</div><div className="admin-news-row__identity"><p>{article.category}</p><h3>{article.title}</h3><small>{article.author_name || "AACI Asia Pacific"} · {article.status === "published" ? formatNewsDate(article.published_at) : `Updated ${formatNewsDate(article.updated_at)}`}</small></div><span className={`admin-status admin-status--${article.status}`}>{NEWS_STATUS_LABELS[article.status]}</span><div className="admin-person-row__actions">{article.status === "published" && <Link href={`/news/${article.slug}`} target="_blank" aria-label={`View ${article.title}`}><Eye size={16} /> View</Link>}{can("news.update") && <button type="button" onClick={() => openEdit(article)}><Pencil size={16} /> Edit</button>}{can("news.delete") && <button className="admin-person-row__delete" type="button" onClick={() => setDeleting(article)}><Trash2 size={16} /> Delete</button>}</div></article>;
      })}</div>}
    </section>

    {formOpen && <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeForm(); }}><section className="admin-person-form admin-news-form" role="dialog" aria-modal="true" aria-labelledby="news-form-title"><header><div><p className="admin-kicker">{editing ? "EDIT ARTICLE" : "ADD ARTICLE"}</p><h2 id="news-form-title">{editing ? editing.title : "Create a news article"}</h2></div><button type="button" onClick={closeForm} aria-label="Close form"><X size={22} /></button></header><form onSubmit={submitNews}>
      <fieldset><legend>Article details</legend><div className="admin-form-grid">
        <label className="admin-field admin-field--wide">Title <span>*</span><input value={form.title} onChange={(event) => updateTitle(event.target.value)} required /></label>
        <label className="admin-field">URL slug <span>*</span><input value={form.slug} onChange={(event) => { setSlugTouched(true); setForm({ ...form, slug: event.target.value }); }} placeholder="quality-improvement-update" required /><small>Used in the public article URL.</small></label>
        <label className="admin-field">Category <span>*</span><input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="AACI Insights" required /></label>
        <label className="admin-field admin-field--wide">Summary <span>*</span><textarea value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} rows={3} required /><small>Shown on news cards and search previews.</small></label>
        <label className="admin-field admin-field--wide">Article content <span>*</span><textarea className="admin-news-form__content" value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} rows={12} required /><small>Separate paragraphs with a blank line.</small></label>
        <label className="admin-field">Author name<input value={form.author_name} onChange={(event) => setForm({ ...form, author_name: event.target.value })} placeholder="AACI Asia Pacific" /></label>
        <label className="admin-photo-field"><span>Cover image</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleCover} /><span className="admin-photo-picker admin-news-photo-picker">{coverPreview ? <img src={coverPreview} alt="Cover preview" /> : <ImagePlus size={25} />}<span><strong>{coverFile ? coverFile.name : "Choose an image"}</strong><small>JPEG, PNG or WebP · maximum 10 MB</small></span></span></label>
      </div></fieldset>
      <fieldset><legend>Article gallery</legend><p className="admin-field-help">Add multiple images to the gallery. Use the arrow buttons to control their display order.</p>
        <label className="admin-news-supporting-upload"><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleContentImages} /><ImagePlus size={19} /><span>Add gallery images</span></label>
        {contentImages.length > 0 && <div className="admin-news-supporting-list">{contentImages.map((item, index) => <article className="admin-news-supporting-item" key={`${item.path || item.preview}-${index}`}>
          <img src={item.preview} alt="" />
          <div className="admin-news-supporting-fields"><label className="admin-field">Alt text<input value={item.alt_text} onChange={(event) => updateContentImage(index, { alt_text: event.target.value })} placeholder="Describe the image" /></label><label className="admin-field">Caption<input value={item.caption} onChange={(event) => updateContentImage(index, { caption: event.target.value })} placeholder="Optional image caption" /></label></div>
          <div className="admin-news-supporting-actions"><button type="button" aria-label={`Move supporting image ${index + 1} up`} disabled={index === 0} onClick={() => moveContentImage(index, -1)}><ChevronUp size={17} /></button><button type="button" aria-label={`Move supporting image ${index + 1} down`} disabled={index === contentImages.length - 1} onClick={() => moveContentImage(index, 1)}><ChevronDown size={17} /></button><button className="admin-news-supporting-remove" type="button" aria-label={`Remove supporting image ${index + 1}`} onClick={() => removeContentImage(index)}><Trash2 size={17} /></button></div>
        </article>)}</div>}
      </fieldset>
      <fieldset><legend>Publishing</legend><div className="admin-form-grid"><label className="admin-field">Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as NewsStatus })}><option value="draft">Draft</option><option value="published" disabled={!can("news.publish")}>Published</option><option value="archived">Archived</option></select>{!can("news.publish") && <small>A role with Publish permission must publish articles.</small>}</label><label className="admin-field">Publish date<div className="admin-news-date"><CalendarDays size={16} /><input type="datetime-local" value={form.published_at} onChange={(event) => setForm({ ...form, published_at: event.target.value })} /></div><small>Leave empty to use the current date when publishing.</small></label></div></fieldset>
      {formError && <p className="admin-error" role="alert">{formError}</p>}<footer><button type="button" className="admin-cancel" onClick={closeForm} disabled={saving}>Cancel</button><button type="submit" className="button button-red" disabled={saving}>{saving ? "Saving…" : editing ? "Save changes" : "Add article"}</button></footer>
    </form></section></div>}

    {deleting && <div className="admin-modal-backdrop"><section className="admin-confirm" role="alertdialog" aria-modal="true" aria-labelledby="delete-news-title" aria-describedby="delete-news-description"><div className="admin-confirm__icon"><Trash2 size={23} /></div><h2 id="delete-news-title">Delete “{deleting.title}”?</h2><p id="delete-news-description">This permanently removes the article and its cover image. This action cannot be undone.</p><div><button type="button" className="admin-cancel" onClick={() => setDeleting(null)} disabled={deleteBusy}>Cancel</button><button type="button" className="admin-delete-confirm" onClick={confirmDelete} disabled={deleteBusy}>{deleteBusy ? "Deleting…" : "Delete article"}</button></div></section></div>}
  </main></div>;
}
