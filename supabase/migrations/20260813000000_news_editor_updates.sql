-- Editors may update an already-published article, but cannot publish a draft
-- or archived article. Administrators retain full publishing control.
create or replace function public.can_save_news_status(news_id uuid, next_status text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_cms_admin()
    or next_status <> 'published'
    or exists (
      select 1 from public.news
      where id = news_id and status = 'published'
    );
$$;

drop policy if exists "CMS users can update news" on public.news;
create policy "CMS users can update news" on public.news
for update to authenticated
using (public.is_cms_user())
with check (public.is_cms_user() and public.can_save_news_status(id, status));

grant execute on function public.can_save_news_status(uuid, text) to authenticated;
