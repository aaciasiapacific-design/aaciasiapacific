-- Normalize and populate the two Phase 1 Regional Advisory Board profiles.
-- Existing records are matched by name so rerunning does not duplicate them.

do $$
declare
  item jsonb;
  v_person_id uuid;
  v_assignment_id uuid;
begin
  for item in
    select value from jsonb_array_elements($board$
    [
      {
        "match":"assistant professor dr. piriya narukhutrpicha",
        "name":"Assistant Professor Dr. Piriya Narukhutrpicha",
        "credentials":"M.D., Ph.D.",
        "role":"Dean of Faculty of Medicine, Naresuan University",
        "organization":"Naresuan University",
        "image":"/piriya-narukhutrpicha.webp",
        "order":1
      },
      {
        "match":"kamonsak reungjarearnrung",
        "name":"Kamonsak Reungjarearnrung",
        "credentials":"Pharm.D.",
        "role":"President, Asia Pacific Oncology Pharmacy Association (APOPA)",
        "organization":"Asia Pacific Oncology Pharmacy Association (APOPA)",
        "image":"/kamonsak-reungjarearnrung.webp",
        "order":2
      }
    ]
    $board$::jsonb)
  loop
    v_person_id := null;
    v_assignment_id := null;

    select p.id, pa.id into v_person_id, v_assignment_id
    from public.people p
    join public.person_assignments pa on pa.person_id = p.id
    where pa.section = 'regional_advisory_board'
      and lower(p.full_name) like (item->>'match') || '%'
    order by pa.created_at asc
    limit 1;

    if v_person_id is null then
      insert into public.people (
        full_name, credentials, photo_path, status
      ) values (
        item->>'name', item->>'credentials', item->>'image', 'published'
      ) returning id into v_person_id;

      insert into public.person_assignments (
        person_id, section, role_title, organization_name,
        is_leadership, sort_order, status
      ) values (
        v_person_id,
        'regional_advisory_board',
        item->>'role',
        item->>'organization',
        false,
        (item->>'order')::integer,
        'published'
      ) returning id into v_assignment_id;
    else
      update public.people
      set full_name = item->>'name',
          credentials = item->>'credentials',
          photo_path = item->>'image',
          status = 'published'
      where id = v_person_id;

      update public.person_assignments
      set role_title = item->>'role',
          organization_name = item->>'organization',
          member_code = null,
          surveyor_specialty = null,
          is_leadership = false,
          sort_order = (item->>'order')::integer,
          status = 'published'
      where id = v_assignment_id;
    end if;

    delete from public.person_assignment_countries pac
    where pac.assignment_id = v_assignment_id;
  end loop;
end;
$$;
