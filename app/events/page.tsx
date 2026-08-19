import { PageHero } from "../components/ContentLayout";
import { PublicEventFeed } from "../components/PublicEvents";

export default function EventsPage() {
  return <><PageHero eyebrow="EDUCATION & EVENTS" title="Learn with the quality community." intro="Discover upcoming AACI Asia Pacific events, learning opportunities and professional programmes." /><section className="page-content public-events-page"><div className="container"><PublicEventFeed /></div></section></>;
}
