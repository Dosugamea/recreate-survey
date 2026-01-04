import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSurveyById } from "@/features/admin/surveys/actions/surveys";
import { SurveyQuestionsPageRoot } from "@/features/admin/surveys/components/SurveyQuestionsPageRoot";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  const survey = await getSurveyById(params.id);

  if (!survey) {
    return {
      title: `質問項目編集 | ${appName}`,
    };
  }

  return {
    title: `質問項目編集 | ${appName}`,
    description: `「${survey.title}」の質問項目編集`,
  };
}

export const dynamic = "force-dynamic";

export default async function EditQuestionsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const survey = await getSurveyById(params.id);

  if (!survey) {
    notFound();
  }

  return <SurveyQuestionsPageRoot survey={survey} />;
}
