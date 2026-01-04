import { notFound } from "next/navigation";
import { getSurveyResponses } from "@/features/admin/surveys/actions/surveys";
import { SurveyResponsesListPageRoot } from "@/features/admin/surveys/pages/SurveyResponseIndividualResultsPageRoot";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const result = await getSurveyResponses(params.id);
  if (!result) return { title: "回答一覧" };
  return { title: `回答一覧: ${result.survey.title}` };
}

export default async function SurveyResponsesPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const result = await getSurveyResponses(params.id);

  if (!result) {
    notFound();
  }

  return (
    <SurveyResponsesListPageRoot
      surveyId={params.id}
      surveyTitle={result.survey.title}
      responses={result.responses}
    />
  );
}
