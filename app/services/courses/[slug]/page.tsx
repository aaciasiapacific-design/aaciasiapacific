import { PublicCourseDetail } from "../../../components/PublicCourses";
import { getFeaturedCourse } from "../../../../lib/featured-courses";
import { redirect } from "next/navigation";

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const featuredCourse = getFeaturedCourse(slug);
  if (featuredCourse) redirect(`/services/courses/${slug}/${featuredCourse.availableLanguages[0]}`);
  return <PublicCourseDetail slug={slug} />;
}
