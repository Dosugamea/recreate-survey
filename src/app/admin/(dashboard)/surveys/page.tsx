import type { Metadata } from "next";

import { getSurveys } from "@/features/admin/surveys/actions/surveys";
import { SurveysPageRoot } from "@/features/admin/surveys/components/SurveysPageRoot";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  return {
    title: `アンケート一覧 | ${appName}`,
    description: "作成したアンケートの一覧を表示します",
  };
}

interface AdminSurveysPageProps {
  searchParams: Promise<{ appId?: string }>;
}

export default async function AdminSurveysPage({
  searchParams,
}: AdminSurveysPageProps) {
  const { appId } = await searchParams;

  const { apps, surveys } = await getSurveys(appId);

  return <SurveysPageRoot apps={apps} surveys={surveys} currentAppId={appId} />;
}
