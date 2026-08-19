"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Award, BookOpen, CalendarDays, CheckCircle2, GraduationCap, Newspaper, ShieldCheck, UserCog, UsersRound } from "lucide-react";
import { getSupabaseBrowserClient } from "../../../lib/supabase/client";
import AdminSidebar from "../AdminSidebar";

type AdminIdentity = { label: string; role: string };

const sections = [
  { id: "workflow", label: "ขั้นตอนเผยแพร่" },
  { id: "content", label: "จัดการเนื้อหา" },
  { id: "access", label: "ผู้ใช้และสิทธิ์" },
  { id: "security", label: "ความปลอดภัย" },
] as const;

const modules = [
  { icon: UsersRound, title: "People", text: "เพิ่มและแก้ไขบุคลากร เลือกหมวดตำแหน่ง อัปโหลดรูป และจัดลำดับการแสดงผล" },
  { icon: Newspaper, title: "News", text: "เขียนข่าว ใส่ภาพปก เนื้อหา วันที่เผยแพร่ และตรวจหน้า Preview ก่อน Publish" },
  { icon: CalendarDays, title: "Events", text: "จัดการกิจกรรม วันเวลา สถานที่ ลิงก์ลงทะเบียน และสถานะการเผยแพร่" },
  { icon: GraduationCap, title: "Courses", text: "สร้างหลักสูตร ค่าธรรมเนียม รอบเรียน จำนวนที่นั่ง และลิงก์ลงทะเบียน" },
  { icon: Award, title: "Organizations", text: "ดูแลรายชื่อองค์กรที่ได้รับการรับรอง ประเทศ มาตรฐาน และข้อมูลใบรับรอง" },
] as const;

