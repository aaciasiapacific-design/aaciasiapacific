export const PEOPLE_SECTIONS = [
  { value: "asia_office", label: "Asia Office" },
  { value: "country_director", label: "Country Directors" },
  { value: "regional_advisory_board", label: "Regional Advisory Board" },
  { value: "surveyor", label: "AACI Surveyors" },
] as const;

export type PeopleSection = (typeof PEOPLE_SECTIONS)[number]["value"];
export type PeopleStatus = "draft" | "published" | "archived";
export type SurveyorSpecialty = "clinical" | "governance" | "pe_specialist";
export type AdminRole = string;

export type PersonCountry = {
  id?: string;
  country_code: string;
  country_name: string;
  sort_order: number;
};

export type PersonRecord = {
  id: string;
  assignmentId: string;
  full_name: string;
  credentials: string | null;
  photo_path: string | null;
  biography: string | null;
  section: PeopleSection;
  role_title: string | null;
  organization_name: string | null;
  member_code: string | null;
  surveyor_specialty: SurveyorSpecialty | null;
  is_leadership: boolean;
  sort_order: number;
  status: PeopleStatus;
  countries: PersonCountry[];
};

export const STATUS_LABELS: Record<PeopleStatus, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

export const SPECIALTY_LABELS: Record<SurveyorSpecialty, string> = {
  clinical: "Clinical",
  governance: "Governance",
  pe_specialist: "PE Specialist",
};

export function sectionLabel(section: PeopleSection) {
  return PEOPLE_SECTIONS.find((item) => item.value === section)?.label ?? section;
}

export function getPeoplePhotoUrl(photoPath: string | null) {
  if (!photoPath) return null;
  if (photoPath.startsWith("/") || /^https?:\/\//i.test(photoPath)) return photoPath;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  return `${url}/storage/v1/object/public/cms-images/${photoPath.split("/").map(encodeURIComponent).join("/")}`;
}
