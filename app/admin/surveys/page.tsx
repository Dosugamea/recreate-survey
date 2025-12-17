import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { PlusCircle, Eye, ExternalLink } from "lucide-react";
import Link from "next/link";
import { AppFilterSelect } from "@/components/admin/AppFilterSelect";

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            アンケート一覧
          </h2>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            作成したアンケートの一覧を表示しています。詳細の確認や編集ができます。
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/surveys/create">
            <PlusCircle className="mr-2 h-4 w-4" /> アンケート作成
          </Link>
        </Button>
      </div>

      {apps.length > 0 && <AppFilterSelect apps={apps} currentAppId={appId} />}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {surveys.length === 0 ? (
          <div className="col-span-full text-center p-8 sm:p-12 border rounded-lg border-dashed text-muted-foreground">
            アンケートが見つかりません。新規作成して始めましょう！
          </div>
        ) : (
          surveys.map((survey) => (
            <Card key={survey.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  {survey.app.faviconImageUrl && (
                    <Image
                      src={survey.app.faviconImageUrl}
                      alt={`${survey.app.name}のアイコン`}
                      width={24}
                      height={24}
                      className="h-6 w-6 object-contain"
                      unoptimized
                    />
                  )}
                  <CardTitle className="truncate">{survey.title}</CardTitle>
                </div>
                <CardDescription>
                  <Link
                    href={`/${survey.app.slug}/${survey.slug}/form?auser_id=dummy`}
                    target="_blank"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm text-align-baseline">
                        {" "}
                        /{survey.app.slug}/{survey.slug}/form
                      </span>
                      <ExternalLink className="h-4 w-4" />
                    </div>
                  </Link>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    作成日時: {format(survey.createdAt, "yyyy/MM/dd HH:mm")}
                  </p>
                  <p>ステータス: {survey.isActive ? "公開中" : "非公開"}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/surveys/${survey.id}`}>
                    <Eye className="mr-2 h-4 w-4" /> 詳細
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
