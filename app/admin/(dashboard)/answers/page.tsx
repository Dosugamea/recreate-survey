import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { SurveyList } from "@/components/admin/survey/SurveyList";

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

  // アプリ一覧を取得
  const apps = await prisma.app.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });

  // 回答があるアンケートを取得（appIdでフィルタリング）
  const surveys = await prisma.survey.findMany({
    where: {
      ...(appId ? { appId } : {}),
      responses: {
        some: {}, // 少なくとも1つの回答が存在する
      },
    },
    include: {
      app: true,
      _count: {
        select: { responses: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <SurveyList
      apps={apps}
      surveys={surveys}
      currentAppId={appId}
      showResponseCount={true}
      headerTitle="アンケート結果一覧"
      headerDescription="回答があるアンケートの一覧を表示しています。各アンケートの結果を確認できます。"
      showCreateButton={false}
      showDetailButton={false}
    />
  );
}
