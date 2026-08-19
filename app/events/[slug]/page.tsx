import { PublicEventDetail } from "../../components/PublicEvents";

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <main className="page-content event-detail-page"><div className="container"><PublicEventDetail slug={slug} /></div></main>;
}
