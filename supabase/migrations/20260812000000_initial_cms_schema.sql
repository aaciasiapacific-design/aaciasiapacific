create extension if not exists pgcrypto with schema extensions;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.is_cms_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where id = auth.uid() and is_active = true
  );
$$;

create or replace function public.is_cms_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where id = auth.uid() and role = 'admin' and is_active = true
  );
$$;

create table public.news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null default 'AACI Insights',
  summary text not null default '',
  content text not null default '',
  cover_image_path text,
  author_name text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  description text not null default '',
  cover_image_path text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  timezone text not null default 'Asia/Bangkok',
  mode text not null default 'online' check (mode in ('online', 'onsite', 'hybrid')),
  location text,
  registration_url text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (ends_at is null or ends_at >= starts_at)
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text,
  summary text not null default '',
  description text not null default '',
  cover_image_path text,
  duration_text text,
  format_text text,
  fee_amount numeric(12, 2),
  fee_currency text not null default 'USD' check (char_length(fee_currency) = 3),
  registration_url text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (fee_amount is null or fee_amount >= 0)
);

create table public.course_sessions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz,
  timezone text not null default 'Asia/Bangkok',
  capacity integer,
  registration_deadline timestamptz,
  registration_url text,
  registration_status text not null default 'open' check (registration_status in ('open', 'closed', 'sold_out', 'cancelled')),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (ends_at is null or ends_at >= starts_at),
  check (capacity is null or capacity >= 0)
);

create table public.accredited_organizations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  organization_name text not null,
  country_code text not null check (char_length(country_code) = 2),
  country_name text not null,
  organization_type text,
  programme text not null,
  certificate_number text unique,
  accreditation_scope text,
  issued_at date,
  expires_at date,
  accreditation_status text not null default 'active' check (accreditation_status in ('active', 'suspended', 'expired', 'withdrawn')),
  logo_path text,
  website_url text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (expires_at is null or issued_at is null or expires_at >= issued_at)
);

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  resource_type text not null default 'resource',
  summary text not null default '',
  description text not null default '',
  cover_image_path text,
  file_path text,
  external_url text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (file_path is not null or external_url is not null or status <> 'published')
);

create table public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  organization_name text not null,
  country text not null,
  organization_type text,
  full_name text not null,
  email text not null,
  phone text,
  message text not null,
  consent boolean not null check (consent = true),
  consent_at timestamptz not null default timezone('utc', now()),
  status text not null default 'new' check (status in ('new', 'in_progress', 'resolved', 'spam')),
  internal_notes text,
  assigned_to uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.people (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  credentials text,
  photo_path text,
  biography text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.person_assignments (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.people(id) on delete cascade,
  section text not null check (section in ('asia_office', 'country_director', 'regional_advisory_board', 'surveyor')),
  role_title text,
  organization_name text,
  member_code text,
  surveyor_specialty text check (surveyor_specialty is null or surveyor_specialty in ('clinical', 'governance', 'pe_specialist')),
  is_leadership boolean not null default false,
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (person_id, section, role_title)
);

create table public.person_assignment_countries (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.person_assignments(id) on delete cascade,
  country_code text not null check (char_length(country_code) = 2),
  country_name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  unique (assignment_id, country_code)
);

create index news_status_published_idx on public.news (status, published_at desc);
create index events_status_starts_idx on public.events (status, starts_at);
create index courses_status_title_idx on public.courses (status, title);
create index course_sessions_course_starts_idx on public.course_sessions (course_id, starts_at);
create index accredited_orgs_public_idx on public.accredited_organizations (status, country_code, organization_name);
create index resources_status_published_idx on public.resources (status, published_at desc);
create index consultation_requests_status_created_idx on public.consultation_requests (status, created_at desc);
create index people_status_name_idx on public.people (status, full_name);
create index person_assignments_section_order_idx on public.person_assignments (section, status, sort_order);
create index person_assignment_countries_assignment_idx on public.person_assignment_countries (assignment_id, sort_order);

create trigger admin_profiles_set_updated_at before update on public.admin_profiles for each row execute function public.set_updated_at();
create trigger news_set_updated_at before update on public.news for each row execute function public.set_updated_at();
create trigger events_set_updated_at before update on public.events for each row execute function public.set_updated_at();
create trigger courses_set_updated_at before update on public.courses for each row execute function public.set_updated_at();
create trigger course_sessions_set_updated_at before update on public.course_sessions for each row execute function public.set_updated_at();
create trigger accredited_organizations_set_updated_at before update on public.accredited_organizations for each row execute function public.set_updated_at();
create trigger resources_set_updated_at before update on public.resources for each row execute function public.set_updated_at();
create trigger consultation_requests_set_updated_at before update on public.consultation_requests for each row execute function public.set_updated_at();
create trigger people_set_updated_at before update on public.people for each row execute function public.set_updated_at();
create trigger person_assignments_set_updated_at before update on public.person_assignments for each row execute function public.set_updated_at();

alter table public.admin_profiles enable row level security;
alter table public.news enable row level security;
alter table public.events enable row level security;
alter table public.courses enable row level security;
alter table public.course_sessions enable row level security;
alter table public.accredited_organizations enable row level security;
alter table public.resources enable row level security;
alter table public.consultation_requests enable row level security;
alter table public.people enable row level security;
alter table public.person_assignments enable row level security;
alter table public.person_assignment_countries enable row level security;

create policy "Users can view their own CMS profile" on public.admin_profiles
for select to authenticated using (id = auth.uid() or public.is_cms_admin());
create policy "Admins can create CMS profiles" on public.admin_profiles
for insert to authenticated with check (public.is_cms_admin());
create policy "Admins can update CMS profiles" on public.admin_profiles
for update to authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());
create policy "Admins can delete CMS profiles" on public.admin_profiles
for delete to authenticated using (public.is_cms_admin());

