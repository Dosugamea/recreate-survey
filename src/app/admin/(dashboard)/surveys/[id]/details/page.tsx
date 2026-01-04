import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSurveyById } from "@/features/admin/surveys/actions/surveys";
import { SurveyEditPageRoot } from "@/features/admin/surveys/pages/SurveyEditDetailPageRoot";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const survey = await getSurveyById(params.id);

  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  if (!survey) {
    return {
      title: `アンケート編集 | ${appName}`,
    };
  }

  return {
    title: `アンケート編集 | ${survey.title} | ${appName}`,
    description: `「${survey.title}」の編集`,
  };
}

export const dynamic = "force-dynamic";

export default async function EditSurveyPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const survey = await getSurveyById(params.id);

  if (!survey) {
    notFound();
  }

  return <SurveyEditPageRoot survey={survey} />;
}
