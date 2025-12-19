import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { SurveyList } from "@/components/admin/survey/SurveyList";

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "アンケートアプリ";

export const metadata: Metadata = {
  title: `アンケート一覧 | ${appName}`,
  description: "作成したアンケートの一覧を表示します",
};

export const dynamic = "force-dynamic";

interface AdminSurveysPageProps {
  searchParams: Promise<{ appId?: string }>;
}

export default async function AdminSurveysPage({
  searchParams,
}: AdminSurveysPageProps) {
  const { appId } = await searchParams;

  // アプリ一覧を取得
  const apps = await prisma.app.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });

  // アンケートを取得（appIdでフィルタリング）
  const surveys = await prisma.survey.findMany({
    where: appId ? { appId } : undefined,
    include: {
      app: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return <SurveyList apps={apps} surveys={surveys} currentAppId={appId} />;
}
