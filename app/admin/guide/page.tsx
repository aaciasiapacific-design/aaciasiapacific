"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Award, BookOpen, CalendarDays, CheckCircle2, GraduationCap, Newspaper, ShieldCheck, UserCog, UsersRound } from "lucide-react";
import { getSupabaseBrowserClient } from "../../../lib/supabase/client";
import AdminSidebar from "../AdminSidebar";

type AdminIdentity = { label: string; role: string };
type GuideLanguage = "th" | "en";

const guideCopy = {
  th: {
    back: "Administration",
    title: "คู่มือการใช้งานระบบ",
    introduction: "แนวทางสำหรับผู้ดูแลเว็บไซต์ ตั้งแต่การเตรียมข้อมูลจนถึงการเผยแพร่อย่างปลอดภัย",
    navLabel: "หัวข้อคู่มือ",
    sections: ["ขั้นตอนเผยแพร่", "จัดการเนื้อหา", "ผู้ใช้และสิทธิ์", "ความปลอดภัย"],
    workflowTitle: "ขั้นตอนก่อนเผยแพร่",
    steps: [
      ["เตรียมข้อมูล", "ตรวจชื่อเรื่อง เนื้อหา วันที่ ลิงก์ และสิทธิ์การใช้รูปภาพให้ครบถ้วน"],
      ["บันทึกเป็น Draft", "เก็บงานที่ยังตรวจไม่เสร็จไว้เป็น Draft เพื่อไม่ให้แสดงบนเว็บไซต์สาธารณะ"],
      ["ตรวจ Preview", "ตรวจการสะกด รูปแบบบนมือถือ ลิงก์ และข้อมูลภาษาอังกฤษก่อนขออนุมัติ"],
      ["Publish", "เปลี่ยนเป็น Published เฉพาะข้อมูลที่ได้รับการตรวจและอนุมัติแล้ว"],
    ],
    statuses: [
      ["Draft", "กำลังจัดทำหรือรอตรวจ ไม่แสดงต่อสาธารณะ"],
      ["Published", "อนุมัติแล้วและแสดงบนเว็บไซต์"],
      ["Archived", "เก็บไว้ในระบบแต่หยุดแสดงต่อสาธารณะ"],
    ],
    contentTitle: "การจัดการแต่ละเมนู",
    modules: [
      ["People", "เพิ่มและแก้ไขบุคลากร เลือกหมวดตำแหน่ง อัปโหลดรูป และจัดลำดับการแสดงผล"],
      ["News", "เขียนข่าว ใส่ภาพปก เนื้อหา วันที่เผยแพร่ และตรวจหน้า Preview ก่อน Publish"],
      ["Events", "จัดการกิจกรรม วันเวลา สถานที่ ลิงก์ลงทะเบียน และสถานะการเผยแพร่"],
      ["Courses", "สร้างหลักสูตร ค่าธรรมเนียม รอบเรียน จำนวนที่นั่ง และลิงก์ลงทะเบียน"],
      ["Organizations", "ดูแลรายชื่อองค์กรที่ได้รับการรับรอง ประเทศ มาตรฐาน และข้อมูลใบรับรอง"],
    ],
    imageTitle: "มาตรฐานรูปภาพ",
    imageText: "ใช้ไฟล์ JPEG, PNG หรือ WebP ที่คมชัด ขนาดเหมาะสม และหลีกเลี่ยงข้อความสำคัญชิดขอบภาพ",
    accessTitle: "ผู้ใช้ Roles และ Permissions",
    userTitle: "เพิ่มผู้ดูแลระบบ",
    userSteps: ["เปิดเมนู Users", "กด Invite user", "กรอกอีเมลและเลือก Role", "ผู้ใช้เปิดอีเมลเพื่อตั้งรหัสผ่าน"],
    roleTitle: "กำหนดสิทธิ์",
    roleSteps: ["เปิด Roles & Permissions", "เลือก Role ที่ต้องการ", "กำหนด View, Create, Update, Publish และ Delete", "บันทึกและให้ผู้ใช้เข้าใหม่หากสิทธิ์ยังไม่อัปเดต"],
    leastPrivilege: "หลัก Least Privilege:",
    leastPrivilegeText: "ให้สิทธิ์เท่าที่จำเป็นต่อหน้าที่ และจำกัด Users, Roles และ Delete ไว้สำหรับผู้ดูแลระดับสูง",
    securityTitle: "ข้อควรปฏิบัติ",
    checklist: [
      "ห้ามแชร์รหัสผ่าน, OTP หรือ Supabase Secret Key ผ่านแชตและอีเมล",
      "ใช้บัญชีส่วนบุคคล ไม่ใช้บัญชีร่วมกันหลายคน",
      "ตรวจ URL และไฟล์แนบทุกครั้งก่อน Publish",
      "ปิดสิทธิ์ผู้ใช้ทันทีเมื่อย้ายหน้าที่หรือพ้นจากองค์กร",
      "ออกจากระบบเมื่อใช้เครื่องสาธารณะหรือเครื่องที่ใช้ร่วมกัน",
    ],
    footer: "เมื่อไม่แน่ใจ ให้บันทึกเป็น Draft และส่งให้ผู้รับผิดชอบตรวจสอบก่อนเผยแพร่",
    dashboard: "กลับไปที่ Dashboard",
  },
  en: {
    back: "Administration",
    title: "Administration User Guide",
    introduction: "Guidance for website administrators, from preparing content to publishing it safely.",
    navLabel: "Guide sections",
    sections: ["Publishing workflow", "Content management", "Users and access", "Security"],
    workflowTitle: "Before you publish",
    steps: [
      ["Prepare the content", "Check the title, body copy, dates, links, and image usage rights for accuracy and completeness."],
      ["Save as Draft", "Keep unfinished or unreviewed work in Draft so it does not appear on the public website."],
      ["Review the Preview", "Check spelling, mobile layout, links, images, and English-language information before approval."],
      ["Publish", "Change the status to Published only after the content has been reviewed and approved."],
    ],
    statuses: [
      ["Draft", "Work in progress or awaiting review. It is not publicly visible."],
      ["Published", "Approved content that is visible on the public website."],
      ["Archived", "Retained in the system but removed from the public website."],
    ],
    contentTitle: "Managing each content area",
    modules: [
      ["People", "Add and edit people, choose their section, upload a photo, and control display order."],
      ["News", "Write articles, add cover images and publication dates, and review the Preview before publishing."],
      ["Events", "Manage event dates, times, locations, registration links, and publication status."],
      ["Courses", "Create courses and manage fees, class sessions, capacity, and registration links."],
      ["Organizations", "Maintain accredited organizations, countries, standards, and certificate information."],
    ],
    imageTitle: "Image standards",
    imageText: "Use clear JPEG, PNG, or WebP files at an appropriate size. Keep important text and subjects away from image edges.",
    accessTitle: "Users, Roles, and Permissions",
    userTitle: "Add an administrator",
    userSteps: ["Open Users", "Select Invite user", "Enter the email address and choose a Role", "The user opens the invitation email and sets a password"],
    roleTitle: "Configure permissions",
    roleSteps: ["Open Roles & Permissions", "Select the required Role", "Configure View, Create, Update, Publish, and Delete", "Save changes and ask the user to sign in again if access has not refreshed"],
    leastPrivilege: "Least-privilege principle:",
    leastPrivilegeText: "Grant only the access required for each person’s responsibilities. Reserve Users, Roles, and Delete permissions for senior administrators.",
    securityTitle: "Security checklist",
    checklist: [
      "Never share passwords, OTPs, or the Supabase Secret Key through chat or email.",
      "Use individual accounts and do not share one administrator account between people.",
      "Check every URL and attachment before publishing.",
      "Disable a user’s access immediately when their role changes or they leave the organization.",
      "Sign out after using a public or shared computer.",
    ],
    footer: "When in doubt, save the item as Draft and ask the responsible person to review it before publication.",
    dashboard: "Return to Dashboard",
  },
} as const;

