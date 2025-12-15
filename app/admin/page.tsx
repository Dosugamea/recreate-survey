import type { Metadata } from "next";

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "アンケートアプリ";

export const metadata: Metadata = {
  title: `ダッシュボード | ${appName}`,
  description: "管理者ダッシュボード",
};
import { prisma } from "@/lib/prisma";
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
import { PlusCircle, Edit, BarChart, ExternalLink } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const surveys = await prisma.survey.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { responses: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            ダッシュボード
          </h2>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            アンケートの管理や結果の確認ができます。
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/create">
            <PlusCircle className="mr-2 h-4 w-4" /> アンケート作成
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {surveys.length === 0 ? (
          <div className="col-span-full text-center p-8 sm:p-12 border rounded-lg border-dashed text-muted-foreground">
            アンケートが見つかりません。新規作成して始めましょう！
          </div>
        ) : (
          surveys.map((survey) => (
            <Card key={survey.id}>
              <CardHeader>
                <CardTitle className="truncate">{survey.title}</CardTitle>
                <CardDescription>/{survey.slug}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    作成日時: {format(survey.createdAt, "yyyy/MM/dd HH:mm")}
                  </p>
                  <p>回答数: {survey._count.responses}</p>
                  <p>ステータス: {survey.isActive ? "公開中" : "非公開"}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/${survey.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" /> 編集
                  </Link>
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    title="アンケートを開く"
                  >
                    <Link
                      href={`/${survey.slug}?auser_id=dummy`}
                      target="_blank"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="secondary" size="sm" asChild>
                    <Link href={`/admin/${survey.id}/results`}>
                      <BarChart className="mr-2 h-4 w-4" /> 結果
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