create policy "Published news is public" on public.news for select to anon, authenticated using (status = 'published');
create policy "CMS users can view all news" on public.news for select to authenticated using (public.is_cms_user());
create policy "CMS users can create news" on public.news for insert to authenticated with check (public.is_cms_user() and (status <> 'published' or public.is_cms_admin()));
create policy "CMS users can update news" on public.news for update to authenticated using (public.is_cms_user()) with check (public.is_cms_user() and (status <> 'published' or public.is_cms_admin()));
create policy "Admins can delete news" on public.news for delete to authenticated using (public.is_cms_admin());

create policy "Published events are public" on public.events for select to anon, authenticated using (status = 'published');
create policy "CMS users can view all events" on public.events for select to authenticated using (public.is_cms_user());
create policy "CMS users can create events" on public.events for insert to authenticated with check (public.is_cms_user() and (status <> 'published' or public.is_cms_admin()));
create policy "CMS users can update events" on public.events for update to authenticated using (public.is_cms_user()) with check (public.is_cms_user() and (status <> 'published' or public.is_cms_admin()));
create policy "Admins can delete events" on public.events for delete to authenticated using (public.is_cms_admin());

create policy "Published courses are public" on public.courses for select to anon, authenticated using (status = 'published');
create policy "CMS users can view all courses" on public.courses for select to authenticated using (public.is_cms_user());
create policy "CMS users can create courses" on public.courses for insert to authenticated with check (public.is_cms_user() and (status <> 'published' or public.is_cms_admin()));
create policy "CMS users can update courses" on public.courses for update to authenticated using (public.is_cms_user()) with check (public.is_cms_user() and (status <> 'published' or public.is_cms_admin()));
create policy "Admins can delete courses" on public.courses for delete to authenticated using (public.is_cms_admin());

create policy "Published course sessions are public" on public.course_sessions for select to anon, authenticated
using (status = 'published' and exists (select 1 from public.courses where courses.id = course_sessions.course_id and courses.status = 'published'));
create policy "CMS users can view all course sessions" on public.course_sessions for select to authenticated using (public.is_cms_user());
create policy "CMS users can create course sessions" on public.course_sessions for insert to authenticated with check (public.is_cms_user() and (status <> 'published' or public.is_cms_admin()));
create policy "CMS users can update course sessions" on public.course_sessions for update to authenticated using (public.is_cms_user()) with check (public.is_cms_user() and (status <> 'published' or public.is_cms_admin()));
create policy "Admins can delete course sessions" on public.course_sessions for delete to authenticated using (public.is_cms_admin());

create policy "Published organizations are public" on public.accredited_organizations for select to anon, authenticated using (status = 'published');
create policy "CMS users can view all organizations" on public.accredited_organizations for select to authenticated using (public.is_cms_user());
create policy "CMS users can create organizations" on public.accredited_organizations for insert to authenticated with check (public.is_cms_user() and (status <> 'published' or public.is_cms_admin()));
create policy "CMS users can update organizations" on public.accredited_organizations for update to authenticated using (public.is_cms_user()) with check (public.is_cms_user() and (status <> 'published' or public.is_cms_admin()));
create policy "Admins can delete organizations" on public.accredited_organizations for delete to authenticated using (public.is_cms_admin());