const moduleIcons = [UsersRound, Newspaper, CalendarDays, GraduationCap, Award] as const;
const sectionIds = ["workflow", "content", "access", "security"] as const;
const statusClasses = ["draft", "published", "archived"] as const;

export default function AdminGuidePage() {
  const [identity, setIdentity] = useState<AdminIdentity | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<GuideLanguage>("th");
  const copy = guideCopy[language];

  useEffect(() => {
    let active = true;
    (async () => {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      if (!data.user) { window.location.replace("/admin"); return; }
      const { data: profile } = await supabase.from("admin_profiles").select("email, display_name, role").eq("id", data.user.id).eq("is_active", true).maybeSingle();
      if (!active) return;
      if (!profile) { await supabase.auth.signOut(); window.location.replace("/admin"); return; }
      setIdentity({ label: profile.display_name ?? profile.email, role: profile.role });
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  async function signOut() {
    await getSupabaseBrowserClient().auth.signOut();
    window.location.replace("/admin");
  }

  if (loading || !identity) return <main className="admin-dashboard admin-people"><div className="admin-loading" role="status">Checking access and loading the guide…</div></main>;

  return <div className="admin-workspace">
    <AdminSidebar active="guide" userLabel={identity.label} role={identity.role} onSignOut={signOut} />
    <main className="admin-dashboard admin-people admin-guide" lang={language}>
      <header className="admin-people__header admin-guide__header"><div>
        <Link className="admin-back" href="/admin"><ArrowLeft size={17} /> {copy.back}</Link>
        <p className="admin-kicker">AACI ADMINISTRATION</p>
        <h1>{copy.title}</h1>
        <p>{copy.introduction}</p>
      </div><div className="admin-guide__header-actions"><BookOpen size={50} strokeWidth={1.35} /><div className="admin-guide__language" aria-label="Guide language"><button type="button" className={language === "th" ? "is-active" : ""} aria-pressed={language === "th"} onClick={() => setLanguage("th")}>ไทย</button><button type="button" className={language === "en" ? "is-active" : ""} aria-pressed={language === "en"} onClick={() => setLanguage("en")}>English</button></div></div></header>

      <nav className="admin-guide__toc" aria-label={copy.navLabel}>{copy.sections.map((label, index) => <a href={`#${sectionIds[index]}`} key={sectionIds[index]}><span>0{index + 1}</span>{label}</a>)}</nav>

      <section className="admin-guide__section" id="workflow">
        <div className="admin-guide__section-title"><span>01</span><div><p className="admin-kicker">PUBLISHING WORKFLOW</p><h2>{copy.workflowTitle}</h2></div></div>
        <ol className="admin-guide__steps">{copy.steps.map(([title, text]) => <li key={title}><strong>{title}</strong><span>{text}</span></li>)}</ol>
        <div className="admin-guide__status-grid">{copy.statuses.map(([title, text], index) => <article key={title}><span className={`admin-status admin-status--${statusClasses[index]}`}>{title}</span><p>{text}</p></article>)}</div>
      </section>

      <section className="admin-guide__section" id="content">
        <div className="admin-guide__section-title"><span>02</span><div><p className="admin-kicker">CONTENT MANAGEMENT</p><h2>{copy.contentTitle}</h2></div></div>
        <div className="admin-guide__module-grid">{copy.modules.map(([title, text], index) => { const Icon = moduleIcons[index]; return <article key={title}><Icon size={24} /><div><h3>{title}</h3><p>{text}</p></div></article>; })}</div>
        <aside className="admin-guide__tip"><CheckCircle2 size={22} /><div><strong>{copy.imageTitle}</strong><p>{copy.imageText}</p></div></aside>
      </section>

      <section className="admin-guide__section" id="access">
        <div className="admin-guide__section-title"><span>03</span><div><p className="admin-kicker">ACCESS CONTROL</p><h2>{copy.accessTitle}</h2></div></div>
        <div className="admin-guide__two-column">
          <article><UserCog size={27} /><h3>{copy.userTitle}</h3><ol>{copy.userSteps.map((step) => <li key={step}>{step}</li>)}</ol></article>
          <article><ShieldCheck size={27} /><h3>{copy.roleTitle}</h3><ol>{copy.roleSteps.map((step) => <li key={step}>{step}</li>)}</ol></article>
        </div>
        <p className="admin-guide__warning"><strong>{copy.leastPrivilege}</strong> {copy.leastPrivilegeText}</p>
      </section>

      <section className="admin-guide__section" id="security">
        <div className="admin-guide__section-title"><span>04</span><div><p className="admin-kicker">SECURITY CHECKLIST</p><h2>{copy.securityTitle}</h2></div></div>
        <ul className="admin-guide__checklist">{copy.checklist.map((item) => <li key={item}><CheckCircle2 size={18} />{item}</li>)}</ul>
      </section>

      <footer className="admin-guide__footer"><p>{copy.footer}</p><Link href="/admin">{copy.dashboard}</Link></footer>
    </main>
  </div>;
}
