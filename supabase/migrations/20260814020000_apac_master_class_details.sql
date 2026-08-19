-- Complete content for APAC Surveyor / Lead Surveyor Master Class 5.
-- This migration is idempotent and also updates a course seeded previously.
insert into public.courses (
  slug, title, category, summary, description, cover_image_path, duration_text,
  format_text, fee_amount, fee_currency, registration_url, status, published_at,
  sort_order, is_featured, accent_color, topics, early_bird_deadline,
  early_bird_discount_percent
)
values (
  'apac-surveyor-master-class-5',
  'APAC Surveyor / Lead Surveyor Master Class 5',
  'AACI Professional Training',
  'AACI invites healthcare professionals across the Asia-Pacific region to develop the essential knowledge and skills required to become an AACI Surveyor or Surveyor Team Leader.',
  $$Registration is Now Open!

AACI invites healthcare professionals across the Asia-Pacific region to join the APAC Surveyor / Lead Surveyor Master Class 5, an online professional training program designed to develop the essential knowledge and skills required to become an AACI Surveyor or Surveyor Team Leader.

The program focuses on the AACI International Accreditation Standards for Healthcare Organizations, helping participants strengthen their understanding of international healthcare accreditation, quality management, patient safety and survey practices.

COURSE DETAILS

Course: APAC Surveyor / Lead Surveyor Master Class 5
Training Period: 17 September – 5 November 2026
Schedule: Every Thursday
Time: 7:00 PM – 10:00 PM Bangkok Time (GMT+7)
Training Format: Online Training via Zoom
Registration Fee: USD 1,500

EARLY BIRD SPECIAL

Register by 15 August 2026 and receive 50% off the registration fee. Seats are limited, so early registration is highly recommended.

WHO SHOULD ATTEND?

This program is suitable for healthcare professionals interested in developing their knowledge and competencies in international healthcare accreditation, healthcare quality management, patient safety, accreditation survey methodology, healthcare organization assessment, surveyor professional skills and survey team leadership.

SECURE YOUR SPOT TODAY

Take the next step toward becoming an AACI Surveyor / Surveyor Team Leader and join a professional network committed to advancing healthcare quality and patient safety internationally. Limited seats are available.

For more information and registration: www.aacihealthcare.com

Organized by American Accreditation Commission International (AACI)

QUALITY • INTEGRITY • GLOBAL COLLABORATION$$,
  '/courses/apac-surveyor-lead-surveyor-master-class-5.webp',
  '17 September – 5 November 2026 · Every Thursday',
  'Online Training via Zoom',
  1500,
  'USD',
  'https://www.aacihealthcare.com',
  'published',
  timezone('utc', now()),
  1,
  true,
  '#c89b3c',
  array[
    'International Healthcare Accreditation',
    'Healthcare Quality Management',
    'Patient Safety',
    'Accreditation Survey Methodology',
    'Healthcare Organization Assessment',
    'Surveyor Professional Skills',
    'Survey Team Leadership'
  ],
  '2026-08-15',
  50
)
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  summary = excluded.summary,
  description = excluded.description,
  cover_image_path = excluded.cover_image_path,
  duration_text = excluded.duration_text,
  format_text = excluded.format_text,
  fee_amount = excluded.fee_amount,
  fee_currency = excluded.fee_currency,
  registration_url = excluded.registration_url,
  status = excluded.status,
  published_at = coalesce(public.courses.published_at, excluded.published_at),
  sort_order = excluded.sort_order,
  is_featured = excluded.is_featured,
  accent_color = excluded.accent_color,
  topics = excluded.topics,
  early_bird_deadline = excluded.early_bird_deadline,
  early_bird_discount_percent = excluded.early_bird_discount_percent,
  updated_at = timezone('utc', now());

with session_seed(starts_at, ends_at, session_order) as (
  values
    ('2026-09-17 12:00:00+00'::timestamptz, '2026-09-17 15:00:00+00'::timestamptz, 1),
    ('2026-09-24 12:00:00+00'::timestamptz, '2026-09-24 15:00:00+00'::timestamptz, 2),
    ('2026-10-01 12:00:00+00'::timestamptz, '2026-10-01 15:00:00+00'::timestamptz, 3),
    ('2026-10-08 12:00:00+00'::timestamptz, '2026-10-08 15:00:00+00'::timestamptz, 4),
    ('2026-10-15 12:00:00+00'::timestamptz, '2026-10-15 15:00:00+00'::timestamptz, 5),
    ('2026-10-22 12:00:00+00'::timestamptz, '2026-10-22 15:00:00+00'::timestamptz, 6),
    ('2026-10-29 12:00:00+00'::timestamptz, '2026-10-29 15:00:00+00'::timestamptz, 7),
    ('2026-11-05 12:00:00+00'::timestamptz, '2026-11-05 15:00:00+00'::timestamptz, 8)
)
insert into public.course_sessions (
  course_id, starts_at, ends_at, timezone, registration_url,
  registration_status, status, sort_order
)
select
  course.id, session_seed.starts_at, session_seed.ends_at, 'Asia/Bangkok',
  'https://www.aacihealthcare.com', 'open', 'published', session_seed.session_order
from session_seed
cross join public.courses course
where course.slug = 'apac-surveyor-master-class-5'
  and not exists (
    select 1
    from public.course_sessions existing
    where existing.course_id = course.id
      and existing.starts_at = session_seed.starts_at
  );

update public.course_sessions
set registration_url = 'https://www.aacihealthcare.com',
    registration_status = 'open',
    status = 'published',
    timezone = 'Asia/Bangkok',
    updated_at = timezone('utc', now())
where course_id = (
  select id from public.courses where slug = 'apac-surveyor-master-class-5'
);
