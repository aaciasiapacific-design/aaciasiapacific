-- Course-management fields used by the AACI Academy admin and public directory.
alter table public.courses
  add column if not exists sort_order integer not null default 0,
  add column if not exists is_featured boolean not null default false,
  add column if not exists accent_color text not null default '#173d69',
  add column if not exists topics text[] not null default '{}',
  add column if not exists early_bird_deadline date,
  add column if not exists early_bird_discount_percent integer;

alter table public.courses
  drop constraint if exists courses_early_bird_discount_percent_check;
alter table public.courses
  add constraint courses_early_bird_discount_percent_check
  check (early_bird_discount_percent is null or early_bird_discount_percent between 1 and 100);

create index if not exists courses_public_order_idx
  on public.courses (status, sort_order, published_at desc);
create index if not exists course_sessions_course_order_idx
  on public.course_sessions (course_id, sort_order, starts_at);

-- Editors may edit already-published courses and sessions, but only admins may
-- publish previously unpublished content or delete an entire course.
create or replace function public.can_save_course_status(course_id uuid, next_status text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_cms_admin()
    or next_status <> 'published'
    or exists (select 1 from public.courses where id = course_id and status = 'published');
$$;

create or replace function public.can_save_course_session_status(session_id uuid, next_status text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_cms_admin()
    or next_status <> 'published'
    or exists (select 1 from public.course_sessions where id = session_id and status = 'published');
$$;

drop policy if exists "CMS users can update courses" on public.courses;
create policy "CMS users can update courses" on public.courses
for update to authenticated
using (public.is_cms_user())
with check (public.is_cms_user() and public.can_save_course_status(id, status));

drop policy if exists "CMS users can update course sessions" on public.course_sessions;
create policy "CMS users can update course sessions" on public.course_sessions
for update to authenticated
using (public.is_cms_user())
with check (public.is_cms_user() and public.can_save_course_session_status(id, status));

grant execute on function public.can_save_course_status(uuid, text) to authenticated;
grant execute on function public.can_save_course_session_status(uuid, text) to authenticated;

-- Seed the seven programmes currently displayed on the public Courses page.
insert into public.courses
  (slug, title, category, summary, description, cover_image_path, duration_text,
   format_text, fee_amount, fee_currency, registration_url, status, published_at,
   sort_order, is_featured, accent_color, topics, early_bird_deadline,
   early_bird_discount_percent)
values
  ('apac-surveyor-master-class-5', 'APAC Surveyor / Lead Surveyor Master Class 5',
   'AACI Professional Training',
   'Develop the knowledge and professional skills required to become an AACI Surveyor or Surveyor Team Leader, based on the AACI International Accreditation Standards for Healthcare Organizations.',
   'AACI invites healthcare professionals across Asia Pacific to strengthen their knowledge of international healthcare accreditation, quality management, patient safety, survey methodology, organizational assessment and survey team leadership.',
   '/courses/apac-surveyor-lead-surveyor-master-class-5.webp',
   '17 September – 5 November 2026 · Every Thursday', 'Online training via Zoom',
   1500, 'USD', 'https://www.aacihealthcare.com', 'published', timezone('utc', now()),
   1, true, '#c89b3c', array['Healthcare Accreditation','Quality Management','Patient Safety','Survey Methodology','Team Leadership'], '2026-08-15', 50),
  ('oncology-services', 'Clinical Excellence Certification for Oncology Services', 'Oncology Services',
   'Practical education for stronger oncology quality systems and safer patient-centred care.', '',
   '/healthcare-accreditation-team.png', '5 Aug · 5 Sep · 5 Oct · 5 Nov · 5 Dec 2026',
   'Live online training', 200, 'USD', '/accreditation/request', 'published', timezone('utc', now()), 2, false, '#c58518', '{}', null, null),
  ('endoscopy-services', 'Clinical Excellence Certification for Endoscopy Services', 'Endoscopy Services',
   'Practical education for safe, reliable and high-quality endoscopy services.', '',
   '/endoscopy-safety-huddle.png', '10 Aug · 10 Sep · 10 Oct · 10 Nov · 10 Dec 2026',
   'Live online training', 200, 'USD', '/accreditation/request', 'published', timezone('utc', now()), 3, false, '#c62626', '{}', null, null),
  ('maternity-services', 'Clinical Excellence Certification for Maternity Services', 'Maternity Services',
   'Practical education for safer and more coordinated maternity care.', '',
   '/aaci-academy-overview.jpg', '20 Aug · 20 Sep · 20 Oct · 20 Nov · 20 Dec 2026',
   'Live online training', 200, 'USD', '/accreditation/request', 'published', timezone('utc', now()), 4, false, '#c58518', '{}', null, null),
  ('risk-register', 'Tips, Techniques & Tools for Enterprise Risk Management', 'Risk Register',
   'Build practical capability for enterprise risk identification, assessment and improvement.', '',
   '/management-quality-review.png', '25 Aug · 25 Sep · 25 Oct · 25 Nov · 25 Dec 2026',
   'Live online training', 200, 'USD', '/accreditation/request', 'published', timezone('utc', now()), 5, false, '#173d69', '{}', null, null),
  ('acute-stroke-care', 'Clinical Excellence Certification for Acute Stroke Care', 'Acute Stroke Care',
   'Practical education for faster, safer and more coordinated stroke care.', '',
   '/acute-stroke-team.png', '27 Aug · 27 Sep · 27 Oct · 27 Nov · 27 Dec 2026',
   'Live online training', 200, 'USD', '/accreditation/request', 'published', timezone('utc', now()), 6, false, '#b22222', '{}', null, null),
  ('survey-readiness', 'Assessment Process and Survey Methodology for AACI International Standards Version 6.4 including IPS', 'Survey-Readiness',
   'Prepare teams for the AACI assessment process and survey methodology.', '',
   '/healthcare-accreditation-rounds.png', '30 Aug · 30 Sep · 30 Oct · 30 Nov · 30 Dec 2026',
   'Live online training', 200, 'USD', '/accreditation/request', 'published', timezone('utc', now()), 7, false, '#173d69', '{}', null, null)
on conflict (slug) do nothing;

with session_seed(slug, starts_at, ends_at, session_order) as (
  values
    ('apac-surveyor-master-class-5', '2026-09-17 12:00:00+00'::timestamptz, '2026-09-17 15:00:00+00'::timestamptz, 1),
    ('apac-surveyor-master-class-5', '2026-09-24 12:00:00+00'::timestamptz, '2026-09-24 15:00:00+00'::timestamptz, 2),
    ('apac-surveyor-master-class-5', '2026-10-01 12:00:00+00'::timestamptz, '2026-10-01 15:00:00+00'::timestamptz, 3),
    ('apac-surveyor-master-class-5', '2026-10-08 12:00:00+00'::timestamptz, '2026-10-08 15:00:00+00'::timestamptz, 4),
    ('apac-surveyor-master-class-5', '2026-10-15 12:00:00+00'::timestamptz, '2026-10-15 15:00:00+00'::timestamptz, 5),
    ('apac-surveyor-master-class-5', '2026-10-22 12:00:00+00'::timestamptz, '2026-10-22 15:00:00+00'::timestamptz, 6),
    ('apac-surveyor-master-class-5', '2026-10-29 12:00:00+00'::timestamptz, '2026-10-29 15:00:00+00'::timestamptz, 7),
    ('apac-surveyor-master-class-5', '2026-11-05 12:00:00+00'::timestamptz, '2026-11-05 15:00:00+00'::timestamptz, 8),
    ('oncology-services', '2026-08-05 12:00:00+00'::timestamptz, '2026-08-05 15:00:00+00'::timestamptz, 1),
    ('oncology-services', '2026-09-05 12:00:00+00'::timestamptz, '2026-09-05 15:00:00+00'::timestamptz, 2),
    ('oncology-services', '2026-10-05 12:00:00+00'::timestamptz, '2026-10-05 15:00:00+00'::timestamptz, 3),
    ('oncology-services', '2026-11-05 12:00:00+00'::timestamptz, '2026-11-05 15:00:00+00'::timestamptz, 4),
    ('oncology-services', '2026-12-05 12:00:00+00'::timestamptz, '2026-12-05 15:00:00+00'::timestamptz, 5),
    ('endoscopy-services', '2026-08-10 12:00:00+00'::timestamptz, '2026-08-10 15:00:00+00'::timestamptz, 1),
    ('endoscopy-services', '2026-09-10 12:00:00+00'::timestamptz, '2026-09-10 15:00:00+00'::timestamptz, 2),
    ('endoscopy-services', '2026-10-10 12:00:00+00'::timestamptz, '2026-10-10 15:00:00+00'::timestamptz, 3),
    ('endoscopy-services', '2026-11-10 12:00:00+00'::timestamptz, '2026-11-10 15:00:00+00'::timestamptz, 4),
    ('endoscopy-services', '2026-12-10 12:00:00+00'::timestamptz, '2026-12-10 15:00:00+00'::timestamptz, 5),
    ('maternity-services', '2026-08-20 12:00:00+00'::timestamptz, '2026-08-20 15:00:00+00'::timestamptz, 1),
    ('maternity-services', '2026-09-20 12:00:00+00'::timestamptz, '2026-09-20 15:00:00+00'::timestamptz, 2),
    ('maternity-services', '2026-10-20 12:00:00+00'::timestamptz, '2026-10-20 15:00:00+00'::timestamptz, 3),
    ('maternity-services', '2026-11-20 12:00:00+00'::timestamptz, '2026-11-20 15:00:00+00'::timestamptz, 4),
    ('maternity-services', '2026-12-20 12:00:00+00'::timestamptz, '2026-12-20 15:00:00+00'::timestamptz, 5),
    ('risk-register', '2026-08-25 12:00:00+00'::timestamptz, '2026-08-25 15:00:00+00'::timestamptz, 1),
    ('risk-register', '2026-09-25 12:00:00+00'::timestamptz, '2026-09-25 15:00:00+00'::timestamptz, 2),
    ('risk-register', '2026-10-25 12:00:00+00'::timestamptz, '2026-10-25 15:00:00+00'::timestamptz, 3),
    ('risk-register', '2026-11-25 12:00:00+00'::timestamptz, '2026-11-25 15:00:00+00'::timestamptz, 4),
    ('risk-register', '2026-12-25 12:00:00+00'::timestamptz, '2026-12-25 15:00:00+00'::timestamptz, 5),
    ('acute-stroke-care', '2026-08-27 12:00:00+00'::timestamptz, '2026-08-27 15:00:00+00'::timestamptz, 1),
    ('acute-stroke-care', '2026-09-27 12:00:00+00'::timestamptz, '2026-09-27 15:00:00+00'::timestamptz, 2),
    ('acute-stroke-care', '2026-10-27 12:00:00+00'::timestamptz, '2026-10-27 15:00:00+00'::timestamptz, 3),
    ('acute-stroke-care', '2026-11-27 12:00:00+00'::timestamptz, '2026-11-27 15:00:00+00'::timestamptz, 4),
    ('acute-stroke-care', '2026-12-27 12:00:00+00'::timestamptz, '2026-12-27 15:00:00+00'::timestamptz, 5),
    ('survey-readiness', '2026-08-30 12:00:00+00'::timestamptz, '2026-08-30 15:00:00+00'::timestamptz, 1),
    ('survey-readiness', '2026-09-30 12:00:00+00'::timestamptz, '2026-09-30 15:00:00+00'::timestamptz, 2),
    ('survey-readiness', '2026-10-30 12:00:00+00'::timestamptz, '2026-10-30 15:00:00+00'::timestamptz, 3),
    ('survey-readiness', '2026-11-30 12:00:00+00'::timestamptz, '2026-11-30 15:00:00+00'::timestamptz, 4),
    ('survey-readiness', '2026-12-30 12:00:00+00'::timestamptz, '2026-12-30 15:00:00+00'::timestamptz, 5)
)
insert into public.course_sessions
  (course_id, starts_at, ends_at, timezone, registration_url, registration_status,
   status, sort_order)
select c.id, s.starts_at, s.ends_at, 'Asia/Bangkok', c.registration_url, 'open',
       'published', s.session_order
from session_seed s
join public.courses c on c.slug = s.slug
where not exists (
  select 1 from public.course_sessions existing
  where existing.course_id = c.id and existing.starts_at = s.starts_at
);
