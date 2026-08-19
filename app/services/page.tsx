import Link from "next/link";

const services = [
  { label: "ACCREDITATION", title: "AACI Accreditation Standards", description: "Accreditation is a powerful strategic tool that enables healthcare organizations to meet and exceed expectations for quality and safety.", image: "/aaci-accreditation.webp", href: "/services/accreditation" },
  { label: "CERTIFICATION", title: "AACI Certification Standard", description: "The AACI Clinical Excellence Certification is a flagship element of the AACI Quality and Patient Safety Program.", image: "/aaci-certification-standard.webp", href: "/services/certification" },
  { label: "MANAGEMENT SYSTEM", title: "Management System Certification", description: "Build a reliable quality system that supports safer care, stronger governance and sustained operational excellence.", image: "/management-system-certification.webp", href: "/services/management-system" },
];

export default function ServicesPage() {
  return <main>
    <section className="services-banner"><div className="container"><p>SERVICES</p><h1>Ruling Risks, Saving Lives</h1></div></section>
    <section className="services-overview"><div className="container"><div className="services-layout">
      <div className="services-layout__main">
        <p className="services-overview__intro">At AACI, we don’t just set international standards — we drive healthcare excellence forward. Our mission is rooted in one powerful purpose: <strong>ruling risks to save lives.</strong> Join us in shaping a safer, smarter, and more resilient future in patient care. AACI Asia Pacific is always collaborative — we’re here to support, not inspect.</p>
        <h2>Begin your journey toward excellence today.</h2><span className="services-overview__rule" aria-hidden="true" />
        <div className="services-overview__grid">{services.map((service) => <article className="services-overview__card" key={service.href}>
          <div className="services-overview__image"><img src={service.image} alt="" /></div><div className="services-overview__content"><span className="services-overview__type">{service.label}</span><h3>{service.title}</h3><p>{service.description}</p>
          <Link className="text-link services-read-more" href={service.href}>Read More <b>→</b></Link></div>
        </article>)}</div>
      </div>
      <aside className="services-sidebar" aria-label="Services quick links">
        <p className="eyebrow">START HERE</p><h2>Find the right pathway.</h2><p>Talk to our team about the standards, certification or support that fits your organization.</p>
        <Link className="button button-red" href="/accreditation/request">REQUEST CONSULTATION <span>→</span></Link>
        <nav><h3>Explore services</h3>{services.map((service) => <Link key={service.href} href={service.href}>{service.title} <span>→</span></Link>)}</nav>
        <div className="services-sidebar__contact"><strong>Need to speak with us?</strong><a href="mailto:somporn.kumphong@aacihealthcare.com">somporn.kumphong@aacihealthcare.com</a><a href="tel:+66898995436">+66 89 899 5436</a></div>
      </aside>
    </div></div></section>
  </main>;
}
