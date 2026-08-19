-- Accredited Organizations directory fields and editor permissions.
alter table public.accredited_organizations
  add column if not exists city text,
  add column if not exists address text,
  add column if not exists summary text not null default '',
  add column if not exists sort_order integer not null default 0;

create index if not exists accredited_organizations_directory_order_idx
  on public.accredited_organizations (status, sort_order, organization_name);

create or replace function public.can_save_organization_status(organization_id uuid, next_status text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_cms_admin()
    or next_status <> 'published'
    or exists (
      select 1 from public.accredited_organizations
      where id = organization_id and status = 'published'
    );
$$;

drop policy if exists "CMS users can update organizations" on public.accredited_organizations;
create policy "CMS users can update organizations" on public.accredited_organizations
for update to authenticated
using (public.is_cms_user())
with check (public.is_cms_user() and public.can_save_organization_status(id, status));

grant execute on function public.can_save_organization_status(uuid, text) to authenticated;
