export type NewsStatus = "draft" | "published" | "archived";
export type AdminRole = string;

export type NewsContentImage = {
  path: string;
  alt_text: string;
  caption: string;
  after_paragraph: number;
};

export type NewsRecord = {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  cover_image_path: string | null;
  content_images: NewsContentImage[];
  author_name: string | null;
  status: NewsStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export const NEWS_STATUS_LABELS: Record<NewsStatus, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

export function getNewsImageUrl(path: string | null) {
  if (!path) return null;
  if (path.startsWith("/") || /^https?:\/\//i.test(path)) return path;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  return `${url}/storage/v1/object/public/cms-images/${path.split("/").map(encodeURIComponent).join("/")}`;
}

export function slugifyNewsTitle(value: string) {
  return value.toLowerCase().trim().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function newsDateParts(value: string | null) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return { day: "—", month: "" };
  return {
    day: new Intl.DateTimeFormat("en-GB", { day: "2-digit", timeZone: "Asia/Bangkok" }).format(date),
    month: new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "Asia/Bangkok" }).format(date).toUpperCase(),
  };
}

export function formatNewsDate(value: string | null) {
  if (!value) return "Not published";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Bangkok" }).format(new Date(value));
}
