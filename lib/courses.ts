export type CourseStatus = "draft" | "published" | "archived";
export type RegistrationStatus = "open" | "closed" | "sold_out" | "cancelled";

export type CourseSessionRecord = {
  id: string; course_id: string; starts_at: string; ends_at: string | null;
  timezone: string; capacity: number | null; registration_deadline: string | null;
  registration_url: string | null; registration_status: RegistrationStatus;
  status: CourseStatus; sort_order: number; created_at: string; updated_at: string;
};

export type CourseRecord = {
  id: string; slug: string; title: string; category: string | null; summary: string;
  description: string; cover_image_path: string | null; duration_text: string | null;
  format_text: string | null; fee_amount: number | null; fee_currency: string;
  registration_url: string | null; status: CourseStatus; published_at: string | null;
  sort_order: number; is_featured: boolean; accent_color: string; topics: string[];
  early_bird_deadline: string | null; early_bird_discount_percent: number | null;
  created_at: string; updated_at: string; course_sessions?: CourseSessionRecord[];
};

export const COURSE_STATUS_LABELS: Record<CourseStatus, string> = {
  draft: "Draft", published: "Published", archived: "Archived",
};
export const REGISTRATION_STATUS_LABELS: Record<RegistrationStatus, string> = {
  open: "Open", closed: "Closed", sold_out: "Sold out", cancelled: "Cancelled",
};

export function getCourseImageUrl(path: string | null) {
  if (!path) return null;
  if (path.startsWith("/") || /^https?:\/\//i.test(path)) return path;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return url ? `${url}/storage/v1/object/public/cms-images/${path.split("/").map(encodeURIComponent).join("/")}` : null;
}

export function slugifyCourseTitle(value: string) {
  return value.toLowerCase().trim().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function formatCourseFee(amount: number | null, currency: string) {
  if (amount === null) return "Contact us";
  return `${currency.toUpperCase()} ${new Intl.NumberFormat("en-US", { maximumFractionDigits: amount % 1 ? 2 : 0 }).format(amount)}`;
}

export function formatSessionDate(value: string, timezone = "Asia/Bangkok") {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: timezone }).format(new Date(value));
}
