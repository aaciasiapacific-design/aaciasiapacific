"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "../../lib/supabase/client";
import { getPeoplePhotoUrl, PersonRecord, PeopleSection, SPECIALTY_LABELS, SurveyorSpecialty } from "../../lib/people";

type AssignmentQueryRow = {
  id: string;
  section: PeopleSection;
  role_title: string | null;
  organization_name: string | null;
  member_code: string | null;
  surveyor_specialty: SurveyorSpecialty | null;
  is_leadership: boolean;
  sort_order: number;
  status: "published";
  people: {
    id: string;
    full_name: string;
    credentials: string | null;
    photo_path: string | null;
    biography: string | null;
    status: "published";
  };
  person_assignment_countries: Array<{
    id: string;
    country_code: string;
    country_name: string;
    sort_order: number;
  }>;
};

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

function PersonPhoto({ person, className }: { person: PersonRecord; className: string }) {
  const photoUrl = getPeoplePhotoUrl(person.photo_path);
  return <div className={className}>{photoUrl ? <img src={photoUrl} alt={person.full_name} /> : <span aria-hidden="true">{person.full_name.charAt(0)}</span>}</div>;
}

export default function PublicPeopleDirectory({ section }: { section: PeopleSection }) {
  const [people, setPeople] = useState<PersonRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadPeople() {
      const { data, error: queryError } = await getSupabaseBrowserClient()
        .from("person_assignments")
        .select(`
          id, section, role_title, organization_name, member_code, surveyor_specialty,
          is_leadership, sort_order, status,
          people!inner(id, full_name, credentials, photo_path, biography, status),
          person_assignment_countries(id, country_code, country_name, sort_order)
        `)
        .eq("section", section)
        .eq("status", "published")
        .eq("people.status", "published")
        .order("sort_order", { ascending: true });

      if (!active) return;
      if (queryError) {
        setError(true);
        setPeople([]);
      } else {
        setPeople(((data ?? []) as unknown as AssignmentQueryRow[]).map(toRecord));
        setError(false);
      }
      setLoading(false);
    }

    loadPeople();
    return () => { active = false; };
  }, [section]);

  const leaders = useMemo(() => people.filter((person) => person.is_leadership), [people]);
  const team = useMemo(() => people.filter((person) => !person.is_leadership), [people]);

  if (loading) return <div className="people-public-state" role="status">Loading people…</div>;
  if (error) return <div className="people-public-state people-public-state--error" role="alert">We could not load this directory. Please try again shortly.</div>;
  if (!people.length) return <div className="people-public-state">This directory will be updated soon.</div>;

  if (section === "country_director") {
    return <section className="country-directors__grid">{people.map((person) => <article key={person.assignmentId} className="director-card">
      <PersonPhoto person={person} className="director-card__image" />
      <div><p>COUNTRY DIRECTOR</p><h3>{person.full_name}{person.credentials ? `, ${person.credentials}` : ""}</h3>
        <strong className="director-card__regions">{person.countries.map((country, index) => <span key={country.country_code} className="director-card__region">
          <img className="director-card__flag" src={`https://flagcdn.com/w80/${country.country_code.toLowerCase()}.png`} alt="" />
          {country.country_name}{index < person.countries.length - 1 && <span className="director-card__separator"> &amp;</span>}
        </span>)}</strong>
      </div>
    </article>)}</section>;
  }

  if (section === "regional_advisory_board") {
    return <section className="advisory-board__grid">{people.map((person) => <article key={person.assignmentId} className="advisory-card">
      <PersonPhoto person={person} className="advisory-card__image" />
      <div><p>REGIONAL ADVISORY BOARD</p><h3>{person.full_name}{person.credentials ? `, ${person.credentials}` : ""}</h3><span>{person.role_title}</span></div>
    </article>)}</section>;
  }

  if (section === "asia_office") {
    const card = (person: PersonRecord) => <article key={person.assignmentId} className="asia-team__card">
      <PersonPhoto person={person} className="asia-team__image" />
      <div><h3>{person.full_name}{person.credentials ? `, ${person.credentials}` : ""}</h3><span>AACI ASIA-PACIFIC</span>{person.member_code && <small>{person.member_code}</small>}<p>{person.role_title}</p></div>
    </article>;
    return <><section className="asia-team__leaders">{leaders.map(card)}</section>{team.length > 0 && <section className="asia-team__team"><header><p className="eyebrow">AACI ASIA-PACIFIC TEAM</p><h2>Supporting quality at every step.</h2></header><div>{team.map(card)}</div></section>}</>;
  }

  const groups: Array<{ key: SurveyorSpecialty; title: string; summary: string }> = [
    { key: "clinical", title: "Clinical", summary: "Clinical experts who bring patient-centred knowledge and practical assessment experience." },
    { key: "governance", title: "Governance", summary: "Governance specialists who help organisations turn quality commitments into reliable systems." },
    { key: "pe_specialist", title: "PE Specialist", summary: "Physical environment specialists supporting safer facilities, preparedness and resilient operations." },
  ];

  return <>{groups.map((group) => {
    const members = people.filter((person) => person.surveyor_specialty === group.key);
    if (!members.length) return null;
    const modifier = group.key === "pe_specialist" ? "pe" : group.key;
    return <section key={group.key} className={`surveyor-directory__group surveyor-directory__group--${modifier}`}><header><div><p className="eyebrow">AACI SURVEYOR NETWORK</p><h2>{group.title}</h2></div><p>{group.summary}</p></header>
      <div className="surveyor-directory__grid">{members.map((person) => <article key={person.assignmentId} className="surveyor-card">
        <PersonPhoto person={person} className="surveyor-card__image" />
        <div><h3>{person.full_name}{person.credentials ? `, ${person.credentials}` : ""}</h3><p>{person.role_title || "Accredited Surveyor"}</p>{person.member_code && <small>{person.member_code}</small>}<strong>{SPECIALTY_LABELS[group.key]}</strong></div>
      </article>)}</div>
    </section>;
  })}</>;
}
