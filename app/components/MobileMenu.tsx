"use client";
import Link from "next/link";
import { useState } from "react";
const links=[{href:"/about",label:"About us"},{href:"/standards",label:"Programmes"},{href:"/accreditation/process",label:"Certification"},{href:"/news",label:"News update"},{href:"/contact",label:"Contact"}];
export function MobileMenu(){const [open,setOpen]=useState(false);return <div className="mobile-nav"><button className="menu-button" aria-label={open?"Close navigation":"Open navigation"} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?'×':'☰'}</button>{open&&<div className="mobile-drawer" role="dialog" aria-label="Mobile navigation">{links.map(x=><Link href={x.href} onClick={()=>setOpen(false)} key={x.href}>{x.label}</Link>)}<Link className="button button-red" href="/accreditation/request" onClick={()=>setOpen(false)}>Request consultation <span>→</span></Link></div>}</div>}
