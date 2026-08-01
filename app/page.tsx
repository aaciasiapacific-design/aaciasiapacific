import Link from "next/link";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";

const programs = [
  { tag: "ACCREDITATION", title: "AACI Accreditation Standards", copy: "An internationally recognised pathway for hospitals and healthcare organisations.", className: "program-hospital" },
  { tag: "CERTIFICATION", title: "AACI Certification Standard", copy: "Build confidence through consistent, measurable quality systems.", className: "program-clinical" },
  { tag: "MANAGEMENT", title: "Management System Certification", copy: "Strengthen governance, safety and operational excellence.", className: "program-team" },
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
        <div className="hero-copy"><p className="eyebrow light">AACI ASIA PACIFIC</p><h1>Advancing global healthcare standards in Asia Pacific.</h1><p className="hero-intro">Partnering with healthcare organisations to build safer systems, stronger teams and trusted patient care.</p><div className="hero-actions"><Link className="button button-red" href="/accreditation/request">Request consultation <span>→</span></Link><Link className="button button-ghost" href="/standards">Explore programmes</Link></div></div>
        <div className="hero-visual" aria-label="Healthcare professionals in discussion"><div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/><div className="hero-panel"><p>QUALITY WITHOUT BORDERS</p><strong>Healthcare<br/>that earns trust.</strong><span className="hero-cross">+</span></div><div className="portrait portrait-a"/><div className="portrait portrait-b"/></div>
      </div></section>
      <section className="trust-wrap"><div className="container trust-grid">
        {[['01','Accreditation','A clear, credible path to raising the standard of care.'],['02','Certification','Independent assurance that inspires confidence.'],['03','Quality improvement','Practical support for a culture of continuous learning.']].map(([n,t,c])=><article className="trust-card" key={t}><span>{n}</span><div><h2>{t}</h2><p>{c}</p></div><b>↗</b></article>)}
      </div></section>
      <section className="recognition"><div className="container recognition-inner"><p className="eyebrow">RECOGNISED. RIGOROUS. RELEVANT.</p><div className="marks"><span>AACI</span><i/> <span>GLOBAL<br/>QUALITY</span><i/> <span>HEALTHCARE<br/>EXCELLENCE</span></div><p>Ready to explore a quality journey tailored to your organisation?</p><Link className="text-link" href="/contact">Get in touch <b>→</b></Link></div></section>
      <section className="section programs"><div className="container"><div className="section-head"><div><p className="eyebrow">OUR PROGRAMMES</p><h2>Quality that moves<br/>with your organisation.</h2></div><Link className="text-link" href="/standards">View all programmes <b>→</b></Link></div><div className="program-grid">{programs.map(p=><Link className="program-card" href="/standards" key={p.title}><div className={'program-image '+p.className}><span>{p.tag}</span><b>→</b></div><div className="program-body"><h3>{p.title}</h3><p>{p.copy}</p><em>Discover the programme</em></div></Link>)}</div></div></section>
      <section className="section about"><div className="container about-grid"><div className="about-image"><div className="building"/><div className="experience"><strong>25+</strong><span>years of advancing<br/>healthcare quality</span></div></div><div className="about-copy"><p className="eyebrow">ABOUT AACI</p><h2>A trusted partner for better healthcare.</h2><p>We help healthcare organisations turn their commitment to quality into durable, meaningful practice — with international standards shaped for local realities.</p><ul><li><b>✓</b> Globally benchmarked standards</li><li><b>✓</b> Practical expertise for every stage</li><li><b>✓</b> A collaborative approach to improvement</li></ul><Link className="button button-navy" href="/about">Discover our story <span>→</span></Link></div></div></section>
      <section className="commitment"><div className="container"><p className="eyebrow">OUR COMMITMENT</p><h2>Quality is not a destination.<br/><em>It is a shared practice.</em></h2><p>Our standards are thoughtfully reviewed to remain relevant, evidence-informed and responsive to the changing needs of healthcare.</p></div></section>
      <section className="section news"><div className="container"><div className="section-head centered"><div><p className="eyebrow">LATEST FROM AACI</p><h2>News &amp; updates</h2></div><Link className="text-link" href="/news">View all news <b>→</b></Link></div><div className="news-grid">{news.map(n=><article className="news-card" key={n.title}><div className={'news-image '+n.className}><div className="date"><b>{n.date}</b><span>{n.month}</span></div></div><div><p className="card-category">{n.category}</p><h3>{n.title}</h3><Link className="text-link" href="/news">Read more <b>→</b></Link></div></article>)}</div></div></section>
      <section className="cta"><div className="container cta-inner"><div className="calendar">□</div><div><p className="eyebrow light">START THE CONVERSATION</p><h2>Ready to strengthen your healthcare standards?</h2></div><Link className="button button-red" href="/accreditation/request">Schedule consultation <span>→</span></Link></div></section>
    </main><SiteFooter />
  </>;
}
