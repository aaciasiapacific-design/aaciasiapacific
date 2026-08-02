import Link from "next/link";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";

const programs = [
  { title: "AACI Accreditation Standards", copy: "An internationally recognised pathway for hospitals and healthcare organisations.", image: "/aaci-accreditation.webp", accent: "red" },
  { title: "AACI Certification Standard", copy: "Build confidence through consistent, measurable quality systems.", image: "/aaci-certification-standard.webp", accent: "cyan" },
  { title: "Management System Certification", copy: "Strengthen governance, safety and operational excellence.", image: "/management-system-certification.webp", accent: "grey" },
];

const news = [
  { date: "18", month: "JUL", title: "AACI Asia Pacific expands quality education programmes", category: "INSIGHTS", className: "news-one" },
  { date: "04", month: "JUN", title: "What a quality-first culture looks like in practice", category: "QUALITY", className: "news-two" },
  { date: "22", month: "MAY", title: "Preparing your organisation for accreditation", category: "GUIDE", className: "news-three" },
];

export default function Home() {
  return <><SiteHeader />
    <main>
      <section className="hero"><div className="container hero-grid">
        <div className="hero-copy"><p className="eyebrow light">AACI ASIA PACIFIC</p><h1>Advancing Global Healthcare Standards in Asia Pacific</h1><p className="hero-intro">AACI Asia Pacific delivers trusted accreditation and certification programs that drive quality, patient safety, and operational excellence across the healthcare ecosystem.</p><div className="hero-actions"><Link className="button button-red" href="/accreditation/request">Request Consultation <span>→</span></Link><Link className="button button-ghost" href="/standards">Explore Programs</Link></div></div>
        <div className="hero-visual" role="img" aria-label="Healthcare leaders holding a quality medallion" />
      </div></section>
      <section className="hero-benefits"><div className="container"><div className="offer-benefits">{[["world","Accreditation","Internationally recognized standards that inspire trust and credibility."],["certification","Certification","Rigorous evaluation processes that assure quality and compliance."],["improvement","Quality Improvement","Driving continuous improvement for better outcomes and safer care."]].map(([icon,title,copy])=><article key={title}><span className={`benefit-icon benefit-icon--${icon}`} aria-hidden="true">{icon === "certification" ? "✓" : ""}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div></div></section>
      <section className="recognition"><div className="container recognition-inner"><div className="badge-row"><img src="/accreditation-badges.webp" alt="AACI accreditation and quality management certification badges" width="1200" height="377" /></div><p className="offer-kicker">WE KNOW HEALTHCARE</p><h2>REQUEST YOUR OFFER HERE.</h2><Link className="button button-red offer-button" href="/contact">Get in touch</Link></div></section>
      <section className="section programs"><div className="container"><div className="section-head"><div><p className="eyebrow">OUR PROGRAMMES</p><h2>Quality that moves<br/>with your organization.</h2></div><Link className="text-link" href="/standards">View all programmes <b>→</b></Link></div><div className="program-grid">{programs.map(p=><Link className="program-card" href="/standards" key={p.title}><div className="program-image"><img src={p.image} alt="" /></div><div className="program-body"><h3>{p.title === "AACI Certification Standard" ? <>AACI Certification<br/>Standard</> : p.title}</h3><span className={`program-divider program-divider--${p.accent}`} /><p>{p.copy}</p><em>Discover the programme</em></div></Link>)}</div></div></section>
      <section className="section about"><div className="container about-grid"><div className="about-image about-experts" role="img" aria-label="AACI office flag outside the healthcare organisation"/><div className="about-copy"><p className="eyebrow">OUR EXPERTS</p><h2>Led by Experts,<br/>Focused on Excellence</h2><p>AACI’s services are delivered by experienced healthcare practitioners and executives who provide practical, solutions-oriented guidance to their peers around the world. Our multidisciplinary team includes:</p><ul><li><b>✓</b> Physicians and nurses</li><li><b>✓</b> Health system administrators</li><li><b>✓</b> Physical environment and life safety experts</li><li><b>✓</b> Allied health professionals</li></ul><Link className="button button-navy" href="/about">Discover our story <span>→</span></Link></div></div></section>
      <section className="commitment"><div className="container"><p className="eyebrow">OUR COMMITMENT</p><h2>Quality is not a destination.<br/><em>It is a shared practice.</em></h2><p>Our standards are thoughtfully reviewed to remain relevant, evidence-informed and responsive to the changing needs of healthcare.</p></div></section>
      <section className="section news"><div className="container"><div className="section-head centered"><div><p className="eyebrow">LATEST FROM AACI</p><h2>News &amp; updates</h2></div><Link className="text-link" href="/news">View all news <b>→</b></Link></div><div className="news-grid">{news.map(n=><article className="news-card" key={n.title}><div className={'news-image '+n.className}><div className="date"><b>{n.date}</b><span>{n.month}</span></div></div><div><p className="card-category">{n.category}</p><h3>{n.title}</h3><Link className="text-link" href="/news">Read more <b>→</b></Link></div></article>)}</div></div></section>
    </main><SiteFooter />
  </>;
}
