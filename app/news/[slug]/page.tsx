import { PublicNewsArticle } from "../../components/PublicNews";

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <main className="page-content news-detail-page"><div className="container"><PublicNewsArticle slug={slug} /></div></main>;
}
