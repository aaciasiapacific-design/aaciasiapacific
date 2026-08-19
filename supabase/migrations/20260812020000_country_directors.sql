-- Normalize and populate the four Phase 1 Country Directors.
-- This migration updates matching seed records instead of creating duplicates.

do $$
declare
  item jsonb;
  country jsonb;
  v_person_id uuid;
  v_assignment_id uuid;
begin
  for item in
    select value from jsonb_array_elements($directors$
    [
      {
        "match":"phuong b. le",
        "name":"Phuong B. Le",
        "credentials":"MD, PhD",
        "image":"/phuong-b.webp",
        "order":10,
        "countries":[{"code":"VN","name":"Vietnam"}]
      },
      {
        "match":"dr. darshini kumar",
        "name":"Dr. Darshini Kumar",
        "credentials":"M.D.",
        "image":"/dr-darshini-kumar.webp",
        "order":20,
        "countries":[{"code":"SG","name":"Singapore"},{"code":"MY","name":"Malaysia"}]
      },
      {
        "match":"mohammad zakirul karim",
        "name":"Mohammad Zakirul Karim",
        "credentials":"MBBS, MBA, MPH",
        "image":"/mohammad-zakirul-karim.webp",
        "order":30,
        "countries":[{"code":"BD","name":"Bangladesh"}]
      },
      {
        "match":"dr. nilar han",
        "name":"Dr. Nilar Han",
        "credentials":"MBBS, MPH",
        "image":"/nilar-han.webp",
        "order":40,
        "countries":[{"code":"MM","name":"Myanmar"}]
      }
    ]
    $directors$::jsonb)
  loop
    v_person_id := null;
    v_assignment_id := null;

    select p.id, pa.id into v_person_id, v_assignment_id
    from public.people p
    join public.person_assignments pa on pa.person_id = p.id
    where pa.section = 'country_director'
      and lower(p.full_name) like (item->>'match') || '%'
    limit 1;

    if v_person_id is null then
      insert into public.people (
        full_name, credentials, photo_path, status
      ) values (
        item->>'name', item->>'credentials', item->>'image', 'published'
      ) returning id into v_person_id;

      insert into public.person_assignments (
        person_id, section, role_title, sort_order, status
      ) values (
        v_person_id, 'country_director', 'Country Director',
        (item->>'order')::integer, 'published'
      ) returning id into v_assignment_id;
    else
      update public.people
      set full_name = item->>'name',
          credentials = item->>'credentials',
          photo_path = item->>'image',
          status = 'published'
      where id = v_person_id;

      update public.person_assignments
      set role_title = 'Country Director',
          organization_name = null,
          member_code = null,
          surveyor_specialty = null,
          is_leadership = false,
          sort_order = (item->>'order')::integer,
          status = 'published'
      where id = v_assignment_id;
    end if;

    delete from public.person_assignment_countries
    where person_assignment_countries.assignment_id = v_assignment_id;

    for country in select value from jsonb_array_elements(item->'countries')
    loop
      insert into public.person_assignment_countries (
        assignment_id, country_code, country_name, sort_order
      ) values (
        v_assignment_id,
        country->>'code',
        country->>'name',
        coalesce((select count(*) from public.person_assignment_countries pac where pac.assignment_id = v_assignment_id), 0)
      );
    end loop;
  end loop;
end;
$$;
