"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Award,
  BookOpen,
  CalendarDays,
  ChevronRight,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Newspaper,
  ShieldCheck,
  UserCog,
  UsersRound,
  X,
} from "lucide-react";
import { useAdminPermissions } from "../../lib/admin-access";

type AdminSidebarProps = {
  active: "dashboard" | "people" | "news" | "events" | "courses" | "organizations" | "users" | "roles";
  userLabel: string;
  role: string;
  onSignOut: () => void | Promise<void>;
};

const contentLinks = [
  { label: "People", href: "/admin/people", icon: UsersRound, available: true, permission: "people.view" },
  { label: "News", href: "/admin/news", icon: Newspaper, available: true, permission: "news.view" },
  { label: "Events", href: "/admin/events", icon: CalendarDays, available: true, permission: "events.view" },
  { label: "Courses", href: "/admin/courses", icon: GraduationCap, available: true, permission: "courses.view" },
  { label: "Organizations", href: "/admin/organizations", icon: Award, available: true, permission: "organizations.view" },
  { label: "Resources", href: "#", icon: FileText, available: false },
  { label: "Consultation", href: "#", icon: MessageSquareText, available: false },
] as const;

export default function AdminSidebar({ active, userLabel, role, onSignOut }: AdminSidebarProps) {
  const [open, setOpen] = useState(false);
  const { can, loading } = useAdminPermissions();
  const roleLabel = role.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");

  return <>
    <header className="admin-mobile-bar">
      <Link href="/admin" aria-label="AACI Administration"><img src="/aaci-academy-logo.webp" alt="" /><strong>AACI ADMIN</strong></Link>
      <button type="button" aria-label={open ? "Close administration menu" : "Open administration menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
    </header>
    {open && <button className="admin-sidebar-overlay" type="button" aria-label="Close administration menu" onClick={() => setOpen(false)} />}
    <aside className={`admin-sidebar${open ? " admin-sidebar--open" : ""}`} aria-label="Administration navigation">
      <div className="admin-sidebar__brand"><img src="/aaci-academy-logo.webp" alt="" /><div><strong>AACI</strong><span>ASIA PACIFIC ADMIN</span></div></div>

      <nav>
        <p>OVERVIEW</p>
        <Link className={active === "dashboard" ? "is-active" : ""} href="/admin" onClick={() => setOpen(false)}><LayoutDashboard size={18} /><span>Dashboard</span>{active === "dashboard" && <ChevronRight size={15} />}</Link>
        <p>CONTENT MANAGEMENT</p>
        {contentLinks.map((item) => {
          const Icon = item.icon;
          if (!item.available) return <span className="admin-sidebar__disabled" key={item.label} aria-disabled="true"><Icon size={18} /><span>{item.label}</span><small>SOON</small></span>;
          if (!loading && "permission" in item && item.permission && !can(item.permission)) return null;
          const itemActive = active === item.label.toLowerCase();
          return <Link className={itemActive ? "is-active" : ""} key={item.label} href={item.href} onClick={() => setOpen(false)}><Icon size={18} /><span>{item.label}</span>{itemActive && <ChevronRight size={15} />}</Link>;
        })}
        {!loading && (can("users.view") || can("roles.view")) && <p>ACCESS CONTROL</p>}
        {!loading && can("users.view") && <Link className={active === "users" ? "is-active" : ""} href="/admin/users" onClick={() => setOpen(false)}><UserCog size={18} /><span>Users</span>{active === "users" && <ChevronRight size={15} />}</Link>}
        {!loading && can("roles.view") && <Link className={active === "roles" ? "is-active" : ""} href="/admin/roles" onClick={() => setOpen(false)}><ShieldCheck size={18} /><span>Roles & Permissions</span>{active === "roles" && <ChevronRight size={15} />}</Link>}
      </nav>

      <div className="admin-sidebar__help"><BookOpen size={18} /><div><strong>Content guide</strong><span>Publish only reviewed information.</span></div></div>
      <div className="admin-sidebar__account"><div className="admin-sidebar__avatar">{userLabel.charAt(0).toUpperCase()}</div><div><strong>{userLabel}</strong><span>{roleLabel}</span></div><button type="button" onClick={onSignOut} aria-label="Sign out"><LogOut size={18} /></button></div>
    </aside>
  </>;
}
