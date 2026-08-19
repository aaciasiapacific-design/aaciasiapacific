export type EventStatus = "draft" | "published" | "archived";
export type EventMode = "online" | "onsite" | "hybrid";

export type EventRecord = {
  id: string; slug: string; title: string; summary: string; description: string;
  cover_image_path: string | null; starts_at: string; ends_at: string | null;
  timezone: string; is_all_day: boolean; mode: EventMode; location: string | null;
  registration_url: string | null; status: EventStatus; published_at: string | null;
  created_at: string; updated_at: string;
};

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = { draft: "Draft", published: "Published", archived: "Archived" };
export const EVENT_MODE_LABELS: Record<EventMode, string> = { online: "Online", onsite: "On-site", hybrid: "Hybrid" };

export function getEventImageUrl(path: string | null) {
  if (!path) return null;
  if (path.startsWith("/") || /^https?:\/\//i.test(path)) return path;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return url ? `${url}/storage/v1/object/public/cms-images/${path.split("/").map(encodeURIComponent).join("/")}` : null;
}

export function slugifyEventTitle(value: string) {
  return value.toLowerCase().trim().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function formatEventDate(value: string, timezone = "Asia/Bangkok") {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: timezone, timeZoneName: "short" }).format(new Date(value));
}

export function formatEventSchedule(event: Pick<EventRecord, "starts_at" | "ends_at" | "timezone" | "is_all_day">) {
  if (!event.is_all_day) return formatEventDate(event.starts_at, event.timezone);
  const format = (value: string, includeYear = true) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", ...(includeYear ? { year: "numeric" as const } : {}), timeZone: event.timezone }).format(new Date(value));
  if (!event.ends_at) return format(event.starts_at);
  const start = new Date(event.starts_at); const end = new Date(event.ends_at);
  const sameYear = new Intl.DateTimeFormat("en", { year: "numeric", timeZone: event.timezone }).format(start) === new Intl.DateTimeFormat("en", { year: "numeric", timeZone: event.timezone }).format(end);
  const sameMonth = sameYear && new Intl.DateTimeFormat("en", { month: "numeric", timeZone: event.timezone }).format(start) === new Intl.DateTimeFormat("en", { month: "numeric", timeZone: event.timezone }).format(end);
  if (sameMonth) return `${new Intl.DateTimeFormat("en-GB", { day: "numeric", timeZone: event.timezone }).format(start)}–${format(event.ends_at)}`;
  return `${format(event.starts_at, !sameYear)} – ${format(event.ends_at)}`;
}

export function eventDateParts(value: string, timezone = "Asia/Bangkok") {
  const date = new Date(value);
  return {
    day: new Intl.DateTimeFormat("en-GB", { day: "2-digit", timeZone: timezone }).format(date),
    month: new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: timezone }).format(date).toUpperCase(),
  };
}
