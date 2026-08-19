"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { getSupabaseBrowserClient } from "../../lib/supabase/client";
import { formatNewsDate, getNewsImageUrl, newsDateParts, NewsRecord } from "../../lib/news";

const NEWS_SELECT = "id, slug, title, category, summary, content, cover_image_path, content_images, author_name, status, published_at, created_at, updated_at";

export function PublicNewsFeed({ limit, home = false }: { limit?: number; home?: boolean }) {
  const [articles, setArticles] = useState<NewsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      let query = getSupabaseBrowserClient().from("news").select(NEWS_SELECT).eq("status", "published").order("published_at", { ascending: false }).order("created_at", { ascending: false });
      if (limit) query = query.limit(limit);
      const { data, error: queryError } = await query;
      if (!active) return;
      setArticles((data ?? []) as NewsRecord[]);
      setError(Boolean(queryError));
      setLoading(false);
    }
    load();
    return () => { active = false; };
  }, [limit]);

  if (loading) return <div className="people-public-state" role="status">Loading news…</div>;
  if (error) return <div className="people-public-state people-public-state--error" role="alert">We could not load the latest news. Please try again shortly.</div>;
  if (!articles.length) return <div className="people-public-state">News and insights will be published here soon.</div>;

  return <div className={home ? "news-grid" : "public-news-grid"}>{articles.map((article) => {
    const image = getNewsImageUrl(article.cover_image_path);
    const date = newsDateParts(article.published_at);
    return <article className={home ? "news-card public-news-card" : "public-news-card"} key={article.id}>
      <Link className="public-news-card__image" href={`/news/${article.slug}`} aria-label={`Read ${article.title}`}>
        {image ? <img src={image} alt="" /> : <span aria-hidden="true">AACI</span>}
        <span className="date"><b>{date.day}</b><span>{date.month}</span></span>
      </Link>
      <div className="public-news-card__body"><p className="card-category">{article.category}</p><h3>{article.title}</h3><p>{article.summary}</p><Link className="text-link" href={`/news/${article.slug}`}>Read more <b>→</b></Link></div>
    </article>;
  })}</div>;
}

