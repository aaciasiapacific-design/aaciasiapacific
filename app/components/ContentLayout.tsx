import Link from "next/link";
import { notFound } from "next/navigation";
import PublicCourseDirectory from "./PublicCourses";

export const serviceGroups = [
  { title: "Accreditation", href: "/services/accreditation", items: [
    ["Healthcare Organizations", "/services/healthcare-accreditation"],
    ["Dental Organizations", "/services/dental-accreditation"],
    ["Accredited Organizations", "/accredited-organizations"],
  ] },
  { title: "Clinical Certification", href: "/services/certification", items: [
    ["Oncology Services", "/services/oncology-certification"], ["Maternity Services", "/services/maternity-certification"], ["Acute Stroke Care", "/services/acute-stroke-certification"], ["Stroke Shield", "/services/stroke-shield-certification"], ["Endoscopy Services", "/services/endoscopy-certification"],
  ] },
  { title: "Management System", href: "/services/management-system", items: [
    ["ISO 9001:2015", "/services/iso-9001"], ["EN 15224:2016", "/services/en-15224"], ["ISO 7101:2023", "/services/iso-7101"],
  ] },
  { title: "Academy & Courses", href: "/services/courses", items: [
    ["APAC Surveyor Master Class 5", "/services/courses/apac-surveyor-master-class-5"],
    ["Oncology Services", "/services/courses/oncology-services"],
    ["Endoscopy Services", "/services/courses/endoscopy-services"],
    ["Maternity Services", "/services/courses/maternity-services"],
    ["Risk Register", "/services/courses/risk-register"],
    ["Acute Stroke Care", "/services/courses/acute-stroke-care"],
    ["Survey-Readiness", "/services/courses/survey-readiness"],
  ] },
];

export const aboutLinks: [string, string][] = [
  ["AACI Asia Office", "/about/asia-office"],
  ["Country Director", "/about/country-director"],
  ["Regional Advisory Board", "/about/regional-advisory-board"],
  ["Partnership", "/about/partnership"],
  ["AACI Surveyor", "/about/aaci-surveyor"],
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
const standardTitles: Record<string, string> = { "iso-9001": "ISO 9001:2015", "en-15224": "EN 15224:2016", "iso-7101": "ISO 7101:2023" };

export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  const pattern = Array.from(title).reduce((total, character) => total + character.charCodeAt(0), 0) % 6;
  return <section className={`page-hero page-hero--pattern-${pattern}`}><div className="container"><p className="eyebrow light">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></div></section>;
}

type SidebarContact = {
  name: string;
  email: string;
  phone: string;
  phoneHref: string;
  image?: string;
};

export const serviceContact: SidebarContact = { name: "Jutathip Intrarauangsri", email: "jintraruangsri@aacihealthcare.com", phone: "+66 94 895 1669", phoneHref: "+66948951669", image: "/team-jutathip-intrarauangsri.webp" };

export function ServiceContactCard({ contact = serviceContact }: { contact?: SidebarContact }) {
  return <div className="services-sidebar__contact services-sidebar__contact--person">
    {contact.image && <img src={contact.image} alt={contact.name} />}
    <div><span>YOUR AACI CONTACT</span><strong>{contact.name}</strong><a href={`mailto:${contact.email}`}>{contact.email}</a><a href={`tel:${contact.phoneHref}`}>{contact.phone}</a></div>
  </div>;
}

export function SubpageSidebar({ title = "Explore services", links, contact = serviceContact }: { title?: string; links: [string, string][]; contact?: SidebarContact }) {
  return <>
    <p className="eyebrow">START HERE</p>
    <h2>Find the right pathway.</h2>
    <p>Talk to our team about the support that fits your organization.</p>
    <Link className="button button-red" href="/accreditation/request">REQUEST CONSULTATION <span>→</span></Link>
    <nav><h3>{title}</h3>{links.map(([label, href]) => <Link key={href} href={href}>{label} <span>→</span></Link>)}</nav>
    <ServiceContactCard contact={contact} />
  </>;
}

export function ServiceDetail({ slug }: { slug: string }) {
  if (["surveyor-course", "risk-register-course", "iso-lead-auditor"].includes(slug)) notFound();
  if (slug === "accreditation") return <AccreditationDetail />;
  if (slug === "certification") return <CertificationDetail />;
  if (slug === "management-system") return <ManagementSystemDetail />;
  if (slug === "courses") return <CoursesDetail />;
  if (slug === "healthcare-accreditation") return <HealthcareAccreditationDetail />;
  if (slug === "dental-accreditation") return <DentalAccreditationDetail />;
  if (slug === "oncology-certification") return <OncologyCertificationDetail />;
  if (slug === "maternity-certification") return <MaternityCertificationDetail />;
  if (slug === "acute-stroke-certification") return <AcuteStrokeCertificationDetail />;
  if (slug === "stroke-shield-certification") return <StrokeShieldCertificationDetail />;
  if (slug === "endoscopy-certification") return <EndoscopyCertificationDetail />;
  if (slug === "iso-9001") return <Iso9001Detail />;
  if (slug === "en-15224") return <En15224Detail />;
  if (slug === "iso-7101") return <Iso7101Detail />;
  const item = details[slug] ?? (certificationTitles[slug] ? { eyebrow: "CLINICAL CERTIFICATION", title: certificationTitles[slug], intro: "A focused AACI clinical certification pathway that supports safer, more reliable and evidence-based care.", bullets: ["Measurable clinical quality", "Improved patient outcomes", "Reliable care processes", "Recognition of clinical excellence"] } : { eyebrow: "AACI STANDARD", title: standardTitles[slug] ?? "AACI Program", intro: "A practical quality and management programme for healthcare organizations pursuing internationally recognized excellence.", bullets: ["Structured implementation support", "International best practices", "Risk and quality management", "Continuous improvement"] });
  const links = serviceGroups.map((group) => [group.title, group.href] as [string, string]);
  return <><PageHero {...item}/><section className="page-content"><div className="container detail-layout"><div><h2>Built for better healthcare</h2><p>{item.intro}</p><p>AACI works collaboratively with organizations, bringing practical expertise and a clear route from aspiration to measurable performance.</p><h3 className="detail-outcomes">Key outcomes</h3><ul className="detail-outcomes__list">{item.bullets.map(x=><li key={x}>✓ {x}</li>)}</ul></div><aside className="services-sidebar subpage-sidebar"><SubpageSidebar links={links}/></aside></div></section></>;
}