export default function AdminGuidePage() {
  const [identity, setIdentity] = useState<AdminIdentity | null>(null);
  const [loading, setLoading] = useState(true);

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
    <main className="admin-dashboard admin-people admin-guide">
      <header className="admin-people__header admin-guide__header"><div>
        <Link className="admin-back" href="/admin"><ArrowLeft size={17} /> Administration</Link>
        <p className="admin-kicker">AACI ADMINISTRATION</p>
        <h1>คู่มือการใช้งานระบบ</h1>
        <p>แนวทางสำหรับผู้ดูแลเว็บไซต์ ตั้งแต่การเตรียมข้อมูลจนถึงการเผยแพร่อย่างปลอดภัย</p>
      </div><BookOpen size={50} strokeWidth={1.35} /></header>

      <nav className="admin-guide__toc" aria-label="หัวข้อคู่มือ">{sections.map((section, index) => <a href={`#${section.id}`} key={section.id}><span>0{index + 1}</span>{section.label}</a>)}</nav>

      <section className="admin-guide__section" id="workflow">
        <div className="admin-guide__section-title"><span>01</span><div><p className="admin-kicker">PUBLISHING WORKFLOW</p><h2>ขั้นตอนก่อนเผยแพร่</h2></div></div>
        <ol className="admin-guide__steps">
          <li><strong>เตรียมข้อมูล</strong><span>ตรวจชื่อเรื่อง เนื้อหา วันที่ ลิงก์ และสิทธิ์การใช้รูปภาพให้ครบถ้วน</span></li>
          <li><strong>บันทึกเป็น Draft</strong><span>เก็บงานที่ยังตรวจไม่เสร็จไว้เป็น Draft เพื่อไม่ให้แสดงบนเว็บไซต์สาธารณะ</span></li>
          <li><strong>ตรวจ Preview</strong><span>ตรวจการสะกด รูปแบบบนมือถือ ลิงก์ และข้อมูลภาษาอังกฤษก่อนขออนุมัติ</span></li>
          <li><strong>Publish</strong><span>เปลี่ยนเป็น Published เฉพาะข้อมูลที่ได้รับการตรวจและอนุมัติแล้ว</span></li>
        </ol>
        <div className="admin-guide__status-grid">
          <article><span className="admin-status admin-status--draft">Draft</span><p>กำลังจัดทำหรือรอตรวจ ไม่แสดงต่อสาธารณะ</p></article>
          <article><span className="admin-status admin-status--published">Published</span><p>อนุมัติแล้วและแสดงบนเว็บไซต์</p></article>
          <article><span className="admin-status admin-status--archived">Archived</span><p>เก็บไว้ในระบบแต่หยุดแสดงต่อสาธารณะ</p></article>
        </div>
      </section>

      <section className="admin-guide__section" id="content">
        <div className="admin-guide__section-title"><span>02</span><div><p className="admin-kicker">CONTENT MANAGEMENT</p><h2>การจัดการแต่ละเมนู</h2></div></div>
        <div className="admin-guide__module-grid">{modules.map((module) => { const Icon = module.icon; return <article key={module.title}><Icon size={24} /><div><h3>{module.title}</h3><p>{module.text}</p></div></article>; })}</div>
        <aside className="admin-guide__tip"><CheckCircle2 size={22} /><div><strong>มาตรฐานรูปภาพ</strong><p>ใช้ไฟล์ JPEG, PNG หรือ WebP ที่คมชัด ขนาดเหมาะสม และหลีกเลี่ยงข้อความสำคัญชิดขอบภาพ</p></div></aside>
      </section>

      <section className="admin-guide__section" id="access">
        <div className="admin-guide__section-title"><span>03</span><div><p className="admin-kicker">ACCESS CONTROL</p><h2>ผู้ใช้ Roles และ Permissions</h2></div></div>
        <div className="admin-guide__two-column">
          <article><UserCog size={27} /><h3>เพิ่มผู้ดูแลระบบ</h3><ol><li>เปิดเมนู Users</li><li>กด Invite user</li><li>กรอกอีเมลและเลือก Role</li><li>ผู้ใช้เปิดอีเมลเพื่อตั้งรหัสผ่าน</li></ol></article>
          <article><ShieldCheck size={27} /><h3>กำหนดสิทธิ์</h3><ol><li>เปิด Roles &amp; Permissions</li><li>เลือก Role ที่ต้องการ</li><li>กำหนด View, Create, Update, Publish และ Delete</li><li>บันทึกและให้ผู้ใช้เข้าใหม่หากสิทธิ์ยังไม่อัปเดต</li></ol></article>
        </div>
        <p className="admin-guide__warning"><strong>หลัก Least Privilege:</strong> ให้สิทธิ์เท่าที่จำเป็นต่อหน้าที่ และจำกัด Users, Roles และ Delete ไว้สำหรับผู้ดูแลระดับสูง</p>
      </section>

      <section className="admin-guide__section" id="security">
        <div className="admin-guide__section-title"><span>04</span><div><p className="admin-kicker">SECURITY CHECKLIST</p><h2>ข้อควรปฏิบัติ</h2></div></div>
        <ul className="admin-guide__checklist">
          <li><CheckCircle2 size={18} />ห้ามแชร์รหัสผ่าน, OTP หรือ Supabase Secret Key ผ่านแชตและอีเมล</li>
          <li><CheckCircle2 size={18} />ใช้บัญชีส่วนบุคคล ไม่ใช้บัญชีร่วมกันหลายคน</li>
          <li><CheckCircle2 size={18} />ตรวจ URL และไฟล์แนบทุกครั้งก่อน Publish</li>
          <li><CheckCircle2 size={18} />ปิดสิทธิ์ผู้ใช้ทันทีเมื่อย้ายหน้าที่หรือพ้นจากองค์กร</li>
          <li><CheckCircle2 size={18} />ออกจากระบบเมื่อใช้เครื่องสาธารณะหรือเครื่องที่ใช้ร่วมกัน</li>
        </ul>
      </section>

      <footer className="admin-guide__footer"><p>เมื่อไม่แน่ใจ ให้บันทึกเป็น Draft และส่งให้ผู้รับผิดชอบตรวจสอบก่อนเผยแพร่</p><Link href="/admin">กลับไปที่ Dashboard</Link></footer>
    </main>
  </div>;
}
