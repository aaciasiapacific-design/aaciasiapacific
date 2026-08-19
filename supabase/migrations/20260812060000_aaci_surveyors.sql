-- Populate the Phase 1 AACI Surveyor directory from the approved reference set.
-- Existing records are matched by member code first, so this can be rerun safely.

do $$
declare
  item jsonb;
  v_person_id uuid;
  v_assignment_id uuid;
begin
  for item in
    select value from jsonb_array_elements($surveyors$
    [
      {"name":"Somporn Kumphong","credentials":"MD","code":"AACI C 3 2020","specialty":"clinical","image":"/surveyor-somporn.webp","order":1},
      {"name":"Phichet Panugthong","credentials":"MD","code":"AACI C 5 2022","specialty":"clinical","image":"/surveyor-phichet.webp","order":2},
      {"name":"Surawee Nawinpakasit","credentials":"MD","code":"AACI C 50 2022","specialty":"clinical","image":"/surveyor-surawee.webp","order":3},
      {"name":"Bhumibhut Isarankura","credentials":"MD","code":"AACI C 56 2022","specialty":"clinical","image":"/surveyor-bhumibhut.webp","order":4},
      {"name":"Udom Krairithichai","credentials":"MD","code":"AACI C 69 2023","specialty":"clinical","image":"/surveyor-udom.webp","order":5},
      {"name":"Krit Kurchaiyapanich","credentials":"MD","code":"AACI C 77 2023","specialty":"clinical","image":"/surveyor-krit.webp","order":6},
      {"name":"Yuttapon Titaram","credentials":"MD","code":"AACI C 73 2023","specialty":"clinical","image":"/surveyor-yuttapon.webp","order":7},
      {"name":"Kanida Buakhao","credentials":"MD","code":"AACI C 89 2024","specialty":"clinical","image":"/surveyor-kanida.webp","order":8},
      {"name":"Chutiporn Pinjichob","code":"AACI C 102 2024","specialty":"clinical","image":"/surveyor-chutiporn.webp","order":9},
      {"name":"Mayuree Phophichitra","code":"AACI C 104 2024","specialty":"clinical","image":"/surveyor-mayuree.webp","order":10},
      {"name":"Wasanai Krisorakun","code":"AACI C 105 2024","specialty":"clinical","image":"/surveyor-wasanai.webp","order":11},
      {"name":"Tanutporn Chatuparisute","credentials":"MD","code":"AACI C 112 2025","specialty":"clinical","image":"/surveyor-tanutporn.webp","order":12},
      {"name":"Dr. Watcharapat Phattarawasrap","credentials":"MD","code":"AACI C 121 2026","specialty":"clinical","image":"/surveyor-watcharapat.webp","order":13},

      {"name":"Naphatsinth Sinthoon","code":"AACI G 3 2020","specialty":"governance","image":"/surveyor-naphatsinth.webp","order":14},
      {"name":"Chompunuch Ratana","code":"AACI G 46 2022","specialty":"governance","image":"/surveyor-chompunuch.webp","order":15},
      {"name":"Nunthida Phanthusart","code":"AACI G 49 2022","specialty":"governance","image":"/surveyor-nunthida.webp","order":16},
      {"name":"Puckkaporn Lojjanawongsakorn","code":"AACI G 72 2023","specialty":"governance","image":"/surveyor-puckkaporn.webp","order":17},
      {"name":"Thiti Samuthrat","code":"AACI G 94 2024","specialty":"governance","image":"/surveyor-thiti.webp","order":18},
      {"name":"Penpak Sutheechai","code":"AACI G 95 2024","specialty":"governance","image":"/surveyor-penpak.webp","order":19},
      {"name":"Settakon Raktanapaksiri","code":"AACI G 96 2024","specialty":"governance","image":"/surveyor-settakon.webp","order":20},
      {"name":"Chalinee Shaosak","code":"AACI G 97 2024","specialty":"governance","image":"/surveyor-chalinee.webp","order":21},
      {"name":"Tanaphan Gunthasit","code":"AACI G 98 2024","specialty":"governance","image":"/surveyor-tanaphan.webp","order":22},
      {"name":"Patumrat Kachonsrikeat","code":"AACI G 99 2024","specialty":"governance","image":"/surveyor-patumrat.webp","order":23},
      {"name":"Eakarach Suksang","code":"AACI G 100 2024","specialty":"governance","image":"/surveyor-eakarach.webp","order":24},
      {"name":"Somjit Jinapuk","code":"AACI G 101 2024","specialty":"governance","image":"/surveyor-somjit.webp","order":25},
      {"name":"Thanaporn Sintoon","code":"AACI G 103 2024","specialty":"governance","image":"/surveyor-thanaporn.webp","order":26},
      {"name":"Aree Neophan","code":"AACI G 110 2025","specialty":"governance","image":"/surveyor-aree.webp","order":27},
      {"name":"Rasamee Wichamongkol","code":"AACI G 111 2025","specialty":"governance","image":"/surveyor-rasamee.webp","order":28},
      {"name":"Rachaneewan","specialty":"governance","image":"/surveyor-rachaneewan.webp","order":29},

      {"name":"Nirachit Perngsangvatana","code":"AACI PE 35 2020","specialty":"pe_specialist","image":"/surveyor-nirachit.webp","order":30},
      {"name":"Dhitipun Maiprasert","code":"AACI PE 52 2022","specialty":"pe_specialist","image":"/surveyor-dhitipun.webp","order":31},
      {"name":"Watchara Pattanaworasakul","code":"AACI PE 62 2023","specialty":"pe_specialist","image":"/surveyor-watchara-pe.webp","order":32},
      {"name":"Sun Sayamipuk","code":"AACI PE 83 2024","specialty":"pe_specialist","image":"/surveyor-sun.webp","order":33},
      {"name":"Petch Milintasat","code":"AACI PE 90 2024","specialty":"pe_specialist","image":"/surveyor-petch.webp","order":34}
    ]
    $surveyors$::jsonb)
  loop
    v_person_id := null;
    v_assignment_id := null;

    select p.id, pa.id into v_person_id, v_assignment_id
    from public.people p
    join public.person_assignments pa on pa.person_id = p.id
    where pa.section = 'surveyor'
      and (
        (item->>'code' is not null and pa.member_code = item->>'code')
        or (item->>'code' is null and lower(p.full_name) = lower(item->>'name'))
      )
    order by pa.created_at asc
    limit 1;

    if v_person_id is null then
      insert into public.people (
        full_name, credentials, photo_path, status
      ) values (
        item->>'name', item->>'credentials', item->>'image', 'published'
      ) returning id into v_person_id;

      insert into public.person_assignments (
        person_id, section, role_title, member_code,
        surveyor_specialty, is_leadership, sort_order, status
      ) values (
        v_person_id,
        'surveyor',
        'Accredited Surveyor',
        item->>'code',
        item->>'specialty',
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
      set role_title = 'Accredited Surveyor',
          organization_name = null,
          member_code = item->>'code',
          surveyor_specialty = item->>'specialty',
          is_leadership = false,
          sort_order = (item->>'order')::integer,
          status = 'published'
      where id = v_assignment_id;
    end if;

    delete from public.person_assignment_countries pac
    where pac.assignment_id = v_assignment_id;
  end loop;

  -- The latest approved attachment set replaces Jutathip with Rachaneewan
  -- in the Surveyor directory only. Her Asia Office profile is unaffected.
  update public.person_assignments pa
  set status = 'archived'
  from public.people p
  where pa.person_id = p.id
    and pa.section = 'surveyor'
    and lower(p.full_name) like 'jutathip intrarauangsri%';
end;
$$;
