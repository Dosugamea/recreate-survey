import type { Metadata } from "next";

import { AnswersPageRoot } from "@/features/admin/answers/components/AnswersPageRoot";
import { getAnswers } from "@/features/admin/answers/actions/answers";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  return {
    title: `アンケート結果一覧 | ${appName}`,
    description: "回答があるアンケートの一覧を表示します",
  };
}

interface AdminSurveysResultsListPageProps {
  searchParams: Promise<{ appId?: string }>;
}

export default async function AdminSurveysResultsListPage({
  searchParams,
}: AdminSurveysResultsListPageProps) {
  const { appId } = await searchParams;

  const { apps, surveys } = await getAnswers(appId);

  return <AnswersPageRoot apps={apps} surveys={surveys} currentAppId={appId} />;
}
