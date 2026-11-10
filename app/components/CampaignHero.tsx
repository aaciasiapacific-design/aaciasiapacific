import Image from "next/image";

export function CampaignHero() {
  return <section className="campaign-hero" aria-label="AACI Academy 2026 training programme">
    <div className="campaign-hero__stage">
      <div className="campaign-hero__topline" aria-hidden="true">
        <span>AACI Academy</span>
        <span>Training calendar 2026</span>
      </div>
      <figure className="campaign-hero__visual">
        <Image
          src="/aaci-2026-training-program-banner.png"
          alt="AACI 2026 Half Year Training Program for healthcare quality advancement and international accreditation standards"
          width={1895}
          height={830}
          priority
          sizes="(max-width: 800px) calc(100vw - 24px), 1440px"
        />
      </figure>
    </div>
  </section>;
}
