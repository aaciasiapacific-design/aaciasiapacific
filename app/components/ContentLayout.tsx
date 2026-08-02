import Link from "next/link";

export const serviceGroups = [
  { title: "Accreditation", href: "/services/accreditation", items: [
    ["Healthcare Organizations", "/services/healthcare-accreditation"],
    ["Dental Organizations", "/services/dental-accreditation"],
  ] },
  { title: "Clinical Certification", href: "/services/certification", items: [
    ["Oncology Services", "/services/oncology-certification"], ["Maternity Services", "/services/maternity-certification"], ["Acute Stroke Care", "/services/acute-stroke-certification"], ["Stroke Shield", "/services/stroke-shield-certification"], ["Endoscopy Services", "/services/endoscopy-certification"],
  ] },
  { title: "Management System", href: "/services/management-system", items: [
    ["ISO 9001:2015", "/services/iso-9001"], ["EN 15224:2016", "/services/en-15224"], ["ISO 7101:2023", "/services/iso-7101"],
  ] },
  { title: "Academy & Courses", href: "/services/courses", items: [
    ["Surveyor / Lead Surveyor", "/services/surveyor-course"], ["Risk Register", "/services/risk-register-course"], ["ISO Lead Auditor", "/services/iso-lead-auditor"],
  ] },
];

const details: Record<string, { eyebrow: string; title: string; intro: string; bullets: string[] }> = {
  accreditation: { eyebrow: "AACI SERVICES", title: "Accreditation", intro: "AACI accreditation helps healthcare organizations improve safety, quality and effectiveness through internationally recognized standards and independent external assessment.", bullets: ["Promote continuous quality improvement", "Enhance patient and staff safety", "Improve clinical governance and accountability", "Strengthen public confidence and stakeholder trust"] },
  "healthcare-accreditation": { eyebrow: "ACCREDITATION", title: "Healthcare Organization Accreditation", intro: "A trusted framework for hospitals, outpatient centres, rehabilitation facilities, home care providers and other healthcare organizations seeking internationally benchmarked performance.", bullets: ["Patient-centred safety systems", "Evidence-informed clinical practice", "Objective external survey", "Practical pathway for sustained improvement"] },
  "dental-accreditation": { eyebrow: "ACCREDITATION", title: "Dental Organization Accreditation", intro: "AACI Dental Accreditation Standards help dental organizations strengthen clinical services, patient safety and governance within their unique scope of practice.", bullets: ["International dental-care best practice", "Practical, risk-based evaluation", "Quality systems tailored to dental services", "Recognition of commitment to excellence"] },
  certification: { eyebrow: "AACI SERVICES", title: "Clinical Excellence Certification", intro: "AACI Clinical Excellence Certification elevates clinical performance with structured, evidence-based systems designed to reduce variation and improve patient outcomes.", bullets: ["Standardized guideline-based practices", "Data-driven quality improvement", "Disease-specific care pathways", "Recognition that builds public trust"] },
  "management-system": { eyebrow: "AACI SERVICES", title: "Management System Certification", intro: "Internationally recognized management system certification designed specifically for healthcare organizations seeking consistent quality, reduced risk and stronger stakeholder confidence.", bullets: ["Alignment with ISO and healthcare-specific standards", "Independent validation of quality practice", "Improved organizational performance", "Support for regulatory compliance"] },
  courses: { eyebrow: "AACI ACADEMY", title: "Professional Education & Courses", intro: "AACI Academy equips healthcare professionals with practical skills for survey readiness, risk management and quality system leadership.", bullets: ["Surveyor and lead surveyor education", "Risk register capability", "ISO lead auditor training", "Peer learning for healthcare leaders"] },
};

const certificationTitles: Record<string, string> = { "oncology-certification": "Oncology Services Clinical Certification", "maternity-certification": "Maternity Services Certification", "acute-stroke-certification": "Acute Stroke Care Certification", "stroke-shield-certification": "Stroke Shield Certification", "endoscopy-certification": "Endoscopy Services Clinical Certification" };
const standardTitles: Record<string, string> = { "iso-9001": "ISO 9001:2015", "en-15224": "EN 15224:2016", "iso-7101": "ISO 7101:2023", "surveyor-course": "Surveyor / Lead Surveyor", "risk-register-course": "Risk Register", "iso-lead-auditor": "ISO Lead Auditor" };

export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return <section className="page-hero"><div className="container"><p className="eyebrow light">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></div></section>;
}

export function ServiceDetail({ slug }: { slug: string }) {
  const item = details[slug] ?? (certificationTitles[slug] ? { eyebrow: "CLINICAL CERTIFICATION", title: certificationTitles[slug], intro: "A focused AACI clinical certification pathway that supports safer, more reliable and evidence-based care.", bullets: ["Measurable clinical quality", "Improved patient outcomes", "Reliable care processes", "Recognition of clinical excellence"] } : { eyebrow: "AACI STANDARD", title: standardTitles[slug] ?? "AACI Program", intro: "A practical quality and management programme for healthcare organizations pursuing internationally recognized excellence.", bullets: ["Structured implementation support", "International best practices", "Risk and quality management", "Continuous improvement"] });
  return <><PageHero {...item}/><section className="page-content"><div className="container detail-layout"><div><h2>Built for better healthcare</h2><p>{item.intro}</p><p>AACI works collaboratively with organizations, bringing practical expertise and a clear route from aspiration to measurable performance.</p></div><aside><h3>Key outcomes</h3><ul>{item.bullets.map(x=><li key={x}>✓ {x}</li>)}</ul><Link className="button button-red" href="/accreditation/request">Request consultation <span>→</span></Link></aside></div></section></>;
}
