import { getAllApps } from "@/features/admin/apps/actions/apps";
import { SurveyCreatePageRoot } from "@/features/admin/surveys/pages/SurveyCreatePageRoot";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  return {
    title: `アンケート作成 | ${appName}`,
    description: "新しいアンケートを作成",
  };
}

export default async function CreateSurveyPage() {
  const apps = await getAllApps();

  return <SurveyCreatePageRoot apps={apps} />;
}
