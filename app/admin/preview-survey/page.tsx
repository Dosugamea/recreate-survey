import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

import type { Metadata } from "next";

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "アンケートアプリ";

export const metadata: Metadata = {
  title: `プレビュー一覧 | ${appName}`,
  description: "アンケートプレビュー一覧",
};

export const dynamic = "force-dynamic";

export default async function PreviewSurveyListPage() {
  const surveys = await prisma.survey.findMany({
    orderBy: { createdAt: "desc" },
    include: { questions: true },
  });

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">
        アンケート描画サンプル一覧(DB連動)
      </h1>
      <p className="mb-8 text-gray-500">
        現在DBに保存されているデータを使って、実際のアンケート画面がどう見えるか確認できます！
      </p>

      {surveys.length === 0 ? (
        <div className="p-8 border rounded-lg bg-gray-50 text-center text-gray-400">
          現在DBにアンケートデータがありません🥲
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {surveys.map((survey) => (
            <div
              key={survey.id}
              className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full"
            >
              <div>
                <h2 className="text-xl font-bold mb-2 line-clamp-2">
                  {survey.title}
                </h2>
                <div className="text-xs text-gray-400 font-mono mb-4 bg-gray-100 p-1 rounded inline-block">
                  ID: {survey.id}
                </div>
              </div>

              <div className="mt-4 flex justify-between items-end border-t pt-4">
                <div className="text-xs text-gray-500">
                  <div>作成日: {format(survey.createdAt, "yyyy/MM/dd")}</div>
                  {survey.questions ? (
                    <div>質問数: {survey.questions.length}</div> // fetch questions separately if needed or just remove this count
                  ) : null}
                </div>
                <Link href={`/admin/preview-survey/${survey.id}`}>
                  <Button size="sm" className="font-bold">
                    描画サンプルを見る
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