function AccreditationDetail() {
  const links = serviceGroups.map((group) => [group.title, group.href] as [string, string]);
  return <><PageHero eyebrow="AACI SERVICES" title="Accreditation" intro="A trusted framework for healthcare organizations pursuing safer, higher-quality care." />
    <section className="page-content accreditation-page"><div className="container detail-layout">
      <div className="accreditation-content">
        <section className="accreditation-intro"><h2>Why Accreditation Matters</h2><p><strong>Accreditation</strong> helps healthcare organizations improve the safety, quality and effectiveness of the care they provide. It supports the development of consistent, patient-centered systems that enhance outcomes, reduce risk and build public trust.</p><p>It is formal public recognition by an independent accrediting body, confirming that an organization has met established standards through a rigorous external survey by trained professionals.</p></section>
        <section className="accreditation-feature"><div><h2>By aligning with accreditation standards, healthcare organizations:</h2><p>Accreditation fosters a culture of excellence, encouraging teamwork, leadership engagement and ongoing learning. It is a dynamic process that supports long-term transformation in healthcare delivery.</p><ul>{["Promote continuous quality improvement", "Enhance patient and staff safety", "Improve clinical governance and accountability", "Strengthen public confidence and stakeholder trust", "Support national and international best practices"].map((item)=><li key={item}>→ {item}</li>)}</ul></div><img src="/aaci-certification-standard.webp" alt="Healthcare professionals reviewing quality standards" /></section>
        <p className="accreditation-bridge">Whether you are a hospital, outpatient center, dental clinic or home care provider, AACI accreditation provides a trusted framework to guide improvement, measure success and elevate your impact in the health system.</p>
        <section className="accreditation-feature accreditation-feature--reverse"><img src="/management-system-certification.webp" alt="Healthcare team in a quality meeting" /><div><h2>AACI Standards: Designed by Practitioners, Driven by Excellence</h2><p>AACI has developed a comprehensive suite of accreditation standards tailored for hospitals and a wide range of healthcare organizations, addressing critical aspects of organizational performance.</p></div></section>
        <section className="accreditation-feature"><div><h2>Raising the Standard in Dental Care</h2><p>Every patient deserves exceptional dental care. AACI Dental Accreditation Standards help organizations strengthen clinical services within their scope of practice using internationally informed best practices.</p></div><img src="/aaci-accreditation.webp" alt="Healthcare practitioner consultation" /></section>
        <section className="accreditation-plan"><h2>AACI Accreditation Standards and Revision Plan</h2><p>AACI maintains a comprehensive set of accreditation standards for healthcare organizations. Standards are reviewed to remain practical, evidence-informed and responsive to the changing needs of healthcare.</p><div><span>Internationally recognized standards</span><span>Continuous quality review</span><span>Expert-led implementation</span></div></section>
      </div>
      <aside className="services-sidebar subpage-sidebar"><SubpageSidebar links={links}/></aside>
    </div></section>
  </>;
}

function CertificationDetail() {
  const links = serviceGroups.map((group) => [group.title, group.href] as [string, string]);
  const programmes: [string, string][] = [
    ["Oncology Services Clinical Certification", "/services/oncology-certification"],
    ["Maternity Services Certification", "/services/maternity-certification"],
    ["Acute Stroke Care Certification", "/services/acute-stroke-certification"],
    ["Endoscopy Services Clinical Certification", "/services/endoscopy-certification"],
    ["Stroke Shield Certification", "/services/stroke-shield-certification"],
  ];
  return <><PageHero eyebrow="AACI SERVICES" title="Certification" intro="Clinical Excellence Certification for reliable, evidence-based care." />
    <section className="page-content accreditation-page"><div className="container detail-layout">
      <div className="accreditation-content certification-content">
        <section className="accreditation-intro"><h2>Clinical Excellence Certification</h2><h3 className="certification-kicker">Raising the Bar for Quality, Safety, and Performance</h3><p>The AACI Clinical Excellence Certification™ is a flagship element of the AACI Quality and Patient Safety Program, created to elevate clinical performance and promote consistent, evidence-based care across healthcare organizations.</p></section>
        <section className="accreditation-feature accreditation-feature--reverse"><img src="/management-system-certification.webp" alt="Healthcare quality team working together" /><div><p>Grounded in internationally recognized clinical practice guidelines, AACI standards help organizations implement structured, high-reliability processes that reduce variation, mitigate risk and enhance overall performance.</p><ul>{["Risk mitigation through standardized, guideline-based practices", "Improved clinical performance and patient outcomes", "Data-driven quality improvement and transparency", "Recognition of excellence that strengthens public trust and staff engagement"].map((item)=><li key={item}>→ {item}</li>)}</ul></div></section>
        <p className="accreditation-bridge">The certification framework supports the creation and optimization of disease-specific management programs, ensuring care is coordinated, consistent and continuously improving. Organizations leverage measurable performance indicators to refine clinical pathways over time.</p>
        <section className="certification-section"><h2>A Mark of Distinction</h2><p>Achieving AACI Clinical Excellence Certification is a prestigious accomplishment, acknowledging leadership in clinical quality and patient-centered care.</p></section>
        <section className="certification-section certification-section--lined"><h2>Why Choose AACI Clinical Excellence Certification?</h2><p>Choosing AACI Clinical Excellence Certification offers strategic and clinical benefits that help healthcare organizations deliver safer, higher-quality and more efficient care:</p><ul>{["Enhances patient safety through standardized, evidence-based practices", "Improves clinical performance and measurable outcomes", "Supports development of disease-specific care pathways", "Promotes data-driven quality improvement", "Increases operational efficiency and reduces costs", "Builds public trust and professional credibility", "Aligns with international best practices and regulatory expectations"].map((item)=><li key={item}>{item}</li>)}</ul></section>
        <section className="accreditation-feature certification-programmes"><div><h2>Explore Our Clinical Certification Programmes</h2><nav>{programmes.map(([label, href])=><Link key={href} href={href}>→ {label}</Link>)}</nav></div><img src="/aaci-certification-standard.webp" alt="AACI clinical certification discussion" /></section>
      </div>
      <aside className="services-sidebar subpage-sidebar"><SubpageSidebar links={links}/></aside>
    </div></section>
  </>;
}

