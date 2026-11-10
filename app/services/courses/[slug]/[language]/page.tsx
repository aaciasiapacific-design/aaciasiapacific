import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { FeaturedCourseLanding } from "../../../../components/FeaturedCourseLanding";
import { CourseLanguage, getFeaturedCourse } from "../../../../../lib/featured-courses";

type CoursePageParams = { params: Promise<{ slug: string; language: string }> };

export async function generateMetadata({ params }: CoursePageParams): Promise<Metadata> {
  const { slug, language } = await params;
  const course = getFeaturedCourse(slug);
  if (!course || !["th", "en"].includes(language)) return {};
  const locale = language as CourseLanguage;
  return {
    title: `${course.title} | AACI Academy`,
    description: course.summary[locale],
  };
}

export default async function FeaturedCourseLanguagePage({ params }: CoursePageParams) {
  const { slug, language } = await params;
  const course = getFeaturedCourse(slug);
  if (!course || !["th", "en"].includes(language)) notFound();
  const locale = language as CourseLanguage;
  if (!course.availableLanguages.includes(locale)) redirect(`/services/courses/${slug}/${course.availableLanguages[0]}`);
  return <FeaturedCourseLanding course={course} language={locale} />;
}
