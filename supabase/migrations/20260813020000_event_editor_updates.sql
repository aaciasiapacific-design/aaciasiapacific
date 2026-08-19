-- Editors may update an event that is already published, but cannot publish
-- a draft or archived event. Administrators retain full publishing control.
create or replace function public.can_save_event_status(event_id uuid, next_status text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_cms_admin()
    or next_status <> 'published'
    or exists (
      select 1 from public.events
      where id = event_id and status = 'published'
    );
$$;

drop policy if exists "CMS users can update events" on public.events;
create policy "CMS users can update events" on public.events
for update to authenticated
using (public.is_cms_user())
with check (public.is_cms_user() and public.can_save_event_status(id, status));

grant execute on function public.can_save_event_status(uuid, text) to authenticated;