function ManagementSystemDetail() {
  const links = serviceGroups.map((group) => [group.title, group.href] as [string, string]);
  const standards: [string, string][] = [["ISO 9001:2015", "/services/iso-9001"], ["EN 15224:2016", "/services/en-15224"], ["ISO 7101:2023", "/services/iso-7101"]];
  return <><PageHero eyebrow="AACI SERVICES" title="Management System Certification" intro="Quality management systems designed for safer, consistent healthcare." />
    <section className="page-content accreditation-page"><div className="container detail-layout">
      <div className="accreditation-content management-content">
        <section className="accreditation-intro"><h2>Management System Certification</h2><p>Certification of your organization’s Quality Management System (QMS) is a powerful way to demonstrate commitment to consistency, continuous improvement and patient satisfaction.</p><p>AACI offers internationally recognized management system certification designed specifically for healthcare. Our programs help organizations streamline operations, reduce risk and build a culture of excellence aligned with global standards.</p></section>
        <section className="accreditation-feature accreditation-feature--reverse"><img src="/management-quality-review.png" alt="Healthcare leaders reviewing quality management documents" /><div><h2>Why Choose AACI Management System Certification?</h2><ul>{["Alignment with ISO 9001 and healthcare-specific standards", "Strong focus on patient-centered care and clinical integration", "Independent validation of quality and risk management practices", "Improved organizational performance and stakeholder confidence", "Support for compliance with national and international regulations"].map((item)=><li key={item}>→ {item}</li>)}</ul></div></section>
        <p className="accreditation-bridge">A management system brings people, processes and evidence together — creating a clear structure for measuring performance, managing risk and sustaining improvement across the organization.</p>
        <section className="accreditation-feature management-programmes"><div><h2>Explore Our Management System Certification Programmes</h2><nav>{standards.map(([label, href])=><Link key={href} href={href}>→ {label}</Link>)}</nav></div><img src="/management-quality-team.png" alt="Multidisciplinary healthcare quality team meeting" /></section>
      </div>
      <aside className="services-sidebar subpage-sidebar"><SubpageSidebar links={links}/></aside>
    </div></section>
  </>;
}

