import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSurveyWithResults } from "@/features/admin/surveys/actions/surveys";
import { SurveyResultsPageRoot } from "@/features/admin/surveys/pages/SurveyResponseTotalResultsPageRoot";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  const survey = await prisma.survey.findUnique({
    where: { id: params.id },
  });

  if (!survey) {
    return {
      title: `アンケート結果 | ${appName}`,
    };
  }

  return {
    title: `アンケート結果 | ${appName}`,
    description: `「${survey.title}」の結果`,
  };
}

export default async function SurveyResultsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const survey = await getSurveyWithResults(params.id);

  if (!survey) {
    notFound();
  }

  return <SurveyResultsPageRoot survey={survey} />;
}
