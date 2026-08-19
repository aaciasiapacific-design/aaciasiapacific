-- Normalize and populate the 12 Phase 1 AACI Asia Office profiles.
-- Existing records are matched by member code first, so rerunning does not duplicate them.

do $$
declare
  item jsonb;
  v_person_id uuid;
  v_assignment_id uuid;
begin
  for item in
    select value from jsonb_array_elements($office$
    [
      {"match":"somporn kumphong","name":"Somporn Kumphong","credentials":"MD","role":"Chief Executive Officer","code":"AACI A 01 2020","image":"/team-somporn.webp","leadership":true,"order":10},
      {"match":"rewat denjakawal","name":"Rewat Denjakawal","role":"Managing Director","code":"AACI A 02 2020","image":"/team-rewat.webp","leadership":true,"order":20},
      {"match":"naphatsinth sinthoon","name":"Naphatsinth Sinthoon","role":"COO Accreditation Affairs","code":"AACI A 03 2020","image":"/team-naphatsinth-sinthoon.webp","order":30},
      {"match":"nirachit rerngsangvatana","name":"Nirachit Rerngsangvatana","role":"COO Academy Affairs","code":"AACI A 05 2020","image":"/team-nirachit-rerngsangvatana.webp","order":40},
      {"match":"surawee nawinpakasit","name":"Surawee Nawinpakasit","credentials":"MD","role":"COO Clinical Affairs","code":"AACI A 04 2020","image":"/team-surawee-nawinpakasit.webp","order":50},
      {"match":"aung thu","name":"Aung Thu","role":"Chief Marketing Officer","code":"AACI A 12 2026","image":"/team-aung-thu.webp","order":60},
      {"match":"jutathip intrarauangsri","name":"Jutathip Intrarauangsri","role":"COO Administration Affairs","code":"AACI A 11 2025","image":"/team-jutathip-intrarauangsri.webp","order":70},
      {"match":"thanaporn sintoon","name":"Thanaporn Sintoon","role":"Assistant COO","code":"AACI A 10 2025","image":"/team-thanaporn-sinthoon.webp","order":80},
      {"match":"prangthip ruangpongsarn","name":"Prangthip Ruangpongsarn","role":"Director Regional Support Services","code":"AACI A 06 2020","image":"/team-prangthip-ruangpongsarn.webp","order":90},
      {"match":"saovaluk impun","name":"Saovaluk Impun","role":"Accounting Manager","code":"AACI A 07 2020","image":"/team-saovaluk-impun.webp","order":100},
      {"match":"tula inthaphrom","name":"Tula Inthaphrom","role":"Ex Secretary of MD","code":"AACI A 09 2020","image":"/team-tula-inthaphrom.webp","order":110},
      {"match":"thawin kumphong","name":"Thawin Kumphong","role":"Ex Secretary of CEO","code":"AACI A 08 2020","image":"/team-thawin-kumphong.webp","order":120}
    ]
    $office$::jsonb)
  loop
    v_person_id := null;
    v_assignment_id := null;

    select p.id, pa.id into v_person_id, v_assignment_id
    from public.people p
    join public.person_assignments pa on pa.person_id = p.id
    where pa.section = 'asia_office'
      and (
        pa.member_code = item->>'code'
        or lower(p.full_name) like (item->>'match') || '%'
      )
    order by case when pa.member_code = item->>'code' then 0 else 1 end
    limit 1;

    if v_person_id is null then
      insert into public.people (
        full_name, credentials, photo_path, status
      ) values (
        item->>'name', item->>'credentials', item->>'image', 'published'
      ) returning id into v_person_id;

      insert into public.person_assignments (
        person_id, section, role_title, member_code,
        is_leadership, sort_order, status
      ) values (
        v_person_id,
        'asia_office',
        item->>'role',
        item->>'code',
        coalesce((item->>'leadership')::boolean, false),
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
          organization_name = null,
          member_code = item->>'code',
          surveyor_specialty = null,
          is_leadership = coalesce((item->>'leadership')::boolean, false),
          sort_order = (item->>'order')::integer,
          status = 'published'
      where id = v_assignment_id;
    end if;

    delete from public.person_assignment_countries pac
    where pac.assignment_id = v_assignment_id;
  end loop;
end;
$$;
