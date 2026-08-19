import { PageHero, SubpageSidebar, aboutLinks } from "../../components/ContentLayout";
import PublicPeopleDirectory from "../../components/PublicPeopleDirectory";

const content: Record<string, { title: string; intro: string; items: string[] }> = {
  "asia-office": { title: "AACI Asia Office", intro: "Our management team brings decades of hands-on experience in healthcare delivery, policy, accreditation and risk management.", items: ["Somporn Kumphong, MD — Chief Executive Officer", "Rewat Denjakawal — Managing Director", "Naphatsinth Sinthoon — COO, Accreditation Affairs", "Nirachit Rerngsangvatana — COO, Academy Affairs"] },
  "country-director": { title: "Country Director", intro: "Regional leadership connects AACI’s global standards with practical, locally relevant support.", items: ["Leadership with healthcare expertise", "Regional programme support", "A collaborative approach to improvement"] },
  "regional-advisory-board": { title: "Regional Advisory Board", intro: "Our advisory board provides independent insight and professional guidance to advance person-centred healthcare across the region.", items: ["Clinical and operational expertise", "Evidence-informed strategic advice", "Commitment to quality and safety"] },
  partnership: { title: "Partnership", intro: "AACI partners with organizations that share a commitment to safer care, responsible governance and continuous improvement.", items: ["Collaborative implementation", "Shared knowledge and practical support", "A global-quality perspective"] },
};

const partnerWorks = [
  { name: "Thai Clinic Association", image: "/partner-thai-clinic.webp" },
  { name: "Thai Association and Academy of Cosmetic Surgery and Medicine", image: "/partner-cosmetic.webp" },
  { name: "Global Healthcare Accreditation", image: "/partner-gha.webp" },
  { name: "Thai Medical & Wellness Tourism Association", image: "/partner-tmwta.webp" },
  { name: "Department of Health Service Support", image: "/partner-dhss.webp" },
  { name: "Naresuan University", image: "/partner-naresuan.webp" },
  { name: "Myanmar Private Hospitals’ Association", image: "/partner-myanmar.webp" },
  { name: "Bangladesh Private Hospital, Clinic & Diagnostic Association", image: "/partner-bphcda.webp" },
  { name: "Philippine Council on Accreditation of Healthcare Organizations", image: "/partner-pcaho.webp" },
];

function CountryDirectorPage() {
  return <><PageHero eyebrow="AACI ASIA PACIFIC" title="Country Directors" intro="Local leadership that connects AACI standards with the needs of healthcare communities across Asia Pacific." />
    <section className="page-content country-directors"><div className="container">
      <section className="country-directors__intro"><h2>Leading quality through trusted local partnerships</h2><p>Country Directors play a pivotal role in advancing healthcare quality and patient safety through trusted relationships at national and local levels. They connect internationally informed standards with the practical realities of local healthcare systems.</p><p>With a deep understanding of local context and culture, they work closely with providers, professional bodies and community stakeholders to enable safer, more accessible and person-centred care.</p></section>
      <PublicPeopleDirectory section="country_director" />
    </div></section>
  </>;
}

function RegionalAdvisoryBoardPage() {
  return <><PageHero eyebrow="AACI ASIA PACIFIC" title="Regional Advisory Board" intro="Strategic guidance, expertise and regional insight to advance quality and patient safety across Asia Pacific." />
    <section className="page-content advisory-board"><div className="container">
      <section className="advisory-board__intro"><p>The AACI Regional Advisory Board provides strategic guidance, professional expertise and thought leadership to advance healthcare quality and patient safety across diverse healthcare systems in Asia Pacific.</p><p>Our respected leaders strengthen regional collaboration and help align internationally recognised standards with local realities—working with healthcare institutions, professional associations, policymakers and communities to support sustainable improvement.</p></section>
      <section className="advisory-board__principles"><div><span>OUR ROLE</span><h2>Regional perspective.<br />Practical impact.</h2></div><ul><li>Strengthen cross-border collaboration and shared learning.</li><li>Bring local insight to internationally informed standards.</li><li>Champion safe, person-centred and sustainable care.</li></ul></section>
      <PublicPeopleDirectory section="regional_advisory_board" />
    </div></section>
  </>;
}

