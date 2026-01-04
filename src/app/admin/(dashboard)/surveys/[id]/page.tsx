import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSurveyById } from "@/features/admin/surveys/actions/surveys";
import { SurveyDetailPageRoot } from "@/features/admin/surveys/pages/SurveyDetailPageRoot";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  const survey = await getSurveyById(params.id);
  if (!survey) {
    return {
      title: `アンケート詳細 | ${appName}`,
    };
  }
  return {
    title: `アンケート詳細 | ${survey.title} | ${appName}`,
    description: `「${survey.title}」の詳細情報`,
  };
}

export const dynamic = "force-dynamic";

export default async function SurveyDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const survey = await getSurveyById(params.id);
  if (!survey) {
    notFound();
  }

  return <SurveyDetailPageRoot survey={survey} />;
}
