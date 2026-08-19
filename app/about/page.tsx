import Link from "next/link";
import { PageHero } from "../components/ContentLayout";

const purpose = [
  "Improve healthcare quality and patient safety",
  "Strengthen person-centred services across diverse care settings",
  "Support evidence-informed practice and practical risk management",
  "Enable continuous improvement through accreditation and certification",
];

const expertise = ["Physicians and nurses", "Health system administrators", "Quality, safety and risk-management specialists", "Allied health professionals"];

export default function AboutPage() {
  return <><PageHero eyebrow="ABOUT AACI" title="About AACI Asia Pacific" intro="Advancing person-centred care, patient safety and healthcare quality across the Asia Pacific region." />
    <main className="about-page page-content"><div className="container about-page__content">
      <section className="about-page__intro"><h2>Our Purpose</h2><p>AACI Asia Pacific is an independent accreditation and certification partner committed to advancing safer, higher-quality healthcare. We work with healthcare organizations, professional communities and leaders to translate quality ambitions into practical, sustainable improvement.</p></section>
      <section className="about-page__feature"><img className="about-page__portrait" src="/sompornk.jpg" alt="AACI representative standing beside the AACI logo" /><div><p className="eyebrow">OUR PURPOSE</p><h2>Improving care where it matters most.</h2><p>Our work brings internationally informed standards together with the local realities of healthcare delivery across Asia Pacific.</p><ul>{purpose.map((item)=><li key={item}>→ {item}</li>)}</ul><Link className="button button-navy" href="/contact">Contact us <span>→</span></Link></div></section>
      <section className="about-page__vision"><p className="eyebrow">OUR VISION</p><h2>Helping reduce avoidable harm in healthcare.</h2><p>Partnership with AACI Asia Pacific is a collaborative effort to improve outcomes for patients, families and the people who care for them.</p></section>
      <section className="about-page__feature about-page__feature--reverse"><div><p className="eyebrow">OUR PEOPLE</p><h2>Led by experts, focused on excellence.</h2><p>Our multidisciplinary team offers practical, solutions-oriented guidance grounded in real healthcare experience and a shared commitment to better care.</p><ul>{expertise.map((item)=><li key={item}>→ {item}</li>)}</ul><Link className="button button-navy" href="/contact">Get in touch <span>→</span></Link></div><img src="/healthcare-accreditation-team.png" alt="Healthcare professionals collaborating on quality improvement" /></section>
    </div></main>
  </>;
}
