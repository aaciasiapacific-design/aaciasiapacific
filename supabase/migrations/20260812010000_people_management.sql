-- People Management permissions and migration of the existing public directory.

create or replace function public.prevent_editor_publish()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if auth.uid() is not null
    and new.status = 'published'
    and old.status <> 'published'
    and not public.is_cms_admin()
  then
    raise exception 'Only administrators can publish content';
  end if;
  return new;
end;
$$;

drop trigger if exists people_prevent_editor_publish on public.people;
create trigger people_prevent_editor_publish
before update on public.people
for each row execute function public.prevent_editor_publish();

drop trigger if exists person_assignments_prevent_editor_publish on public.person_assignments;
create trigger person_assignments_prevent_editor_publish
before update on public.person_assignments
for each row execute function public.prevent_editor_publish();

drop policy if exists "CMS users can update people" on public.people;
create policy "CMS users can update people" on public.people
for update to authenticated
using (public.is_cms_user())
with check (public.is_cms_user());

drop policy if exists "CMS users can update assignments" on public.person_assignments;
create policy "CMS users can update assignments" on public.person_assignments
for update to authenticated
using (public.is_cms_user())
with check (public.is_cms_user());

drop policy if exists "CMS users can replace assignment countries" on public.person_assignment_countries;
create policy "CMS users can replace assignment countries"
on public.person_assignment_countries
for delete to authenticated
using (public.is_cms_user());

drop policy if exists "CMS users can replace people photos" on storage.objects;
create policy "CMS users can replace people photos"
on storage.objects
for delete to authenticated
using (bucket_id = 'cms-images' and name like 'people/%' and public.is_cms_user());

do $$
declare
  item jsonb;
  country jsonb;
  person_id uuid;
  assignment_id uuid;
