alter table public.events
add column if not exists is_all_day boolean not null default false;

insert into public.events (
  slug,
  title,
  summary,
  description,
  cover_image_path,
  starts_at,
  ends_at,
  timezone,
  is_all_day,
  mode,
  location,
  registration_url,
  status,
  published_at
)
values (
  'hospital-management-asia-2026',
  'AACI Asia Pacific at Hospital Management Asia 2026',
  'AACI Asia Pacific welcomes Mr. Kreso Paliska and Dr. Somporn Kumphong to Hospital Management Asia 2026 in Bangkok.',
  E'AACI Asia Pacific is honored to welcome Mr. Kreso Paliska, Executive SVP & Group CEO of AACI America, to Bangkok, Thailand.\n\nMr. Paliska will participate in Hospital Management Asia 2026, taking place in Bangkok on 2–3 September 2026.\n\nIn addition, AACI Asia Pacific is pleased to highlight the participation of Dr. Somporn Kumphong, Chairman of the Board of Directors and CEO of AACI Asia Pacific, who will also be contributing to the program and engaging with healthcare leaders during this important international gathering.\n\nThis important event brings together hospital leaders, healthcare professionals, and industry experts to exchange insights, strengthen international collaboration, and explore new approaches to quality, innovation, patient safety, and sustainable healthcare excellence.\n\nWe look forward to welcoming Mr. Paliska, Dr. Somporn Kumphong, and connecting with healthcare leaders from across the region at HMA 2026.',
  '/events/hospital-management-asia-2026.jpg',
  '2026-09-02 00:00:00+07',
  '2026-09-03 23:59:59+07',
  'Asia/Bangkok',
  true,
  'onsite',
  'Queen Sirikit National Convention Center, Bangkok, Thailand',
  null,
  'published',
  now()
)
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  cover_image_path = excluded.cover_image_path,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  timezone = excluded.timezone,
  is_all_day = excluded.is_all_day,
  mode = excluded.mode,
  location = excluded.location,
  registration_url = excluded.registration_url,
  status = excluded.status,
  published_at = coalesce(public.events.published_at, excluded.published_at),
  updated_at = now();
