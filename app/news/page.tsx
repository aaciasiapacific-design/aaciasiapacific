import { PageHero } from "../components/ContentLayout";
import { PublicNewsFeed } from "../components/PublicNews";

export default function NewsPage(){return <><PageHero eyebrow="AACI INSIGHTS" title="News & updates" intro="Ideas, practical guidance and updates from AACI Asia Pacific."/><section className="page-content public-news-page"><div className="container"><PublicNewsFeed /></div></section></>}