function PartnershipPage() {
  return <><PageHero eyebrow="AACI ASIA PACIFIC" title="Partnership" intro="Working together to make safer, higher-quality healthcare more achievable across Asia Pacific." />
    <section className="page-content partnership-page"><div className="container">
      <section className="partnership-page__lead"><div><p className="eyebrow">BETTER TOGETHER</p><h2>Partnerships that turn standards into meaningful progress.</h2><p>AACI Asia Pacific partners with healthcare providers, professional associations, education institutions and public-sector leaders who share a commitment to quality, safety and person-centred care.</p><p>We combine internationally informed frameworks with local expertise to help each organisation build capability and make improvement lasting.</p></div><img src="/healthcare-accreditation-team.png" alt="Healthcare professionals collaborating" /></section>
      <section className="partnership-page__ways"><article><span>01</span><h3>Healthcare organisations</h3><p>Build practical accreditation, certification and quality-improvement pathways around your clinical and operational priorities.</p></article><article><span>02</span><h3>Professional bodies</h3><p>Share expertise, strengthen professional development and advance evidence-informed practice across the region.</p></article><article><span>03</span><h3>Education &amp; public partners</h3><p>Develop learning, leadership and system-wide initiatives that respond to local healthcare needs.</p></article></section>
      <section className="partnership-page__network"><header><p className="eyebrow">OUR PARTNER NETWORK</p><h2>Collaborating across the region.</h2><p>We are proud to work with healthcare associations, universities and quality organisations that share our commitment to better care.</p></header><div className="partnership-page__gallery">{partnerWorks.map((partner) => <figure key={partner.name}><div><img src={partner.image} alt={`AACI partnership with ${partner.name}`} /></div><figcaption>{partner.name}</figcaption></figure>)}</div></section>
      <section className="partnership-page__closing"><p className="eyebrow">A SHARED COMMITMENT</p><h2>Global standards.<br />Local relevance.</h2><p>Every partnership starts with listening. Together, we create a focused route to measurable improvements in care quality, patient safety and trust.</p></section>
    </div></section>
  </>;
}

function AsiaOfficePage() {
  return <><PageHero eyebrow="AACI ASIA PACIFIC" title="AACI Asia Office" intro="Our team brings practical experience in healthcare delivery, policy, accreditation and risk management—working with integrity to advance person-centred care across the region." />
    <section className="page-content asia-team"><div className="container"><section className="asia-team__intro"><p className="eyebrow">OUR PEOPLE</p><h2>Leadership and expertise, united by quality.</h2><p>We bring together clinical, operational and education specialists who translate AACI’s commitment to safer care into thoughtful, locally relevant support.</p></section><PublicPeopleDirectory section="asia_office" /></div></section>
  </>;
}

function AACISurveyorPage() {
  return <><PageHero eyebrow="AACI ASIA PACIFIC" title="AACI Surveyor" intro="A multidisciplinary network of experienced professionals supporting meaningful improvement across Asia Pacific." />
    <section className="page-content surveyor-directory"><div className="container"><header className="surveyor-directory__intro"><p className="eyebrow">AACI SURVEYOR DIRECTORY</p><h2>Experienced. Independent.<br />Improvement-focused.</h2><p>AACI Surveyors are trained, credentialed professionals who assess healthcare organisations against internationally informed standards. They work collaboratively with teams to identify strengths, prioritise opportunities and advance safer, higher-quality care.</p></header><PublicPeopleDirectory section="surveyor" /></div></section>
  </>;
}

export default async function AboutDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === "country-director") return <CountryDirectorPage />;
  if (slug === "regional-advisory-board") return <RegionalAdvisoryBoardPage />;
  if (slug === "partnership") return <PartnershipPage />;
  if (slug === "asia-office") return <AsiaOfficePage />;
  if (slug === "aaci-surveyor") return <AACISurveyorPage />;

  const item = content[slug] ?? content["asia-office"];
  return <><PageHero eyebrow="ABOUT AACI" title={item.title} intro={item.intro} /><section className="page-content"><div className="container detail-layout"><div><h2>Supporting quality across Asia Pacific</h2><p>{item.intro}</p><h3 className="detail-outcomes">Our focus</h3><ul className="detail-outcomes__list">{item.items.map((entry) => <li key={entry}>✓ {entry}</li>)}</ul></div><aside className="services-sidebar subpage-sidebar"><SubpageSidebar title="Explore about AACI" links={aboutLinks} /></aside></div></section></>;
}
