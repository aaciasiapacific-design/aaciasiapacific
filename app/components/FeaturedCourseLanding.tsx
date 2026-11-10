"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, BadgePercent, Building2, CalendarDays, Check, Clock3, ExternalLink,
  Languages, Mail, MessageCircle, MonitorUp, Phone, UserRound, WalletCards,
} from "lucide-react";
import { CourseLanguage, FeaturedCourse, LANGUAGE_CONTACTS } from "../../lib/featured-courses";
import { CourseCountdown } from "./CourseCountdown";

const COPY = {
  th: {
    back: "กลับไปหน้าหลักสูตรทั้งหมด", open: "กำลังเปิดรับสมัคร", starts: "คลาสเริ่มใน",
    room: "เลือกห้องเรียนที่ต้องการ", roomCopy: "เนื้อหาหลักสูตรเดียวกัน เลือกห้องตามภาษาที่สะดวกสำหรับการเรียนและการบรรยาย",
    thai: "Thai Classroom", english: "English Classroom", thaiDetail: "Lectures in Thai", englishDetail: "Lectures in English",
    schedule: "กำหนดการเรียน", time: "เวลา", format: "รูปแบบ", online: "เรียนออนไลน์สด",
    fee: "ค่าลงทะเบียน", offer: "สิทธิพิเศษ", register: "ลงทะเบียนหลักสูตรนี้", contact: "ติดต่อและสอบถาม",
    curriculum: "สิ่งที่จะได้เรียนรู้", learningObjective: "เป้าหมายการเรียนรู้",
    sidebarTitle: "สำรองที่นั่งสำหรับหลักสูตรนี้",
    sidebarCopy: "กรอกแบบฟอร์มสมัครเพื่อให้ทีมงานติดต่อกลับและยืนยันรายละเอียดการเข้าเรียน",
    topics: ["มาตรฐานการรับรองสากลของ AACI", "การบริหารคุณภาพและความปลอดภัยของผู้ป่วย", "กระบวนการและวิธีการเยี่ยมสำรวจ", "การประเมินองค์กรสุขภาพ", "ทักษะวิชาชีพของผู้เยี่ยมสำรวจ", "การนำทีมผู้เยี่ยมสำรวจ"],
  },
  en: {
    back: "Back to all courses", open: "Registration is open", starts: "Class starts in",
    room: "Choose your classroom", roomCopy: "The same professional programme is available in two lecture languages. Choose the classroom that suits you.",
    thai: "Thai Classroom", english: "English Classroom", thaiDetail: "Lectures in Thai", englishDetail: "Lectures in English",
    schedule: "Training schedule", time: "Time", format: "Format", online: "Live online class",
    fee: "Registration fee", offer: "Promotion", register: "Register for this course", contact: "Course contact",
    curriculum: "What you will learn", learningObjective: "Learning objective",
    sidebarTitle: "Reserve your place on this course",
    sidebarCopy: "Complete the registration form and our team will contact you to confirm the course details.",
    topics: ["AACI international accreditation standards", "Healthcare quality and patient safety", "Accreditation survey process and methodology", "Healthcare organisation assessment", "Professional surveyor skills", "Survey team leadership"],
  },
};