export function PublicNewsArticle({ slug }: { slug: string }) {
  const [article, setArticle] = useState<NewsRecord | null>(null);
  const [related, setRelated] = useState<NewsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    const supabase = getSupabaseBrowserClient();
    supabase.from("news").select(NEWS_SELECT).eq("slug", slug).eq("status", "published").maybeSingle().then(async ({ data, error: queryError }) => {
      if (!active) return;
      const currentArticle = (data as NewsRecord | null) ?? null;
      setArticle(currentArticle);
      setError(Boolean(queryError));
      setLoading(false);
      if (!currentArticle) { setRelatedLoading(false); return; }
      const { data: relatedData } = await supabase.from("news").select(NEWS_SELECT).eq("status", "published").neq("id", currentArticle.id).order("published_at", { ascending: false }).limit(8);
      if (!active) return;
      const candidates = (relatedData ?? []) as NewsRecord[];
      setRelated([...candidates.filter((item) => item.category === currentArticle.category), ...candidates.filter((item) => item.category !== currentArticle.category)].slice(0, 3));
      setRelatedLoading(false);
    });
    return () => { active = false; };
  }, [slug]);

  if (loading) return <div className="people-public-state" role="status">Loading article…</div>;
  if (error || !article) return <div className="people-public-state people-public-state--error" role="alert">This article is unavailable or has not been published.</div>;
  const image = getNewsImageUrl(article.cover_image_path);
  const paragraphs = article.content.split(/\n\s*\n/).filter(Boolean);
  const supportingImages = Array.isArray(article.content_images) ? article.content_images : [];
  return <div className="news-detail-layout"><article className="news-detail">
      <header><p className="eyebrow">{article.category}</p><h1>{article.title}</h1><p className="news-detail__meta">{formatNewsDate(article.published_at)}{article.author_name ? ` · By ${article.author_name}` : ""}</p><p className="news-detail__summary">{article.summary}</p></header>
      {image && <img className="news-detail__cover" src={image} alt={article.title} />}
      <div className="news-detail__content">{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
      {supportingImages.length > 0 && <section className={`news-gallery news-gallery--${Math.min(supportingImages.length, 4)}`} aria-labelledby="news-gallery-title"><header><p className="eyebrow">PHOTO GALLERY</p><h2 id="news-gallery-title">Inside the story</h2><span>{supportingImages.length} {supportingImages.length === 1 ? "image" : "images"}</span></header><div className="news-gallery__grid">{supportingImages.map((item, index) => <figure className={index === 0 && supportingImages.length > 2 ? "news-gallery__item news-gallery__item--featured" : "news-gallery__item"} key={`${item.path}-${index}`}><button type="button" onClick={() => setSelectedImage(index)} aria-label={`Open image ${index + 1}${item.caption ? `: ${item.caption}` : ""}`}><img src={getNewsImageUrl(item.path) ?? ""} alt={item.alt_text} /><span className="news-gallery__expand"><Expand size={17} /> View</span></button>{item.caption && <figcaption>{item.caption}</figcaption>}</figure>)}</div></section>}
      <Link className="text-link" href="/news">← Back to all news</Link>
    </article>
    <aside className="news-sidebar" aria-label="Related news and useful links">
      <section className="news-sidebar__section"><p className="eyebrow">KEEP READING</p><h2>Related news</h2>
        {relatedLoading ? <p className="news-sidebar__state">Loading related news…</p> : related.length ? <div className="news-sidebar__list">{related.map((item) => {
          const relatedImage = getNewsImageUrl(item.cover_image_path);
          return <Link href={`/news/${item.slug}`} className="news-sidebar__item" key={item.id}><span className="news-sidebar__image">{relatedImage ? <img src={relatedImage} alt="" /> : <span>AACI</span>}</span><span><small>{item.category} · {formatNewsDate(item.published_at)}</small><strong>{item.title}</strong></span></Link>;
        })}</div> : <p className="news-sidebar__state">More AACI news will be added soon.</p>}
        <Link className="news-sidebar__all" href="/news">View all news <span>→</span></Link>
      </section>
      <section className="news-sidebar__explore"><p className="eyebrow">EXPLORE AACI</p><h2>Continue exploring</h2><nav><Link href="/services">Services and programmes <span>→</span></Link><Link href="/events">Upcoming events <span>→</span></Link><Link href="/resources">Resources <span>→</span></Link></nav></section>
    </aside>
    {selectedImage !== null && supportingImages[selectedImage] && <div className="news-lightbox" role="dialog" aria-modal="true" aria-label="News image gallery" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedImage(null); }} onKeyDown={(event) => { if (event.key === "Escape") setSelectedImage(null); }} tabIndex={-1}><button className="news-lightbox__close" type="button" aria-label="Close gallery" onClick={() => setSelectedImage(null)}><X size={24} /></button>{supportingImages.length > 1 && <button className="news-lightbox__previous" type="button" aria-label="Previous image" onClick={() => setSelectedImage((selectedImage - 1 + supportingImages.length) % supportingImages.length)}><ChevronLeft size={28} /></button>}<figure><img src={getNewsImageUrl(supportingImages[selectedImage].path) ?? ""} alt={supportingImages[selectedImage].alt_text} />{supportingImages[selectedImage].caption && <figcaption>{supportingImages[selectedImage].caption}</figcaption>}<small>{selectedImage + 1} / {supportingImages.length}</small></figure>{supportingImages.length > 1 && <button className="news-lightbox__next" type="button" aria-label="Next image" onClick={() => setSelectedImage((selectedImage + 1) % supportingImages.length)}><ChevronRight size={28} /></button>}</div>}
  </div>;
}
