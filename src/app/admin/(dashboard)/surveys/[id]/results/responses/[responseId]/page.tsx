import { notFound } from "next/navigation";
import { getSurveyResponseDetail } from "@/features/admin/surveys/actions/surveys";
import { SurveyResponseDetailPageRoot } from "@/features/admin/surveys/components/SurveyResponseDetailPageRoot";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
  params: Promise<{ id: string; responseId: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const data = await getSurveyResponseDetail(params.id, params.responseId);
  if (!data) return { title: "回答詳細" };
  return { title: `回答詳細 | ${data.survey.title}` };
}

export default async function SurveyResponseDetailPage(props: {
  params: Promise<{ id: string; responseId: string }>;
}) {
  const params = await props.params;
  const data = await getSurveyResponseDetail(params.id, params.responseId);

  if (!data) {
    notFound();
  }

  return (
    <SurveyResponseDetailPageRoot
      surveyId={params.id}
      survey={data.survey}
      response={data.response}
    />
  );
}