export function FeaturedCourseLanding({ course, language }: { course: FeaturedCourse; language: CourseLanguage }) {
  const copy = COPY[language];
  const alternate = language === "th" ? "en" : "th";
  const contact = LANGUAGE_CONTACTS[language];
  const alternateAvailable = course.availableLanguages.includes(alternate);
  const topics = course.topics?.[language] ?? copy.topics;
  const overview = course.courseOverview?.[language];
  const promotionTable = course.promotionTable?.[language];
  const detailSchedule = course.detailSchedule?.[language] ?? course.schedule[language];
  const feeBreakdown = course.feeBreakdown?.[language];
  const sessionDates = course.sessionDates?.[language];
  const sessionDateSummary = course.sessionDateSummary?.[language];
  const applicantRequirements = course.applicantRequirements?.[language];

  return (
    <main className={`featured-course-page featured-course-page--${language}`} lang={language}>
      <section className="featured-course-hero">
        <div className="container">
          <div className="featured-course-hero__nav">
            <Link href="/services/courses"><ArrowLeft size={17} />{copy.back}</Link>
            {alternateAvailable && <Link href={`/services/courses/${course.slug}/${alternate}`}><Languages size={17} />{alternate === "th" ? "ภาษาไทย" : "English"}</Link>}
          </div>
          <div className="featured-course-hero__grid">
            <div>
              <p className="featured-course-badge"><span />{copy.open}</p>
              <p className="eyebrow light">AACI ACADEMY · 2026/2027</p>
              <h1>{course.title}</h1>
              <p className="featured-course-hero__summary">{course.summary[language]}</p>
              <a className="featured-course-primary" href={course.registrationUrl} target="_blank" rel="noreferrer">{copy.register}<ExternalLink size={18} /></a>
            </div>
            <aside><p>{copy.starts}</p><CourseCountdown target={course.startAt} language={language} /></aside>
          </div>
        </div>
      </section>

      {course.availableLanguages.length > 1 && (
        <section className="featured-course-room container" aria-labelledby="classroom-title">
          <header><p className="eyebrow">{language === "th" ? "ภาษาในการเรียน" : "LECTURE LANGUAGE"}</p><h2 id="classroom-title">{copy.room}</h2><p>{copy.roomCopy}</p></header>
          <div>
            <Link className={language === "th" ? "is-active" : ""} href={`/services/courses/${course.slug}/th`}><span>TH</span><div><strong>{copy.thai}</strong><small>{copy.thaiDetail}</small></div>{language === "th" && <Check size={20} />}</Link>
            <Link className={language === "en" ? "is-active" : ""} href={`/services/courses/${course.slug}/en`}><span>EN</span><div><strong>{copy.english}</strong><small>{copy.englishDetail}</small></div>{language === "en" && <Check size={20} />}</Link>
          </div>
        </section>
      )}

      <section className="featured-course-information">
        <div className="container">
          <article className="featured-course-information__main">
            <p className="eyebrow">{language === "th" ? "รายละเอียดหลักสูตร" : "COURSE DETAILS"}</p>
            <h2>{course.shortTitle}</h2>
            {course.description?.[language] && <p className="featured-course-information__description">{course.description[language]}</p>}
            {overview && <div className="featured-course-information__overview"><strong>{copy.learningObjective}</strong><p>{overview}</p></div>}

            <dl>
              <div className={`featured-course-information__card${sessionDates ? " featured-course-information__card--dates" : ""}`}>
                <dt><CalendarDays size={19} />{copy.schedule}</dt>
                <dd>{sessionDates ? <><p className="featured-course-session-summary">{sessionDateSummary}</p><span className="featured-course-session-dates">{sessionDates.map((date, index) => <span key={`${date.day}-${date.month}-${index}`}><strong>{date.day}</strong><small>{date.month}</small></span>)}</span></> : detailSchedule}</dd>
              </div>
              <div className="featured-course-information__card"><dt><Clock3 size={19} />{copy.time}</dt><dd>19:00–22:00 <small>{language === "th" ? "เวลาประเทศไทย (GMT+7)" : "Bangkok time (GMT+7)"}</small></dd></div>
              <div className="featured-course-information__card"><dt><MonitorUp size={19} />{copy.format}</dt><dd>{copy.online}</dd></div>
              <div className={`featured-course-information__card${feeBreakdown ? " featured-course-information__card--fee" : ""}`}>
                <dt><WalletCards size={19} />{copy.fee}</dt>
                <dd>{feeBreakdown ? <span className="featured-course-fees">{feeBreakdown.map((fee) => <span key={fee.label}><small>{fee.label}</small><strong>{fee.value}</strong></span>)}</span> : course.fee[language]}{course.feeNote?.[language] && <small className="featured-course-fees__note">{course.feeNote[language]}</small>}</dd>
              </div>
              <div className="featured-course-information__offer">
                <dt><BadgePercent size={19} />{copy.offer}</dt>
                <dd>{promotionTable ? (
                  <table className="featured-course-offer-table">
                    <thead><tr><th><CalendarDays size={17} />{language === "th" ? "กำหนดชำระ" : "Payment deadline"}</th><th><BadgePercent size={17} />{language === "th" ? "ส่วนลด" : "Discount"}</th><th><UserRound size={17} />{language === "th" ? "บุคคลธรรมดา" : "Individual"}</th><th><Building2 size={17} />{language === "th" ? "นิติบุคคล" : "Organisation"}</th></tr></thead>
                    <tbody>{promotionTable.map((promotion) => <tr key={promotion.deadline}><td data-label={language === "th" ? "กำหนดชำระ" : "Payment deadline"}>{promotion.deadline}</td><td data-label={language === "th" ? "ส่วนลด" : "Discount"}><strong>{promotion.discount}</strong></td><td data-label={language === "th" ? "บุคคลธรรมดา" : "Individual"}>{promotion.individual}</td><td data-label={language === "th" ? "นิติบุคคล" : "Organisation"}>{promotion.organisation}</td></tr>)}</tbody>
                  </table>
                ) : course.promotions?.[language] ? <ul>{course.promotions[language].map((promotion) => <li key={promotion}>{promotion}</li>)}</ul> : course.earlyBird[language]}</dd>
              </div>
            </dl>

            <section className="featured-course-curriculum">
              <p className="eyebrow">{language === "th" ? "หัวข้อสำคัญ" : "CORE CURRICULUM"}</p>
              <h2>{copy.curriculum}</h2>
              <ul>{topics.map((topic) => <li key={topic}><Check size={18} />{topic}</li>)}</ul>
            </section>

            {applicantRequirements && (
              <section className="featured-course-requirements">
                <header>
                  <p className="eyebrow">{language === "th" ? "คุณสมบัติผู้สมัคร" : "CURRICULUM VITAE"}</p>
                  <h2>{language === "th" ? "ข้อกำหนดสำหรับผู้สมัครเป็นผู้เยี่ยมสำรวจ" : "Surveyor applicant requirements"}</h2>
                  {applicantRequirements.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </header>
                <div>{applicantRequirements.specialties.map((specialty) => (
                  <article key={specialty.title}>
                    <h3>{specialty.title}</h3>
                    <ul>{specialty.items.map((item) => <li key={item}><Check size={17} />{item}</li>)}</ul>
                  </article>
                ))}</div>
              </section>
            )}
          </article>

          <aside className="featured-course-sidebar">
            <Image src={course.image} alt={course.title} width={course.imageWidth} height={course.imageHeight} sizes="(max-width: 900px) 620px, 360px" />
            <section className="featured-course-sidebar__action">
              <p className="featured-course-badge"><span />{copy.open}</p>
              <h2>{copy.sidebarTitle}</h2>
              <p>{copy.sidebarCopy}</p>
              <a className="featured-course-primary" href={course.registrationUrl} target="_blank" rel="noreferrer">{copy.register}<ExternalLink size={18} /></a>
            </section>
            <section className="featured-course-sidebar__contact">
              <p className="eyebrow">{language === "th" ? "ผู้ประสานงานหลักสูตร" : "DEDICATED COURSE TEAM"}</p>
              <h2>{copy.contact}</h2>
              <p>{contact.intro}</p>
              <strong>{contact.name}</strong>
              <a href={`tel:${contact.phone.replace(/\s|-/g, "")}`}><Phone size={18} />{contact.phone}</a>
              <a href={`mailto:${contact.email}`}><Mail size={18} />{contact.email}</a>
              <span><MessageCircle size={18} />{contact.channel}</span>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
