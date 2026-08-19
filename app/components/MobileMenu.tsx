"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { aboutLinks, serviceGroups } from "./ContentLayout";

const links = [
  { href: "/", label: "Home" },
  { href: "/contact", label: "Contact" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
];

type ExpandedMenu = "services" | "about" | null;

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<ExpandedMenu>(null);

  function closeMenu() {
    setOpen(false);
    setExpanded(null);
  }

  function toggleMenu() {
    setOpen((current) => {
      if (current) setExpanded(null);
      return !current;
    });
  }

  return <div className="mobile-nav">
    <button className="menu-button" type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} onClick={toggleMenu}>{open ? "×" : "☰"}</button>
    {open && <div className="mobile-drawer" role="dialog" aria-label="Mobile navigation">
      <Link href="/" onClick={closeMenu}>Home</Link>

      <div className="mobile-menu-group">
        <div className="mobile-menu-group__header">
          <Link href="/services" onClick={closeMenu}>Services</Link>
          <button type="button" aria-label="Toggle Services submenu" aria-expanded={expanded === "services"} aria-controls="mobile-services-submenu" onClick={() => setExpanded(expanded === "services" ? null : "services")}><ChevronDown size={20} /></button>
        </div>
        {expanded === "services" && <div className="mobile-submenu mobile-submenu--services" id="mobile-services-submenu">
          {serviceGroups.map((group) => <section key={group.title}>
            <Link className="mobile-submenu__heading" href={group.href} onClick={closeMenu}>{group.title}</Link>
            {group.items.map(([label, href]) => <Link key={href} href={href} onClick={closeMenu}>{label}</Link>)}
          </section>)}
        </div>}
      </div>

      <div className="mobile-menu-group">
        <div className="mobile-menu-group__header">
          <Link href="/about" onClick={closeMenu}>About us</Link>
          <button type="button" aria-label="Toggle About us submenu" aria-expanded={expanded === "about"} aria-controls="mobile-about-submenu" onClick={() => setExpanded(expanded === "about" ? null : "about")}><ChevronDown size={20} /></button>
        </div>
        {expanded === "about" && <div className="mobile-submenu" id="mobile-about-submenu">{aboutLinks.map(([label, href]) => <Link key={href} href={href} onClick={closeMenu}>{label}</Link>)}</div>}
      </div>

      {links.slice(1).map((item) => <Link href={item.href} onClick={closeMenu} key={item.href}>{item.label}</Link>)}
      <Link className="button button-red" href="/accreditation/request" onClick={closeMenu}>REQUEST CONSULTATION <span>→</span></Link>
    </div>}
  </div>;
}