create policy "Published resources are public" on public.resources for select to anon, authenticated using (status = 'published');
create policy "CMS users can view all resources" on public.resources for select to authenticated using (public.is_cms_user());
create policy "CMS users can create resources" on public.resources for insert to authenticated with check (public.is_cms_user() and (status <> 'published' or public.is_cms_admin()));
create policy "CMS users can update resources" on public.resources for update to authenticated using (public.is_cms_user()) with check (public.is_cms_user() and (status <> 'published' or public.is_cms_admin()));
create policy "Admins can delete resources" on public.resources for delete to authenticated using (public.is_cms_admin());

create policy "Anyone can submit a consultation request" on public.consultation_requests
for insert to anon, authenticated with check (consent = true and status = 'new' and internal_notes is null and assigned_to is null);
create policy "CMS users can view consultation requests" on public.consultation_requests for select to authenticated using (public.is_cms_user());
create policy "CMS users can update consultation requests" on public.consultation_requests for update to authenticated using (public.is_cms_user()) with check (public.is_cms_user());
create policy "Admins can delete consultation requests" on public.consultation_requests for delete to authenticated using (public.is_cms_admin());

create policy "Published people are public" on public.people for select to anon, authenticated using (status = 'published');
create policy "CMS users can view all people" on public.people for select to authenticated using (public.is_cms_user());
create policy "CMS users can create people" on public.people for insert to authenticated with check (public.is_cms_user() and (status <> 'published' or public.is_cms_admin()));
create policy "CMS users can update people" on public.people for update to authenticated using (public.is_cms_user()) with check (public.is_cms_user() and (status <> 'published' or public.is_cms_admin()));
create policy "Admins can delete people" on public.people for delete to authenticated using (public.is_cms_admin());

create policy "Published assignments are public" on public.person_assignments for select to anon, authenticated
using (status = 'published' and exists (select 1 from public.people where people.id = person_assignments.person_id and people.status = 'published'));
create policy "CMS users can view all assignments" on public.person_assignments for select to authenticated using (public.is_cms_user());
create policy "CMS users can create assignments" on public.person_assignments for insert to authenticated with check (public.is_cms_user() and (status <> 'published' or public.is_cms_admin()));
create policy "CMS users can update assignments" on public.person_assignments for update to authenticated using (public.is_cms_user()) with check (public.is_cms_user() and (status <> 'published' or public.is_cms_admin()));
create policy "Admins can delete assignments" on public.person_assignments for delete to authenticated using (public.is_cms_admin());

create policy "Published assignment countries are public" on public.person_assignment_countries for select to anon, authenticated
using (exists (
  select 1 from public.person_assignments
  join public.people on people.id = person_assignments.person_id
  where person_assignments.id = person_assignment_countries.assignment_id
    and person_assignments.status = 'published'
    and people.status = 'published'
));
create policy "CMS users can view all assignment countries" on public.person_assignment_countries for select to authenticated using (public.is_cms_user());
create policy "CMS users can create assignment countries" on public.person_assignment_countries for insert to authenticated with check (public.is_cms_user());
create policy "CMS users can update assignment countries" on public.person_assignment_countries for update to authenticated using (public.is_cms_user()) with check (public.is_cms_user());
create policy "Admins can delete assignment countries" on public.person_assignment_countries for delete to authenticated using (public.is_cms_admin());

grant usage on schema public to anon, authenticated;
grant execute on function public.is_cms_user() to anon, authenticated;
grant execute on function public.is_cms_admin() to anon, authenticated;

grant select on public.news, public.events, public.courses, public.course_sessions, public.accredited_organizations, public.resources, public.people, public.person_assignments, public.person_assignment_countries to anon, authenticated;
grant insert on public.consultation_requests to anon, authenticated;
grant select, insert, update, delete on public.admin_profiles, public.news, public.events, public.courses, public.course_sessions, public.accredited_organizations, public.resources, public.consultation_requests, public.people, public.person_assignments, public.person_assignment_countries to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cms-images', 'cms-images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cms-files', 'cms-files', true, 26214400, array['application/pdf'])
on conflict (id) do nothing;

create policy "Public can view CMS images" on storage.objects for select to anon, authenticated using (bucket_id = 'cms-images');
create policy "Public can view CMS files" on storage.objects for select to anon, authenticated using (bucket_id = 'cms-files');
create policy "CMS users can upload CMS assets" on storage.objects for insert to authenticated with check (bucket_id in ('cms-images', 'cms-files') and public.is_cms_user());
create policy "CMS users can update CMS assets" on storage.objects for update to authenticated using (bucket_id in ('cms-images', 'cms-files') and public.is_cms_user()) with check (bucket_id in ('cms-images', 'cms-files') and public.is_cms_user());
create policy "Admins can delete CMS assets" on storage.objects for delete to authenticated using (bucket_id in ('cms-images', 'cms-files') and public.is_cms_admin());

