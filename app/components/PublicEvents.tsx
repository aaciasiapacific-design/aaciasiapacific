"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarDays, Clock3, ExternalLink, MapPin, Monitor } from "lucide-react";
import { getSupabaseBrowserClient } from "../../lib/supabase/client";
import { EVENT_MODE_LABELS, EventRecord, eventDateParts, formatEventDate, formatEventSchedule, getEventImageUrl } from "../../lib/events";

const EVENT_SELECT = "id, slug, title, summary, description, cover_image_path, starts_at, ends_at, timezone, is_all_day, mode, location, registration_url, status, published_at, created_at, updated_at";

export function PublicEventFeed() {
  const [now] = useState(() => Date.now());
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    getSupabaseBrowserClient().from("events").select(EVENT_SELECT).eq("status", "published").order("starts_at", { ascending: true }).then(({ data, error: queryError }) => {
      if (!active) return;
      setEvents((data ?? []) as EventRecord[]); setError(Boolean(queryError)); setLoading(false);
    });
    return () => { active = false; };
  }, []);

  if (loading) return <div className="people-public-state" role="status">Loading events…</div>;
  if (error) return <div className="people-public-state people-public-state--error" role="alert">We could not load the events. Please try again shortly.</div>;
  if (!events.length) return <div className="people-public-state"><CalendarDays size={32} strokeWidth={1.5} /><h2>New events are on their way.</h2><p>Please contact our team to learn about current education and engagement opportunities.</p></div>;

  const upcoming = events.filter((item) => new Date(item.ends_at ?? item.starts_at).getTime() >= now);
  const past = events.filter((item) => new Date(item.ends_at ?? item.starts_at).getTime() < now).reverse();
  return <>{upcoming.length > 0 && <EventSection eyebrow="UPCOMING EVENTS" title="Join our next learning experience" events={upcoming} />}{past.length > 0 && <EventSection eyebrow="PAST EVENTS" title="Previous AACI events" events={past} past />}</>;
}

function EventSection({ eyebrow, title, events, past = false }: { eyebrow: string; title: string; events: EventRecord[]; past?: boolean }) {
  return <section className={`public-event-section${past ? " public-event-section--past" : ""}`}><header><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></header><div className="public-event-grid">{events.map((event) => {
    const image = getEventImageUrl(event.cover_image_path); const date = eventDateParts(event.starts_at, event.timezone);
    return <article className="public-event-card" key={event.id}><Link className="public-event-card__image" href={`/events/${event.slug}`}>{image ? <img src={image} alt="" /> : <CalendarDays size={44} strokeWidth={1.3} />}<span className="date"><b>{date.day}</b><span>{date.month}</span></span></Link><div className="public-event-card__body"><p className="card-category">{EVENT_MODE_LABELS[event.mode]}</p><h3><Link href={`/events/${event.slug}`}>{event.title}</Link></h3><p>{event.summary}</p><div className="public-event-card__meta"><span><Clock3 size={14} />{formatEventSchedule(event)}</span>{event.location && <span><MapPin size={14} />{event.location}</span>}</div><Link className="text-link" href={`/events/${event.slug}`}>View event <b>→</b></Link></div></article>;
  })}</div></section>;
}

export function PublicEventDetail({ slug }: { slug: string }) {
  const [event, setEvent] = useState<EventRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => { let active = true; getSupabaseBrowserClient().from("events").select(EVENT_SELECT).eq("slug", slug).eq("status", "published").maybeSingle().then(({ data, error: queryError }) => { if (!active) return; setEvent((data as EventRecord | null) ?? null); setError(Boolean(queryError)); setLoading(false); }); return () => { active = false; }; }, [slug]);
  if (loading) return <div className="people-public-state" role="status">Loading event…</div>;
  if (error || !event) return <div className="people-public-state people-public-state--error" role="alert">This event is unavailable or has not been published.</div>;
  const image = getEventImageUrl(event.cover_image_path);
  return <div className="event-detail-layout"><article className="news-detail event-detail"><header><p className="eyebrow">{EVENT_MODE_LABELS[event.mode]} EVENT</p><h1>{event.title}</h1><p className="news-detail__summary">{event.summary}</p></header>{image && <img className="news-detail__cover" src={image} alt={event.title} />}<div className="news-detail__content">{event.description.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div><Link className="text-link" href="/events">← Back to all events</Link></article><aside className="event-sidebar"><section><p className="eyebrow">EVENT DETAILS</p><h2>Plan your attendance</h2><dl>{event.is_all_day ? <div><dt><CalendarDays size={17} />Dates</dt><dd>{formatEventSchedule(event)}</dd></div> : <><div><dt><CalendarDays size={17} />Starts</dt><dd>{formatEventDate(event.starts_at, event.timezone)}</dd></div>{event.ends_at && <div><dt><Clock3 size={17} />Ends</dt><dd>{formatEventDate(event.ends_at, event.timezone)}</dd></div>}</>}<div><dt><Monitor size={17} />Format</dt><dd>{EVENT_MODE_LABELS[event.mode]}</dd></div>{event.location && <div><dt><MapPin size={17} />Location</dt><dd>{event.location}</dd></div>}</dl>{event.registration_url ? <a className="button button-red" href={event.registration_url} target="_blank" rel="noreferrer">Register now <ExternalLink size={16} /></a> : <p className="event-sidebar__note">Registration details will be announced soon.</p>}</section></aside></div>;
}
