alter table public.news
add column if not exists content_images jsonb not null default '[]'::jsonb;

alter table public.news
drop constraint if exists news_content_images_is_array;

alter table public.news
add constraint news_content_images_is_array
check (jsonb_typeof(content_images) = 'array');

comment on column public.news.content_images is
'Ordered supporting images: path, alt_text, caption, after_paragraph.';
