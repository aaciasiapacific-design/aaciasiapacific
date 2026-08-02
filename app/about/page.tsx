import Link from "next/link";
import { PageHero } from "../components/ContentLayout";
const links=[["AACI Asia Office","/about/asia-office"],["Country Director","/about/country-director"],["Regional Advisory Board","/about/regional-advisory-board"],["Partnership","/about/partnership"]];
export default function AboutPage(){return <><PageHero eyebrow="ABOUT AACI" title="Our mission, vision and values." intro="AACI Asia Pacific advances quality, safety and patient-centred care through standards, certification and expert support."/><section className="page-content"><div className="container about-links">{links.map(([label,href])=><Link key={href} href={href}><span>About AACI</span><strong>{label}</strong><b>→</b></Link>)}</div></section></>}
