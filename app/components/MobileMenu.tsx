"use client";
import Link from "next/link";
import { useState } from "react";
const links=[{href:"/",label:"Home"},{href:"/services",label:"Services"},{href:"/about",label:"About us"},{href:"/contact",label:"Contact"},{href:"/news",label:"News"},{href:"/events",label:"Events"}];
export function MobileMenu(){const [open,setOpen]=useState(false);return <div className="mobile-nav"><button className="menu-button" aria-label={open?"Close navigation":"Open navigation"} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?'×':'☰'}</button>{open&&<div className="mobile-drawer" role="dialog" aria-label="Mobile navigation">{links.map(x=><Link href={x.href} onClick={()=>setOpen(false)} key={x.href}>{x.label}</Link>)}<Link className="button button-red" href="/accreditation/request" onClick={()=>setOpen(false)}>REQUEST CONSULTATION <span>→</span></Link></div>}</div>}
