"use client";

import { useEffect, useMemo, useState } from "react";
import { Award, Building2, ChevronDown, ChevronRight, Globe2, Grid2X2, List, MapPin, RefreshCw, Search, ShieldCheck } from "lucide-react";
import { getSupabaseBrowserClient } from "../../lib/supabase/client";
import { AccreditedOrganizationRecord, getOrganizationLogoUrl } from "../../lib/organizations";

const ORGANIZATION_SELECT = "id, slug, organization_name, country_code, country_name, city, address, organization_type, programme, certificate_number, accreditation_scope, summary, issued_at, expires_at, accreditation_status, logo_path, website_url, status, published_at, sort_order, created_at, updated_at";
const COUNTRY_ORDER = ["TH", "VN", "KH", "MM", "TW", "LA"];

function getProgrammes(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function OrganizationLogo({ organization }: { organization: AccreditedOrganizationRecord }) {
  const logo = getOrganizationLogoUrl(organization.logo_path);
  const initials = organization.organization_name.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
  return <div className={`directory-logo${logo ? " directory-logo--image" : ""}`}>
    {logo ? <img src={logo} alt={`${organization.organization_name} logo`} /> : <><Building2 size={28} strokeWidth={1.55} /><strong>{initials}</strong></>}
  </div>;
}

function AccreditationBadge({ programme }: { programme: string }) {
  const normalizedProgramme = programme.toLowerCase();
  const isSilverCec = normalizedProgramme.startsWith("cec") && (normalizedProgramme.includes("endoscopy") || normalizedProgramme.includes("oncology"));
  const kind = isSilverCec ? "silver" : normalizedProgramme.startsWith("cec") ? "cec" : normalizedProgramme.startsWith("iso") ? "iso" : normalizedProgramme.startsWith("dental") ? "dental" : "aaci";
  return <span className={`directory-badge directory-badge--${kind}`}>{programme}</span>;
}

function OrganizationListItem({ organization, view }: { organization: AccreditedOrganizationRecord; view: "list" | "grid" }) {
  const programmes = getProgrammes(organization.programme);
  return <article className={`directory-item directory-item--${view}`}>
    <OrganizationLogo organization={organization} />
    <div className="directory-item__identity">
      <h3>{organization.organization_name}</h3>
      <p><MapPin size={15} strokeWidth={1.8} /><span>{organization.city ? `${organization.city}, ` : ""}{organization.country_name}</span><i aria-hidden="true" /><span>{organization.organization_type || "Healthcare Organization"}</span></p>
    </div>
    <div className="directory-item__programmes" aria-label="Accreditation programmes">
      {programmes.map((programme) => <AccreditationBadge key={programme} programme={programme} />)}
    </div>
    <ChevronRight className="directory-item__chevron" size={23} strokeWidth={1.7} aria-hidden="true" />
  </article>;
}

function AccreditationStats({ accreditations, organizations, countries, programmes }: { accreditations: number; organizations: number; countries: number; programmes: number }) {
  const stats = [
    { icon: Award, value: accreditations, label: "Total Accreditations" },
    { icon: Building2, value: organizations, label: "Organizations" },
    { icon: Globe2, value: countries, label: "Countries" },
    { icon: ShieldCheck, value: programmes, label: "Accreditation Programs" },
  ];
  return <div className="directory-stats">{stats.map(({ icon: Icon, value, label }) => <div className="directory-stat" key={label}><Icon size={29} strokeWidth={1.55} /><strong>{value}</strong><span>{label}</span></div>)}</div>;
}

function CountrySection({ name, organizations, view, expanded, canCollapse, onExpand }: { name: string; organizations: AccreditedOrganizationRecord[]; view: "list" | "grid"; expanded: boolean; canCollapse: boolean; onExpand: () => void }) {
  const visible = canCollapse && !expanded ? organizations.slice(0, 4) : organizations;
  return <section className="directory-country-section">
    <header><h2>{name}</h2><span>{organizations.length} {organizations.length === 1 ? "organization" : "organizations"}</span></header>
    <div className={`directory-results directory-results--${view}`}>{visible.map((organization) => <OrganizationListItem organization={organization} view={view} key={organization.id} />)}</div>
    {canCollapse && !expanded && organizations.length > 4 && <button className="directory-country-expand" type="button" onClick={onExpand}>View all {organizations.length} organizations in {name}<ChevronDown size={17} /></button>}
  </section>;
}

export default function PublicOrganizations() {
  const [organizations, setOrganizations] = useState<AccreditedOrganizationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("all");
  const [programme, setProgramme] = useState("all");
  const [organizationType, setOrganizationType] = useState("all");
  const [view, setView] = useState<"list" | "grid">("list");
  const [expandedCountries, setExpandedCountries] = useState<Set<string>>(new Set());

  useEffect(() => {
    let active = true;
    getSupabaseBrowserClient().from("accredited_organizations").select(ORGANIZATION_SELECT).eq("status", "published").order("sort_order", { ascending: true }).order("organization_name", { ascending: true }).then(({ data, error: queryError }) => {
      if (!active) return;
      setOrganizations((data ?? []) as AccreditedOrganizationRecord[]);
      setError(Boolean(queryError));
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const countries = useMemo(() => Array.from(new Map(organizations.map((item) => [item.country_code, item.country_name])).entries()).sort((a, b) => {
    const left = COUNTRY_ORDER.indexOf(a[0]); const right = COUNTRY_ORDER.indexOf(b[0]);
    return (left < 0 ? 99 : left) - (right < 0 ? 99 : right) || a[1].localeCompare(b[1]);
  }), [organizations]);
  const programmes = useMemo(() => Array.from(new Set(organizations.flatMap((item) => getProgrammes(item.programme)))).sort(), [organizations]);
  const totalAccreditations = useMemo(() => organizations.reduce((total, item) => total + getProgrammes(item.programme).length, 0), [organizations]);
  const organizationTypes = useMemo(() => Array.from(new Set(organizations.map((item) => item.organization_type).filter((value): value is string => Boolean(value)))).sort(), [organizations]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return organizations.filter((item) => {
      const searchable = `${item.organization_name} ${item.country_name} ${item.city ?? ""} ${item.organization_type ?? ""} ${item.programme}`.toLowerCase();
      return (country === "all" || item.country_code === country) && (programme === "all" || getProgrammes(item.programme).includes(programme)) && (organizationType === "all" || item.organization_type === organizationType) && (!term || searchable.includes(term));
    });
  }, [organizations, search, country, programme, organizationType]);

  const grouped = useMemo(() => countries.map(([code, name]) => ({ code, name, organizations: filtered.filter((item) => item.country_code === code) })).filter((group) => group.organizations.length), [countries, filtered]);
  const filtersActive = Boolean(search.trim() || country !== "all" || programme !== "all" || organizationType !== "all");
  function resetFilters() { setSearch(""); setCountry("all"); setProgramme("all"); setOrganizationType("all"); setExpandedCountries(new Set()); }
  function expandCountry(code: string) { setExpandedCountries((current) => new Set(current).add(code)); }

  return <main className="organization-directory">
    <section className="directory-hero"><div className="container directory-hero__inner"><div><h1>ACCREDITED ORGANIZATIONS</h1><p>Trusted healthcare organizations accredited by AACI worldwide.</p></div><AccreditationStats accreditations={totalAccreditations} organizations={organizations.length} countries={countries.length} programmes={programmes.length} /></div></section>
    <section className="directory-content"><div className="container">
      <div className="directory-filter-panel">
        <div className="directory-filter-row">
          <label className="directory-search"><Search size={21} /><span className="sr-only">Search organization or country</span><input type="search" placeholder="Search organization or country..." value={search} onChange={(event) => setSearch(event.target.value)} /></label>
          <label><span className="sr-only">Filter by country</span><select aria-label="Filter by country" value={country} onChange={(event) => setCountry(event.target.value)}><option value="all">All Countries</option>{countries.map(([code, name]) => <option key={code} value={code}>{name}</option>)}</select></label>
          <label><span className="sr-only">Filter by accreditation programme</span><select aria-label="Filter by accreditation programme" value={programme} onChange={(event) => setProgramme(event.target.value)}><option value="all">All Programs</option>{programmes.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
          <label><span className="sr-only">Filter by organization type</span><select aria-label="Filter by organization type" value={organizationType} onChange={(event) => setOrganizationType(event.target.value)}><option value="all">All Types</option>{organizationTypes.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
          <button className="directory-reset" type="button" onClick={resetFilters} disabled={!filtersActive}><RefreshCw size={16} />Reset</button>
        </div>
        <div className="directory-filter-footer">
          <nav className="directory-country-pills" aria-label="Quick country filters"><button type="button" aria-current={country === "all" ? "page" : undefined} onClick={() => setCountry("all")}>All</button>{countries.map(([code, name]) => <button type="button" key={code} aria-current={country === code ? "page" : undefined} onClick={() => setCountry(code)}>{name}</button>)}</nav>
          <div className="directory-toolbar"><span><strong>{filtered.length}</strong> {filtered.length === 1 ? "organization" : "organizations"}</span><div role="group" aria-label="Directory view"><button type="button" aria-pressed={view === "list"} onClick={() => setView("list")}><List size={18} />List</button><button type="button" aria-pressed={view === "grid"} onClick={() => setView("grid")}><Grid2X2 size={17} />Grid</button></div></div>
        </div>
      </div>

      {loading ? <div className="directory-state" role="status">Loading accredited organizations…</div> : error ? <div className="directory-state directory-state--error" role="alert">We could not load the directory. Please try again shortly.</div> : grouped.length === 0 ? <div className="directory-state"><Award size={34} strokeWidth={1.5} /><h2>No accredited organizations found.</h2><p>Try changing your search or filters.</p><button type="button" onClick={resetFilters}>Reset filters</button></div> : <div className="directory-country-list">{grouped.map((group) => <CountrySection key={group.code} name={group.name} organizations={group.organizations} view={view} expanded={expandedCountries.has(group.code)} canCollapse={country === "all" && !filtersActive} onExpand={() => expandCountry(group.code)} />)}</div>}
    </div></section>
  </main>;
}