begin
  for item in
    select value from jsonb_array_elements($people$
    [
      {"section":"asia_office","name":"Somporn Kumphong, MD","role":"Chief Executive Officer","code":"AACI A 01 2020","image":"/team-somporn.webp","leadership":true,"order":10},
      {"section":"asia_office","name":"Rewat Denjakawal","role":"Managing Director","code":"AACI A 02 2020","image":"/team-rewat.webp","leadership":true,"order":20},
      {"section":"asia_office","name":"Naphatsinth Sinthoon","role":"COO Accreditation Affairs","code":"AACI A 03 2020","image":"/team-naphatsinth-sinthoon.webp","order":30},
      {"section":"asia_office","name":"Nirachit Rerngsangvatana","role":"COO Academy Affairs","code":"AACI A 05 2020","image":"/team-nirachit-rerngsangvatana.webp","order":40},
      {"section":"asia_office","name":"Surawee Nawinpakasit, MD","role":"COO Clinical Affairs","code":"AACI A 04 2020","image":"/team-surawee-nawinpakasit.webp","order":50},
      {"section":"asia_office","name":"Aung Thu","role":"Chief Marketing Officer","code":"AACI A 12 2026","image":"/team-aung-thu.webp","order":60},
      {"section":"asia_office","name":"Jutathip Intrarauangsri","role":"COO Administration Affairs","code":"AACI A 11 2025","image":"/team-jutathip-intrarauangsri.webp","order":70},
      {"section":"asia_office","name":"Thanaporn Sintoon","role":"Assistant COO","code":"AACI A 10 2025","image":"/team-thanaporn-sinthoon.webp","order":80},
      {"section":"asia_office","name":"Prangthip Ruangpongsarn","role":"Director Regional Support Services","code":"AACI A 06 2020","image":"/team-prangthip-ruangpongsarn.webp","order":90},
      {"section":"asia_office","name":"Saovaluk Impun","role":"Accounting Manager","code":"AACI A 07 2020","image":"/team-saovaluk-impun.webp","order":100},
      {"section":"asia_office","name":"Tula Inthaphrom","role":"Ex Secretary of MD","code":"AACI A 09 2020","image":"/team-tula-inthaphrom.webp","order":110},
      {"section":"asia_office","name":"Thawin Kumphong","role":"Ex Secretary of CEO","code":"AACI A 08 2020","image":"/team-thawin-kumphong.webp","order":120},

      {"section":"country_director","name":"Phuong B. Le, MD, PhD","role":"Country Director","image":"/phuong-b.webp","order":10,"countries":[{"code":"VN","name":"Vietnam"}]},
      {"section":"country_director","name":"Dr. Darshini Kumar, M.D.","role":"Country Director","image":"/dr-darshini-kumar.webp","order":20,"countries":[{"code":"SG","name":"Singapore"},{"code":"MY","name":"Malaysia"}]},
      {"section":"country_director","name":"Mohammad Zakirul Karim, MBBS, MBA, MPH","role":"Country Director","image":"/mohammad-zakirul-karim.webp","order":30,"countries":[{"code":"BD","name":"Bangladesh"}]},
      {"section":"country_director","name":"Dr. Nilar Han, MBBS, MPH","role":"Country Director","image":"/nilar-han.webp","order":40,"countries":[{"code":"MM","name":"Myanmar"}]},

      {"section":"regional_advisory_board","name":"Assistant Professor Dr. Piriya Narukhutrpicha, M.D., Ph.D.","role":"Dean of Faculty of Medicine, Naresuan University","image":"/piriya-narukhutrpicha.webp","order":10},
      {"section":"regional_advisory_board","name":"Kamonsak Reungjarearnrung, Pharm.D.","role":"President, Asia Pacific Oncology Pharmacy Association (APOPA)","image":"/kamonsak-reungjarearnrung.webp","order":20},

      {"section":"surveyor","name":"Somporn Kumphong, MD","role":"Accredited Surveyor","code":"AACI C 3 2020","image":"/surveyor-somporn.webp","specialty":"clinical","order":10},
      {"section":"surveyor","name":"Phichet Panugthong, MD","role":"Accredited Surveyor","code":"AACI C 5 2022","image":"/surveyor-phichet.webp","specialty":"clinical","order":20},
      {"section":"surveyor","name":"Surawee Nawinpakasit, MD","role":"Accredited Surveyor","code":"AACI C 50 2022","image":"/surveyor-surawee.webp","specialty":"clinical","order":30},
      {"section":"surveyor","name":"Bhumibhut Isarankura, MD","role":"Accredited Surveyor","code":"AACI C 56 2022","image":"/surveyor-bhumibhut.webp","specialty":"clinical","order":40},
      {"section":"surveyor","name":"Udom Krairithichai, MD","role":"Accredited Surveyor","code":"AACI C 69 2023","image":"/surveyor-udom.webp","specialty":"clinical","order":50},
      {"section":"surveyor","name":"Krit Kurchaiyapanich, MD","role":"Accredited Surveyor","code":"AACI C 77 2023","image":"/surveyor-krit.webp","specialty":"clinical","order":60},
      {"section":"surveyor","name":"Yuttapon Titaram, MD","role":"Accredited Surveyor","code":"AACI C 73 2023","image":"/surveyor-yuttapon.webp","specialty":"clinical","order":70},
      {"section":"surveyor","name":"Kanida Buakhao, MD","role":"Accredited Surveyor","code":"AACI C 89 2024","image":"/surveyor-kanida.webp","specialty":"clinical","order":80},
      {"section":"surveyor","name":"Chutiporn Pinjichob","role":"Accredited Surveyor","code":"AACI C 102 2024","image":"/surveyor-chutiporn.webp","specialty":"clinical","order":90},
      {"section":"surveyor","name":"Mayuree Phophichitra","role":"Accredited Surveyor","code":"AACI C 104 2024","image":"/surveyor-mayuree.webp","specialty":"clinical","order":100},
      {"section":"surveyor","name":"Wasanai Krisorakun","role":"Accredited Surveyor","code":"AACI C 105 2024","image":"/surveyor-wasanai.webp","specialty":"clinical","order":110},
      {"section":"surveyor","name":"Tanutporn Chatuparisute, MD","role":"Accredited Surveyor","code":"AACI C 112 2025","image":"/surveyor-tanutporn.webp","specialty":"clinical","order":120},
      {"section":"surveyor","name":"Dr. Watcharapat Phattarawasrap, MD","role":"Accredited Surveyor","code":"AACI C 121 2026","image":"/surveyor-watcharapat.webp","specialty":"clinical","order":130},

      {"section":"surveyor","name":"Naphatsinth Sinthoon","role":"Accredited Surveyor","code":"AACI G 3 2020","image":"/surveyor-naphatsinth.webp","specialty":"governance","order":210},
      {"section":"surveyor","name":"Chompunuch Ratana","role":"Accredited Surveyor","code":"AACI G 46 2022","image":"/surveyor-chompunuch.webp","specialty":"governance","order":220},
      {"section":"surveyor","name":"Nunthida Phanthusart","role":"Accredited Surveyor","code":"AACI G 49 2022","image":"/surveyor-nunthida.webp","specialty":"governance","order":230},
      {"section":"surveyor","name":"Puckkaporn Lojjanawongsakorn","role":"Accredited Surveyor","code":"AACI G 72 2023","image":"/surveyor-puckkaporn.webp","specialty":"governance","order":240},
      {"section":"surveyor","name":"Thiti Samuthrat","role":"Accredited Surveyor","code":"AACI G 94 2024","image":"/surveyor-thiti.webp","specialty":"governance","order":250},
      {"section":"surveyor","name":"Penpak Sutheechai","role":"Accredited Surveyor","code":"AACI G 95 2024","image":"/surveyor-penpak.webp","specialty":"governance","order":260},
      {"section":"surveyor","name":"Settakon Raktanapaksiri","role":"Accredited Surveyor","code":"AACI G 96 2024","image":"/surveyor-settakon.webp","specialty":"governance","order":270},
      {"section":"surveyor","name":"Chalinee Shaosak","role":"Accredited Surveyor","code":"AACI G 97 2024","image":"/surveyor-chalinee.webp","specialty":"governance","order":280},
      {"section":"surveyor","name":"Tanaphan Gunthasit","role":"Accredited Surveyor","code":"AACI G 98 2024","image":"/surveyor-tanaphan.webp","specialty":"governance","order":290},
      {"section":"surveyor","name":"Patumrat Kachonsrikeat","role":"Accredited Surveyor","code":"AACI G 99 2024","image":"/surveyor-patumrat.webp","specialty":"governance","order":300},
      {"section":"surveyor","name":"Eakarach Suksang","role":"Accredited Surveyor","code":"AACI G 100 2024","image":"/surveyor-eakarach.webp","specialty":"governance","order":310},
      {"section":"surveyor","name":"Somjit Jinapuk","role":"Accredited Surveyor","code":"AACI G 101 2024","image":"/surveyor-somjit.webp","specialty":"governance","order":320},
      {"section":"surveyor","name":"Thanaporn Sintoon","role":"Accredited Surveyor","code":"AACI G 103 2024","image":"/surveyor-thanaporn.webp","specialty":"governance","order":330},
      {"section":"surveyor","name":"Aree Neophan","role":"Accredited Surveyor","code":"AACI G 110 2025","image":"/surveyor-aree.webp","specialty":"governance","order":340},
      {"section":"surveyor","name":"Rasamee Wichamongkol","role":"Accredited Surveyor","code":"AACI G 111 2025","image":"/surveyor-rasamee.webp","specialty":"governance","order":350},
      {"section":"surveyor","name":"Jutathip Intrarauangsri","role":"Accredited Surveyor","code":"AACI G 114 2025","image":"/team-jutathip-intrarauangsri.webp","specialty":"governance","order":360},

      {"section":"surveyor","name":"Nirachit Perngsangvatana","role":"Accredited Surveyor","code":"AACI PE 35 2020","image":"/surveyor-nirachit.webp","specialty":"pe_specialist","order":410},
      {"section":"surveyor","name":"Dhitipun Maiprasert","role":"Accredited Surveyor","code":"AACI PE 52 2022","image":"/surveyor-dhitipun.webp","specialty":"pe_specialist","order":420},
      {"section":"surveyor","name":"Watchara Pattanaworasakul","role":"Accredited Surveyor","code":"AACI PE 62 2023","image":"/surveyor-watchara-pe.webp","specialty":"pe_specialist","order":430},
      {"section":"surveyor","name":"Sun Sayamipuk","role":"Accredited Surveyor","code":"AACI PE 83 2024","image":"/surveyor-sun.webp","specialty":"pe_specialist","order":440},
      {"section":"surveyor","name":"Petch Milintasat","role":"Accredited Surveyor","code":"AACI PE 90 2024","image":"/surveyor-petch.webp","specialty":"pe_specialist","order":450}
    ]
    $people$::jsonb)
  loop
    person_id := null;
    assignment_id := null;

    select p.id, pa.id into person_id, assignment_id
    from public.people p
    join public.person_assignments pa on pa.person_id = p.id
    where pa.section = item->>'section'
      and (
        (item->>'code' is not null and pa.member_code = item->>'code')
        or (item->>'code' is null and p.full_name = item->>'name')
      )
    limit 1;

    if person_id is null then
      insert into public.people (full_name, photo_path, status)
      values (item->>'name', item->>'image', 'published')
      returning id into person_id;

      insert into public.person_assignments (
        person_id, section, role_title, member_code, surveyor_specialty,
        is_leadership, sort_order, status
      ) values (
        person_id,
        item->>'section',
        item->>'role',
        item->>'code',
        item->>'specialty',
        coalesce((item->>'leadership')::boolean, false),
        (item->>'order')::integer,
        'published'
      ) returning id into assignment_id;

      if jsonb_typeof(item->'countries') = 'array' then
        for country in select value from jsonb_array_elements(item->'countries')
        loop
          insert into public.person_assignment_countries (
            assignment_id, country_code, country_name, sort_order
          ) values (
            assignment_id,
            country->>'code',
            country->>'name',
            coalesce((select count(*) from public.person_assignment_countries where person_assignment_countries.assignment_id = assignment_id), 0)
          ) on conflict (assignment_id, country_code) do nothing;
        end loop;
      end if;
    end if;
  end loop;
end;
$$;
