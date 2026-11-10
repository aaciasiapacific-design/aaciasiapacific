-- Point every registration entry for APAC Surveyor / Lead Surveyor Master Class 5
-- to the current Google Forms registration page.
update public.courses
set registration_url = 'https://forms.gle/pAkMJCF4AnKQ4djM9',
    updated_at = timezone('utc', now())
where slug = 'apac-surveyor-master-class-5';

update public.course_sessions
set registration_url = 'https://forms.gle/pAkMJCF4AnKQ4djM9',
    updated_at = timezone('utc', now())
where course_id = (
  select id
  from public.courses
  where slug = 'apac-surveyor-master-class-5'
);
