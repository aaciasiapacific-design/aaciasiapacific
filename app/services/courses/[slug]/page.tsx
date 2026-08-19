import { PublicCourseDetail } from "../../../components/PublicCourses";

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PublicCourseDetail slug={slug} />;
}
