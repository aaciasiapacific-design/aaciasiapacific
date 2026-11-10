"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BadgeDollarSign, CalendarDays, ClipboardCheck, Clock3, ExternalLink, Gift, GraduationCap, Mail, Monitor, Phone, ShieldCheck, Users, UsersRound } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { getSupabaseBrowserClient } from "../../lib/supabase/client";
import { CourseRecord, REGISTRATION_STATUS_LABELS, formatCourseFee, formatSessionDate, getCourseImageUrl } from "../../lib/courses";
import { FEATURED_COURSES, LANGUAGE_CONTACTS, UPCOMING_COURSES } from "../../lib/featured-courses";
import { CourseCountdown } from "./CourseCountdown";

const COURSE_SELECT = "id, slug, title, category, summary, description, cover_image_path, duration_text, format_text, fee_amount, fee_currency, registration_url, status, published_at, sort_order, is_featured, accent_color, topics, early_bird_deadline, early_bird_discount_percent, created_at, updated_at, course_sessions(id, course_id, starts_at, ends_at, timezone, capacity, registration_deadline, registration_url, registration_status, status, sort_order, created_at, updated_at)";
const PUBLIC_SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";

function RegistrationLink({ url, label }: { url: string | null; label: string }) {
  if (!url) return <Link className="text-link" href="/accreditation/request">{label} <b>→</b></Link>;
  if (url.startsWith("/")) return <Link className="text-link" href={url}>{label} <b>→</b></Link>;
  return <a className="text-link" href={url} target="_blank" rel="noreferrer">{label} <b>→</b></a>;
}

function scheduleText(course: CourseRecord) {
  if (course.duration_text) return course.duration_text;
  const sessions = course.course_sessions ?? [];
  if (!sessions.length) return "Schedule to be announced";
  if (sessions.length === 1) return formatSessionDate(sessions[0].starts_at, sessions[0].timezone);
  return `${formatSessionDate(sessions[0].starts_at, sessions[0].timezone)} · ${sessions.length} sessions`;
}

function sessionTime(course: CourseRecord) {
  const session = course.course_sessions?.[0];
  if (!session) return "See schedule";
  const format = (value: string) => new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: session.timezone }).format(new Date(value));
  return session.ends_at ? `${format(session.starts_at)} – ${format(session.ends_at)}` : format(session.starts_at);
}

function FeaturedCourseIcon({ slug }: { slug: string }) {
  if (slug === "apac-surveyor-master-class-5") return <UsersRound size={22} strokeWidth={1.9} aria-hidden="true" />;
  if (slug === "surveyor-lead-surveyor-master-class-15") return <ClipboardCheck size={22} strokeWidth={1.9} aria-hidden="true" />;
  return <ShieldCheck size={22} strokeWidth={1.9} aria-hidden="true" />;
}