function CoursesDetail() {
  const offerings = [["Expert-led training", "Practical, up-to-date programmes delivered by industry experts and experienced surveyors."], ["Flexible learning", "Live online, on-demand and blended learning options that work around your schedule."], ["International standards", "Learning aligned with AACI standards and global healthcare best practice."], ["Professional development", "Build competence, strengthen leadership and advance your career."], ["Measurable impact", "Drive improvement, support compliance and create lasting value for your organisation."]];
  return <><PageHero eyebrow="AACI ACADEMY" title="Learn. Apply. Transform." intro="Empowering healthcare excellence through knowledge, practical tools and professional development." />
    <main className="academy-page"><section className="academy-intro container"><div><p className="eyebrow">KNOWLEDGE · EXCELLENCE · IMPACT</p><h2>Education that moves healthcare forward.</h2><p>AACI Academy is the educational arm of AACI, dedicated to advancing healthcare quality, patient safety and organisational excellence through world-class training, resources and professional development.</p><Link className="button button-red" href="/accreditation/request">Register your interest <span>→</span></Link></div><img src="/aaci-academy-overview.jpg" alt="AACI Academy healthcare education and training" /></section>
      <section className="academy-offerings"><div className="container"><header><p className="eyebrow">OUR CORE OFFERINGS</p><h2>Practical learning. Lasting impact.</h2></header><div className="academy-offerings__grid">{offerings.map(([title, copy], index)=><article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
      <PublicCourseDirectory />
    </main></>;
}

function HealthcareAccreditationDetail() {
  const links: [string, string][] = [["Healthcare Organization Accreditation", "/services/healthcare-accreditation"], ["Dental Organization Accreditation", "/services/dental-accreditation"], ["Accredited Organizations", "/accredited-organizations"], ["Clinical Certification", "/services/certification"], ["Management System Certification", "/services/management-system"]];
  const settings = ["Hospitals and health systems", "Outpatient specialist centers", "Rehabilitation and long-term care facilities", "Primary care and home care services", "Behavioral health and wellness providers"];
  return <><PageHero eyebrow="AACI ASIA PACIFIC" title="Healthcare Organization Accreditation" intro="Practical accreditation standards for safer, stronger healthcare across Asia Pacific." />
    <section className="page-content accreditation-page"><div className="container detail-layout">
      <div className="accreditation-content healthcare-content">
        <section className="accreditation-intro"><h2>Standards Designed by Practitioners, Driven by Excellence</h2><p>AACI Asia Pacific supports healthcare organizations with a comprehensive accreditation framework that strengthens patient safety, clinical quality, governance and operational performance.</p><p>Our standards are shaped by healthcare professionals and organizational leaders who understand the practical realities of care delivery across diverse Asia Pacific settings.</p></section>
        <section className="accreditation-feature accreditation-feature--reverse"><img src="/healthcare-accreditation-team.png" alt="Asia Pacific healthcare leaders reviewing accreditation standards" /><div><h2>Broad Scope, Local Relevance</h2><p>AACI standards are designed to be practical across a wide range of care environments, while remaining adaptable to local regulations, cultures and organizational priorities.</p><ul>{settings.map((item)=><li key={item}>→ {item}</li>)}</ul></div></section>
        <section className="certification-section certification-section--lined"><h2>A Robust, Collaborative Development Process</h2><p>Our standards development approach brings together experienced physicians, nurses, healthcare managers and subject-matter specialists. The result is a clear roadmap for teams seeking consistent improvement and meaningful outcomes.</p></section>
        <section className="accreditation-feature"><div><h2>Continuous Improvement and Responsiveness</h2><p>Healthcare is continually evolving. AACI Asia Pacific reviews feedback, emerging practice, technology and risk-management priorities so that standards remain practical, relevant and evidence informed.</p><p>Organizations receive timely, collaborative guidance as they interpret requirements and turn them into sustainable systems.</p></div><img src="/healthcare-accreditation-rounds.png" alt="Clinical team conducting a quality improvement round" /></section>
        <section className="accreditation-plan"><h2>An Integrated Pathway to Trust</h2><p>Accreditation can bring clinical, operational and risk-management priorities together in one coherent framework — helping organizations demonstrate a lasting commitment to safe, person-centered healthcare.</p><div><span>Patient safety</span><span>Clinical governance</span><span>Risk management</span><span>Continuous improvement</span></div></section>
      </div>
      <aside className="services-sidebar subpage-sidebar"><SubpageSidebar title="Explore accreditation" links={links}/></aside>
    </div></section>
  </>;
}

function DentalAccreditationDetail() {
  const links: [string, string][] = [["Healthcare Organization Accreditation", "/services/healthcare-accreditation"], ["Dental Organization Accreditation", "/services/dental-accreditation"], ["Accredited Organizations", "/accredited-organizations"], ["Clinical Certification", "/services/certification"], ["Management System Certification", "/services/management-system"]];
  const procedures = ["Restorative, orthodontic, endodontic and other dental services", "Topical and nerve-block anesthesia practices", "Moderate-sedation services, where provided", "Clinical documentation, consent and follow-up care"];
  const risks = ["Medication and procedural safety", "Infection prevention and equipment readiness", "Clear consent, documentation and continuity of care", "Alignment with applicable national laws and regulations"];
  return <><PageHero eyebrow="AACI ASIA PACIFIC" title="Dental Organization Accreditation" intro="A practical quality framework for safer, patient-centred dental care across Asia Pacific." />
    <section className="page-content accreditation-page"><div className="container detail-layout">
      <div className="accreditation-content dental-content">
        <section className="accreditation-intro"><h2>Internationally Informed Standards for Dental Organizations</h2><p>Every patient deserves exceptional dental care — regardless of location, specialty or the size of the practice. AACI Asia Pacific helps dental organizations strengthen clinical quality, patient safety and governance through a structured accreditation framework.</p><p>Our Dental Accreditation Standards translate internationally informed practice into practical expectations that can be applied within each organization’s scope of service and local regulatory context.</p></section>
        <section className="accreditation-feature accreditation-feature--reverse"><img src="/dental-accreditation-quality.png" alt="Dental clinician and practice manager reviewing quality documents" /><div><h2>Designed for Everyday Dental Practice</h2><p>The framework supports consistent, reliable delivery of dental services while helping teams make safety and quality visible across the patient journey.</p><ul>{procedures.map((item)=><li key={item}>→ {item}</li>)}</ul></div></section>
        <section className="certification-section certification-section--lined"><h2>Quality, Safety and Risk Awareness</h2><p>AACI Asia Pacific encourages a culture of continuous improvement, enabling dental teams to identify risk early, learn from performance data and build trust with patients and communities.</p><ul>{risks.map((item)=><li key={item}>{item}</li>)}</ul></section>
        <section className="accreditation-feature"><div><h2>A Clear Pathway for Safer Care</h2><p>Accreditation provides a disciplined framework for internal review and external evaluation. It helps dental organizations reduce avoidable harm, improve patient experience and demonstrate a sustained commitment to high-quality care.</p><p>For services involving deep sedation or general anesthesia, AACI Asia Pacific can help organizations identify the most appropriate healthcare accreditation pathway.</p></div><img src="/dental-accreditation-care.png" alt="Dentist and dental nurse providing patient-centred care" /></section>
        <section className="accreditation-plan"><h2>What Dental Accreditation Supports</h2><p>A clear foundation for teams who want to strengthen reliable systems, improve outcomes and earn lasting patient confidence.</p><div><span>Patient safety</span><span>Clinical quality</span><span>Risk management</span><span>Continuous improvement</span></div></section>
      </div>
      <aside className="services-sidebar subpage-sidebar"><SubpageSidebar title="Explore accreditation" links={links}/></aside>
    </div></section>
  </>;
}

function OncologyCertificationDetail() {
  const links: [string, string][] = [["Oncology Services Clinical Certification", "/services/oncology-certification"], ["Maternity Services Certification", "/services/maternity-certification"], ["Acute Stroke Care Certification", "/services/acute-stroke-certification"], ["Endoscopy Services Clinical Certification", "/services/endoscopy-certification"], ["Stroke Shield Certification", "/services/stroke-shield-certification"]];
  const outcomes = ["Strengthen multidisciplinary care systems and clinical processes", "Use measurable indicators to support safer, more consistent outcomes", "Build a culture of continuous improvement, innovation and accountability"];
  const benefits = ["Demonstrate commitment to high-quality, person-centred cancer care", "Support care pathways that reflect international evidence and local regulatory requirements", "Identify opportunities to improve treatment planning, coordination and symptom management", "Gain practical feedback from experienced clinical-quality professionals", "Build team capability and shared ownership of quality across the service"];
  const scope = ["Governance, leadership and multidisciplinary decision-making", "Early detection, health promotion and screening pathways", "Diagnostic coordination, including radiology, pathology and nuclear medicine", "Core treatment modalities: surgery, radiotherapy and systemic therapies", "Medication safety, supportive care, palliative care and patient dignity", "Psycho-oncology, social counselling, rehabilitation, education and research"];
  return <><PageHero eyebrow="AACI ASIA PACIFIC" title="Oncology Services Clinical Certification" intro="A practical clinical-certification pathway for coordinated, safe and person-centred cancer care across Asia Pacific." />
    <section className="page-content accreditation-page"><div className="container detail-layout">
      <div className="accreditation-content oncology-content">
        <section className="accreditation-intro"><h2>Oncology Services Clinical Certification</h2><p>Cancer care requires coordination, consistency and compassion across every stage of the care continuum. AACI Asia Pacific supports oncology services in strengthening systems for safe, evidence-informed and patient-centred care — from screening and diagnosis through treatment, survivorship and palliative support.</p><p>Our approach is designed to be relevant to the diverse capabilities, resources and regulatory settings found across Asia Pacific, while maintaining a clear focus on measurable quality and meaningful patient outcomes.</p></section>
        <section className="accreditation-feature accreditation-feature--reverse"><img src="/healthcare-accreditation-team.png" alt="Clinical team reviewing cancer-care quality processes" /><div><h2>Building Reliable Cancer Care</h2><p>Certification helps services turn clinical knowledge into reliable daily practice, with clear governance, coordinated pathways and shared accountability across multidisciplinary teams.</p><ul>{outcomes.map((item)=><li key={item}>→ {item}</li>)}</ul></div></section>
        <section className="certification-section certification-section--lined"><h2>Why Choose Oncology Clinical Certification?</h2><p>Organizations can use the framework to improve the quality, safety and consistency of cancer services while adapting implementation to local needs.</p><ul>{benefits.map((item, index)=><li key={item}><strong>{index + 1}.</strong> {item}</li>)}</ul></section>
        <section className="accreditation-feature"><div><h2>What Does the Review Cover?</h2><p>The clinical review focuses on high-risk, high-impact areas of oncology care delivery, helping services identify practical priorities for improvement.</p><ul>{scope.map((item)=><li key={item}>• {item}</li>)}</ul></div><img src="/healthcare-accreditation-rounds.png" alt="Healthcare team conducting a clinical quality review" /></section>
        <section className="accreditation-plan"><h2>Scalable Support for Every Oncology Service</h2><p>Whether establishing a new oncology programme or strengthening an existing cancer centre, AACI Asia Pacific provides a clear pathway for sustainable improvement with minimal disruption to care delivery.</p><div><span>Multidisciplinary care</span><span>Patient safety</span><span>Clinical governance</span><span>Continuous improvement</span></div></section>
      </div>
      <aside className="services-sidebar subpage-sidebar"><SubpageSidebar title="Explore clinical certification" links={links}/></aside>
    </div></section>
  </>;
}

function MaternityCertificationDetail() {
  const links: [string, string][] = [["Oncology Services Clinical Certification", "/services/oncology-certification"], ["Maternity Services Certification", "/services/maternity-certification"], ["Acute Stroke Care Certification", "/services/acute-stroke-certification"], ["Endoscopy Services Clinical Certification", "/services/endoscopy-certification"], ["Stroke Shield Certification", "/services/stroke-shield-certification"]];
  const priorities = ["Clinical governance that supports clear oversight and timely escalation", "Evidence-informed maternity practice across the care journey", "Practical measurement and review for safer outcomes"];
  const standards = ["Antenatal assessment, risk screening and birth planning", "Labour, birth and postnatal care pathways", "Maternal and neonatal emergency readiness", "Respectful care, informed consent and clear communication"];
  return <><PageHero eyebrow="AACI ASIA PACIFIC" title="Maternity Services Certification" intro="A clinical-certification pathway for safer, respectful and coordinated maternity care across Asia Pacific." />
    <section className="page-content accreditation-page"><div className="container detail-layout">
      <div className="accreditation-content maternity-content">
        <section className="accreditation-intro"><h2>Reliable Care for Every Mother and Newborn</h2><p>AACI Asia Pacific helps maternity teams deliver safe, compassionate and consistent care across antenatal, birth and postnatal services. The framework reflects international evidence while remaining practical for the diverse clinical and regulatory settings across Asia Pacific.</p></section>
        <section className="accreditation-feature accreditation-feature--reverse"><img src="/aaci-certification-standard.webp" alt="Healthcare professionals discussing maternity-care quality" /><div><h2>Two Modules, One Clear Standard</h2><p>The Clinical Excellence Standard for Maternity Services brings together clinical governance and clinical maternity practice — helping teams turn good practice into dependable daily care.</p><ul>{priorities.map((item)=><li key={item}>→ {item}</li>)}</ul></div></section>
        <section className="certification-section certification-section--lined"><h2>Focused on Safer Outcomes</h2><p>Certification supports a disciplined approach to quality, safety and patient experience for mothers, newborns and families.</p><ul>{standards.map((item)=><li key={item}>{item}</li>)}</ul></section>
        <section className="accreditation-plan"><h2>Care That Families Can Trust</h2><p>A practical route to safer, more responsive maternity care through shared accountability and continuous learning.</p><div><span>Maternal safety</span><span>Newborn care</span><span>Clinical governance</span><span>Continuous improvement</span></div></section>
      </div>
      <aside className="services-sidebar subpage-sidebar"><SubpageSidebar title="Explore clinical certification" links={links}/></aside>
    </div></section>
  </>;
}

function AcuteStrokeCertificationDetail() {
  const links: [string, string][] = [["Oncology Services Clinical Certification", "/services/oncology-certification"], ["Maternity Services Certification", "/services/maternity-certification"], ["Acute Stroke Care Certification", "/services/acute-stroke-certification"], ["Endoscopy Services Clinical Certification", "/services/endoscopy-certification"], ["Stroke Shield Certification", "/services/stroke-shield-certification"]];
  const outcomes = ["Rapid identification, assessment and treatment of stroke", "Evidence-informed acute and sub-acute care pathways", "Safer coordination, communication and quality improvement"];
  const foundations = ["Outcome-based performance evaluation", "Process-driven improvement using the PDCA cycle", "Risk assessment and practical mitigation strategies", "Management systems that connect clinical and operational processes"];
  return <><PageHero eyebrow="AACI ASIA PACIFIC" title="Acute Stroke Care Certification" intro="A practical clinical-certification pathway for faster, safer and more coordinated stroke care across Asia Pacific." />
    <section className="page-content accreditation-page"><div className="container detail-layout">
      <div className="accreditation-content stroke-content">
        <section className="accreditation-intro"><h2>Raising the Standard for Time-Critical Stroke Care</h2><p>Stroke is a leading cause of death and long-term disability. Timely, evidence-informed care can make a meaningful difference to survival, recovery and quality of life.</p><p>AACI Asia Pacific supports organizations in building structured stroke-care systems that are appropriate to their level of readiness, local referral networks and clinical resources.</p></section>
        <section className="accreditation-feature accreditation-feature--reverse"><img src="/acute-stroke-team.png" alt="Asia Pacific stroke-care team reviewing brain imaging" /><div><h2>Comprehensive Standards for Acute Stroke Services</h2><p>The certification framework supports stroke centres in organizing reliable clinical pathways, using data to improve performance and embedding a shared culture of safety and accountability.</p><ul>{outcomes.map((item)=><li key={item}>→ {item}</li>)}</ul></div></section>
        <section className="certification-section certification-section--lined"><h2>A Systematic, Outcome-Driven Approach</h2><p>Our framework brings clinical and operational priorities together, helping teams assess performance, manage risk and sustain improvement across the stroke-care journey.</p><ul>{foundations.map((item)=><li key={item}>{item}</li>)}</ul></section>
        <section className="accreditation-feature"><div><h2>From Acute Intervention to Recovery</h2><p>Certification supports coordinated care beyond the initial emergency response — including safe transfer, rehabilitation planning, patient and family communication, and ongoing review of outcomes.</p><p>The result is a clearer foundation for better patient outcomes, stronger team preparedness and greater confidence across the community and referral network.</p></div><img src="/acute-stroke-recovery.png" alt="Stroke survivor working with rehabilitation professionals" /></section>
        <section className="accreditation-plan"><h2>Clinical Excellence That Makes a Difference</h2><p>A practical route to strengthen stroke services, reduce variation and deliver more reliable care where every minute matters.</p><div><span>Rapid response</span><span>Clinical coordination</span><span>Risk management</span><span>Recovery-focused care</span></div></section>
      </div>
      <aside className="services-sidebar subpage-sidebar"><SubpageSidebar title="Explore clinical certification" links={links}/></aside>
    </div></section>
  </>;
}

function StrokeShieldCertificationDetail() {
  const links: [string, string][] = [["Oncology Services Clinical Certification", "/services/oncology-certification"], ["Maternity Services Certification", "/services/maternity-certification"], ["Acute Stroke Care Certification", "/services/acute-stroke-certification"], ["Endoscopy Services Clinical Certification", "/services/endoscopy-certification"], ["Stroke Shield Certification", "/services/stroke-shield-certification"]];
  const benefits = ["Improved resident safety, outcomes and quality of life", "Greater staff confidence and preparedness", "Stronger communication with families and referral partners", "More reliable care processes and sustainable quality improvement"];
  const pillars = ["Early recognition, monitoring and escalation of stroke symptoms", "Evidence-informed care protocols tailored to residential settings", "Staff education and interdisciplinary communication", "Risk management, outcome review and continuous improvement"];
  return <><PageHero eyebrow="AACI ASIA PACIFIC" title="Stroke Shield Certification" intro="A practical framework for consistent, person-centred stroke care in residential and long-term care settings across Asia Pacific." />
    <section className="page-content accreditation-page"><div className="container detail-layout">
      <div className="accreditation-content stroke-shield-content">
        <section className="accreditation-intro"><h2>Clinical Excellence in Residential Stroke Care</h2><p>Stroke is a significant concern for residents in long-term and residential care. AACI Asia Pacific helps providers create clear, dependable systems for recognising symptoms, responding appropriately and supporting recovery.</p><p>The framework is designed for the diverse care models, workforce structures and referral networks found across Asia Pacific, while keeping dignity, safety and quality of life at the centre.</p></section>
        <section className="accreditation-feature accreditation-feature--reverse"><img src="/stroke-shield-prevention.png" alt="Nurse supporting stroke-risk monitoring with a resident and family member" /><div><h2>Confidence for Residents, Families and Teams</h2><p>Stroke Shield Certification provides practical protocols, training and review processes that help care teams deliver consistent care and build confidence with every stakeholder.</p><ul>{benefits.map((item)=><li key={item}>→ {item}</li>)}</ul></div></section>
        <section className="certification-section certification-section--lined"><h2>What Stroke Shield Supports</h2><p>A structured, evidence-informed approach that turns stroke care into a reliable part of everyday residential care delivery.</p><ul>{pillars.map((item)=><li key={item}>{item}</li>)}</ul></section>
        <section className="accreditation-feature"><div><h2>Care That Strengthens the Whole Organization</h2><p>By embedding consistent stroke-care practices, providers can improve staff experience, support clearer coordination with hospitals and rehabilitation services, and create a stronger foundation for quality improvement.</p><p>It is a practical route to safer care, better resident experience and sustained confidence in the service.</p></div><img src="/stroke-shield-care-team.png" alt="Residential care team and resident reviewing a care plan" /></section>
        <section className="accreditation-plan"><h2>A Stronger Standard of Care</h2><p>Reliable systems that support prevention, rapid response and recovery — delivered with dignity and collaboration.</p><div><span>Resident safety</span><span>Staff readiness</span><span>Family confidence</span><span>Continuous improvement</span></div></section>
      </div>
      <aside className="services-sidebar subpage-sidebar"><SubpageSidebar title="Explore clinical certification" links={links}/></aside>
    </div></section>
  </>;
}

function EndoscopyCertificationDetail() {
  const links: [string, string][] = [["Oncology Services Clinical Certification", "/services/oncology-certification"], ["Maternity Services Certification", "/services/maternity-certification"], ["Acute Stroke Care Certification", "/services/acute-stroke-certification"], ["Endoscopy Services Clinical Certification", "/services/endoscopy-certification"], ["Stroke Shield Certification", "/services/stroke-shield-certification"]];
  const risks = ["Following validated reprocessing instructions at every stage", "Thorough cleaning of internal and external components", "Correct selection and preparation of disinfecting agents", "Ongoing staff competency, equipment checks and quality assurance"];
  const scope = ["Pre-cleaning, leak testing and manual cleaning", "High-level disinfection, sterilisation and safe storage", "Flexible GI endoscopes and bronchoscopes", "Flexible and semi-rigid operative endoscopes"];
  return <><PageHero eyebrow="AACI ASIA PACIFIC" title="Endoscopy Services Clinical Certification" intro="A practical clinical-certification pathway for safe, reliable and consistently managed endoscopy services across Asia Pacific." />
    <section className="page-content accreditation-page"><div className="container detail-layout">
      <div className="accreditation-content endoscopy-content">
        <section className="accreditation-intro"><h2>Enhancing Safety Across the Endoscopy Journey</h2><p>Endoscopy safety extends beyond a single procedure. It relies on strong clinical systems, trained teams and reliable reprocessing practices that protect patients throughout the care continuum.</p><p>AACI Asia Pacific helps services translate internationally informed best practice into practical, consistent processes that work within local regulations, resources and operational settings.</p></section>
        <section className="accreditation-feature accreditation-feature--reverse"><img src="/endoscopy-safety-huddle.png" alt="Endoscopy team reviewing clinical safety procedures" /><div><h2>Clinical Excellence for Everyday Practice</h2><p>The framework supports coordinated clinical care, clear team communication and evidence-informed quality systems that reduce risk and build confidence in every endoscopy service.</p><ul>{risks.map((item)=><li key={item}>→ {item}</li>)}</ul></div></section>
        <section className="certification-section certification-section--lined"><h2>Reliable Reprocessing, Safer Care</h2><p>Consistent reprocessing is essential to infection prevention and patient safety. The standards provide a clear reference for teams responsible for endoscope handling and processing.</p><ul>{scope.map((item)=><li key={item}>{item}</li>)}</ul></section>
        <section className="accreditation-feature"><div><h2>A System That Supports Trust</h2><p>Certification helps facilities establish repeatable practices, assess performance and maintain continuous quality assurance across their endoscopy service.</p><p>It provides a structured pathway for teams seeking safer care, stronger compliance and lasting patient confidence.</p></div><img src="/endoscopy-reprocessing.png" alt="Sterile processing professionals inspecting flexible endoscopes" /></section>
        <section className="accreditation-plan"><h2>Safe, Consistent, Trusted</h2><p>Practical standards that connect clinical quality, infection prevention and continuous improvement.</p><div><span>Patient safety</span><span>Infection prevention</span><span>Staff competence</span><span>Quality assurance</span></div></section>
      </div>
      <aside className="services-sidebar subpage-sidebar"><SubpageSidebar title="Explore clinical certification" links={links}/></aside>
    </div></section>
  </>;
}

function Iso9001Detail() {
  const links: [string, string][] = [["ISO 9001:2015", "/services/iso-9001"], ["EN 15224:2016", "/services/en-15224"], ["ISO 7101:2023", "/services/iso-7101"], ["Management System Certification", "/services/management-system"]];
  const focus = ["Continuous improvement and measurable performance", "Consistent clinical and operational processes", "Patient, family and stakeholder experience", "A quality management system that supports reliable care"];
  const pathway = ["Application and readiness review", "Stage 1 and Stage 2 assessment", "Certification decision and award", "Periodic surveillance and recertification", "Managing significant changes to the certified system"];
  return <><PageHero eyebrow="AACI ASIA PACIFIC" title="ISO 9001:2015" intro="A practical quality-management framework for more consistent, patient-centred healthcare services across Asia Pacific." />
    <section className="page-content accreditation-page"><div className="container detail-layout">
      <div className="accreditation-content iso-content">
        <section className="accreditation-intro"><h2>Why ISO 9001 Matters in Healthcare</h2><p>ISO 9001 is a widely used quality-management standard that helps healthcare organizations establish clear, repeatable systems for delivering dependable services.</p><p>For hospitals and care providers across Asia Pacific, it provides a practical structure for improving processes, strengthening accountability and supporting the experience and outcomes that matter to patients.</p></section>
        <section className="accreditation-feature accreditation-feature--reverse"><img src="/iso-9001-quality-management.png" alt="Healthcare leaders reviewing quality management performance" /><div><h2>A Stronger System for Everyday Quality</h2><p>ISO 9001 focuses on the systems and processes that influence care delivery — allowing organizations to identify good practice, manage variation and sustain improvement over time.</p><ul>{focus.map((item)=><li key={item}>→ {item}</li>)}</ul></div></section>
        <section className="certification-section certification-section--lined"><h2>Your Certification Pathway</h2><p>AACI Asia Pacific supports organizations through a clear, structured certification journey that can be aligned to local regulations and the organization’s operational context.</p><ul>{pathway.map((item, index)=><li key={item}><strong>{index + 1}.</strong> {item}</li>)}</ul></section>
        <section className="accreditation-plan"><h2>Quality You Can Build On</h2><p>An effective quality management system connects people, processes and performance — supporting reliable care and continuous progress.</p><div><span>Process consistency</span><span>Patient focus</span><span>Risk awareness</span><span>Continuous improvement</span></div></section>
      </div>
      <aside className="services-sidebar subpage-sidebar"><SubpageSidebar title="Explore management systems" links={links}/></aside>
    </div></section>
  </>;
}

function En15224Detail() {
  const links: [string, string][] = [["ISO 9001:2015", "/services/iso-9001"], ["EN 15224:2016", "/services/en-15224"], ["ISO 7101:2023", "/services/iso-7101"], ["Management System Certification", "/services/management-system"]];
  const features = ["ISO 9001 principles interpreted for healthcare services", "Clinical risk management across planning, delivery and evaluation", "Integrated quality management across the entire care continuum", "Practical application for multidisciplinary healthcare organizations"];
  const pathway = ["Application and readiness review", "Stage 1 and Stage 2 assessment", "Certification decision and award", "Periodic surveillance and recertification", "Managing significant changes to the certified system"];
  return <><PageHero eyebrow="AACI ASIA PACIFIC" title="EN 15224:2016" intro="A healthcare-specific quality-management framework for safer, more integrated and consistently delivered care across Asia Pacific." />
    <section className="page-content accreditation-page"><div className="container detail-layout">
      <div className="accreditation-content en15224-content">
        <section className="accreditation-intro"><h2>Quality Management Designed for Healthcare</h2><p>EN 15224:2016 builds on the principles of ISO 9001 with interpretations tailored to healthcare. It helps organizations connect clinical quality, risk management and service delivery in one practical management system.</p><p>For providers across Asia Pacific, the framework can be adapted to diverse service models, regulatory settings and local patient needs while keeping quality and safety central to every process.</p></section>
        <section className="accreditation-feature accreditation-feature--reverse"><img src="/en-15224-integrated-care.png" alt="Interdisciplinary healthcare team reviewing integrated quality processes" /><div><h2>Integrated Care, Clearer Control</h2><p>The standard brings a healthcare lens to everyday quality management, helping organizations make clinical risk visible and strengthen continuity across the care journey.</p><ul>{features.map((item)=><li key={item}>→ {item}</li>)}</ul></div></section>
        <section className="certification-section certification-section--lined"><h2>Your Certification Pathway</h2><p>AACI Asia Pacific provides structured support to help organizations understand the requirements, prepare their systems and demonstrate consistent implementation.</p><ul>{pathway.map((item, index)=><li key={item}><strong>{index + 1}.</strong> {item}</li>)}</ul></section>
        <section className="accreditation-plan"><h2>A System for Safer Care</h2><p>A practical management approach that connects process discipline with clinical relevance and continuous improvement.</p><div><span>Clinical risk</span><span>Integrated care</span><span>Process quality</span><span>Patient focus</span></div></section>
      </div>
      <aside className="services-sidebar subpage-sidebar"><SubpageSidebar title="Explore management systems" links={links}/></aside>
    </div></section>
  </>;
}

function Iso7101Detail() {
  const links: [string, string][] = [["ISO 9001:2015", "/services/iso-9001"], ["EN 15224:2016", "/services/en-15224"], ["ISO 7101:2023", "/services/iso-7101"], ["Management System Certification", "/services/management-system"]];
  const features = ["Integration of clinical quality and organizational governance", "A clear focus on patient safety, equity and access", "Leadership accountability and a culture of continuous learning", "Quality systems that support resilient, sustainable healthcare"];
  const pathway = ["Application and readiness review", "Stage 1 and Stage 2 assessment", "Certification decision and award", "Periodic surveillance and recertification", "Managing significant changes to the certified system"];
  return <><PageHero eyebrow="AACI ASIA PACIFIC" title="ISO 7101:2023" intro="A healthcare quality-management framework for accountable leadership, patient-centred care and resilient systems across Asia Pacific." />
    <section className="page-content accreditation-page"><div className="container detail-layout">
      <div className="accreditation-content iso7101-content">
        <section className="accreditation-intro"><h2>Healthcare Quality Management for the Future</h2><p>ISO 7101:2023 is a global standard designed specifically for quality management and leadership in healthcare organizations. It connects governance, clinical quality and strategic decision-making in one integrated framework.</p><p>AACI Asia Pacific helps organizations apply this framework in ways that respect local regulations, population needs and resource realities — while maintaining a clear commitment to safe, equitable and person-centred care.</p></section>
        <section className="accreditation-feature accreditation-feature--reverse"><img src="/iso-7101-healthcare-governance.png" alt="Healthcare leaders reviewing quality governance performance" /><div><h2>Leadership That Enables Better Care</h2><p>ISO 7101 supports leaders in turning quality commitments into visible systems, measurable performance and shared accountability throughout the organization.</p><ul>{features.map((item)=><li key={item}>→ {item}</li>)}</ul></div></section>
        <section className="certification-section certification-section--lined"><h2>Your Certification Pathway</h2><p>AACI Asia Pacific provides a structured route for organizations preparing a Healthcare Quality Management System and demonstrating sustained implementation.</p><ul>{pathway.map((item, index)=><li key={item}><strong>{index + 1}.</strong> {item}</li>)}</ul></section>
        <section className="accreditation-plan"><h2>Quality, Governance and Trust</h2><p>A future-ready approach to healthcare excellence that strengthens the organization and the care it delivers.</p><div><span>Patient safety</span><span>Leadership</span><span>Equity &amp; access</span><span>Resilient systems</span></div></section>
      </div>
      <aside className="services-sidebar subpage-sidebar"><SubpageSidebar title="Explore management systems" links={links}/></aside>
    </div></section>
  </>;
}
