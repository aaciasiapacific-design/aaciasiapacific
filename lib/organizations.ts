export type OrganizationStatus = "draft" | "published" | "archived";
export type AccreditationStatus = "active" | "suspended" | "expired" | "withdrawn";

export type AccreditedOrganizationRecord = {
  id: string;
  slug: string;
  organization_name: string;
  country_code: string;
  country_name: string;
  city: string | null;
  address: string | null;
  organization_type: string | null;
  programme: string;
  certificate_number: string | null;
  accreditation_scope: string | null;
  summary: string;
  issued_at: string | null;
  expires_at: string | null;
  accreditation_status: AccreditationStatus;
  logo_path: string | null;
  website_url: string | null;
  status: OrganizationStatus;
  published_at: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export const ORGANIZATION_STATUS_LABELS: Record<OrganizationStatus, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

export const ACCREDITATION_STATUS_LABELS: Record<AccreditationStatus, string> = {
  active: "Active",
  suspended: "Suspended",
  expired: "Expired",
  withdrawn: "Withdrawn",
};

export function getOrganizationLogoUrl(path: string | null) {
  if (!path) return null;
  if (path.startsWith("/") || /^https?:\/\//i.test(path)) return path;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return url ? `${url}/storage/v1/object/public/cms-images/${path.split("/").map(encodeURIComponent).join("/")}` : null;
}

export function slugifyOrganization(value: string) {
  return value.toLowerCase().trim().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function formatOrganizationDate(value: string | null) {
  if (!value) return "Not specified";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}