function CourseRegistrationPanel({ course, capacity, registrationUrl, origin, titleId }: { course: CourseRecord; capacity: number; registrationUrl: string | null; origin: string; titleId: string }) {
  const discount = course.early_bird_discount_percent ?? 20;
  const registrationTarget = registrationUrl ?? "/accreditation/request";
  const registrationQrValue = registrationTarget.startsWith("http") || !origin ? registrationTarget : `${origin}${registrationTarget}`;
  return <section className="container course-registration-panel" aria-labelledby={titleId}><div className="course-registration-panel__promos"><article className="course-registration-promo course-registration-promo--seats"><Users size={42} strokeWidth={1.7} /><div><p>LIMITED SEATS</p><h2 id={titleId}>Only {capacity} participants</h2><span>per class · First come, first served</span></div></article><article className="course-registration-promo course-registration-promo--early"><Gift size={42} strokeWidth={1.7} /><div><p>EARLY BIRD PROMOTION</p><h2>{discount}% OFF</h2><span>{course.early_bird_deadline ? `Register by ${new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${course.early_bird_deadline}T00:00:00Z`))}` : "Register at least 30 days before class"}</span></div></article><article className="course-registration-promo course-registration-promo--scan"><div><p>SCAN TO REGISTER</p><RegistrationLink url={registrationUrl} label="Register online" /></div><a href={registrationTarget} aria-label={`Register for ${course.title}`} target={registrationTarget.startsWith("http") ? "_blank" : undefined} rel={registrationTarget.startsWith("http") ? "noreferrer" : undefined}><QRCodeSVG value={registrationQrValue} size={104} level="M" bgColor="#ffffff" fgColor="#071f37" /></a></article></div><div className="course-registration-contact"><header><p className="eyebrow">CONTACT INFORMATION</p><h2>We’re here to help you register.</h2></header><div><article><Users size={24} /><p><strong>Mr. Nirachit Rerngsangvatana</strong><span>AACI Asia Pacific Office</span></p></article><a href="tel:+66852296651"><Phone size={24} /><p><strong>Mobile / WhatsApp</strong><span>+66 85 229 6651</span></p></a><a href="mailto:nirachit.rerngsangvatana@aacihealthcare.com"><Mail size={24} /><p><strong>Email</strong><span>nirachit.rerngsangvatana@aacihealthcare.com</span></p></a></div></div></section>;
}

export default function PublicCourseDirectory() {
  return <>
    <section className="course-open container" aria-labelledby="open-courses-title">
      <header>
        <p className="eyebrow">NOW ACCEPTING APPLICATIONS</p>
        <h2 id="open-courses-title">Three programmes are now open.</h2>
        <p>Choose a programme to review the full schedule, fees and course details before registering.</p>
      </header>
      <div className="course-open__grid">
        {FEATURED_COURSES.map((course) => <article key={course.slug}>
          <div className={`course-open__image${course.slug === "surveyor-lead-surveyor-master-class-15" ? " course-open__image--badge-right" : ""}`}>
            <Image src={course.image} alt={course.title} width={course.imageWidth} height={course.imageHeight} sizes="(max-width: 760px) 100vw, 360px" />
            <span>Registration is open</span>
          </div>
          <div className="course-open__body">
            <div className="course-open__heading">
              <p className="course-open__number">{course.shortTitle}</p>
              <h3>{course.title}</h3>
              <p>{course.summary.en}</p>
            </div>
            <div className="course-open__meta">
              <div className="course-open__schedule"><CalendarDays size={18} /><span>{course.schedule.en}</span></div>
              <div className="course-open__countdown"><small>Class starts in</small><CourseCountdown target={course.startAt} compact /></div>
            </div>
            <div className="course-open__languages">
              {course.availableLanguages.map((language) => {
                const contact = LANGUAGE_CONTACTS[language];
                return <article className="course-open__language-card" key={language}>
                  <Link className="course-open__language-link" href={`/services/courses/${course.slug}/${language}`}>
                    <span><FeaturedCourseIcon slug={course.slug} /></span>
                    <div><strong>{course.shortTitle}</strong><small>{course.cardSubtitle}</small></div>
                    <ArrowRight size={17} />
                  </Link>
                  <div className="course-open__language-contact" lang={language}>
                    <div className="course-open__language-contact-copy">
                      <p>{contact.intro}</p>
                      <strong>{contact.name}</strong>
                      <a href={`tel:${contact.phone.replace(/\s|-/g, "")}`}>{contact.phoneLabel} {contact.phone}</a>
                      <a href={`mailto:${contact.email}`}>E-mail: {contact.email}</a>
                      <span>{contact.channel}</span>
                    </div>
                    <Link className="course-open__language-cta" href={`/services/courses/${course.slug}/${language}`}>
                      View Course Details &amp; Register
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </article>;
              })}
            </div>
          </div>
        </article>)}
      </div>
    </section>
    <section className="course-upcoming"><div className="container"><header><div><p className="eyebrow">PROGRAMME DIRECTORY</p><h2>More courses from AACI Academy</h2></div><p>These programmes are listed for planning purposes. Follow AACI Academy on Facebook for registration and schedule announcements.</p></header><div className="course-upcoming__list" aria-label="More courses from AACI Academy">{UPCOMING_COURSES.map(([title, href, description, image]) => <article key={title}><Link className="course-upcoming__course" href={href}><span className="course-upcoming__image"><Image src={image} alt={`${title} course cover`} width={768} height={432} sizes="(max-width: 520px) calc(100vw - 64px), (max-width: 760px) calc(100vw - 80px), 160px" /></span><strong>{title}</strong><p>{description}</p><span className="course-upcoming__cta">View course information <ArrowRight size={16} /></span></Link><a className="course-upcoming__facebook" href="https://www.facebook.com/HCGinternational" target="_blank" rel="noreferrer">Follow AACI Academy on Facebook <ExternalLink size={16} /></a></article>)}</div></div></section>
  </>;
}

function CourseDescription({ description }: { description: string }) {
  const blocks = description.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
  return <>{blocks.map((block, index) => { const heading = (index === 0 && /open/i.test(block)) || (/^[A-Z0-9][A-Z0-9 ?/&•–—-]+$/.test(block) && block.length < 80); if (heading) return <h2 key={index}>{block}</h2>; const lines = block.split("\n"); return <p key={index}>{lines.map((line, lineIndex) => <span key={lineIndex}>{line}{lineIndex < lines.length - 1 && <br />}</span>)}</p>; })}</>;
}

export function PublicCourseDetail({ slug }: { slug: string }) {
  const [course, setCourse] = useState<CourseRecord | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState(false);
  useEffect(() => { let active = true; getSupabaseBrowserClient().from("courses").select(COURSE_SELECT).eq("slug", slug).eq("status", "published").maybeSingle().then(({ data, error: queryError }) => { if (!active) return; const item = data as unknown as CourseRecord | null; setCourse(item ? { ...item, course_sessions: (item.course_sessions ?? []).filter((session) => session.status === "published").sort((a, b) => a.sort_order - b.sort_order || a.starts_at.localeCompare(b.starts_at)) } : null); setError(Boolean(queryError)); setLoading(false); }); return () => { active = false; }; }, [slug]);
  if (loading) return <main className="course-detail-page"><div className="container people-public-state" role="status">Loading course…</div></main>;
  if (error || !course) return <main className="course-detail-page"><div className="container people-public-state people-public-state--error" role="alert"><GraduationCap size={34} strokeWidth={1.5} /><h1>Course unavailable</h1><p>This course is unavailable or has not been published.</p><Link className="text-link" href="/services/courses">View all courses <b>→</b></Link></div></main>;
  const image = getCourseImageUrl(course.cover_image_path); const sessions = course.course_sessions ?? [];
  const isUpcomingCourse = UPCOMING_COURSES.some(([, href]) => href.endsWith(`/${slug}`));
  const registrationOpen = !isUpcomingCourse && (!sessions.length || sessions.some((session) => session.registration_status === "open"));
  const capacity = sessions.find((session) => session.capacity)?.capacity ?? 50;
  const registrationUrl = sessions.find((session) => session.registration_status === "open" && session.registration_url)?.registration_url ?? course.registration_url;
  return <main className="course-detail-page"><section className="course-detail-hero"><div className="container"><Link href="/services/courses"><ArrowLeft size={16} /> All courses</Link><p className="eyebrow light">{course.category ?? "AACI ACADEMY"}</p><h1>{course.title}</h1><p>{course.summary}</p></div></section><div className="container course-detail-layout"><article className="course-detail-content">{image && <img className="course-detail-cover" src={image} alt={course.title} />}<div className="course-detail-copy"><CourseDescription description={course.description} />{course.topics.length > 0 && <section className="course-detail-topics"><p className="eyebrow">WHO SHOULD ATTEND?</p><h2>Build the competencies that matter.</h2><ul>{course.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul></section>}{sessions.length > 0 && <section className="course-detail-sessions"><p className="eyebrow">CLASS SCHEDULE</p><h2>{sessions.length} live training sessions</h2><div>{sessions.map((session, index) => <article key={session.id}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{formatSessionDate(session.starts_at, session.timezone)}</strong>{session.ends_at && <small>Ends {formatSessionDate(session.ends_at, session.timezone)}</small>}</div><em>{REGISTRATION_STATUS_LABELS[session.registration_status]}</em></article>)}</div></section>}</div></article><aside className="course-detail-sidebar"><section><p className="eyebrow">COURSE DETAILS</p><h2>Plan your training</h2><dl><div><dt><CalendarDays size={17} />Training period</dt><dd>{scheduleText(course)}</dd></div><div><dt><Clock3 size={17} />Time</dt><dd>{sessionTime(course)}<small>Bangkok Time (GMT+7)</small></dd></div><div><dt><Monitor size={17} />Format</dt><dd>{course.format_text ?? "To be announced"}</dd></div><div><dt><BadgeDollarSign size={17} />Registration fee</dt><dd>{formatCourseFee(course.fee_amount, course.fee_currency)}</dd></div></dl>{course.early_bird_discount_percent && <div className="course-detail-earlybird"><strong>{course.early_bird_discount_percent}% OFF</strong><span>{course.early_bird_deadline ? `Register by ${new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${course.early_bird_deadline}T00:00:00Z`))}` : "Early bird offer"}</span></div>}{registrationOpen ? <RegistrationLink url={registrationUrl} label="Register now" /> : <p className="course-detail-closed">Registration is not currently open.</p>}</section></aside></div>{registrationOpen && <CourseRegistrationPanel course={course} capacity={capacity} registrationUrl={registrationUrl} origin={PUBLIC_SITE_ORIGIN} titleId="course-registration-title" />}</main>;
}
