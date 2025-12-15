import Link from "next/link";
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
import { PlusCircle, Edit, BarChart } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const surveys = await prisma.survey.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { responses: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">ダッシュボード</h2>
          <p className="text-muted-foreground mt-2">
            アンケートの管理や結果の確認ができます。
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/create">
            <PlusCircle className="mr-2 h-4 w-4" /> アンケート作成
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {surveys.length === 0 ? (
          <div className="col-span-full text-center p-12 border rounded-lg border-dashed text-muted-foreground">
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
                  <p>作成日: {format(survey.createdAt, "PPP")}</p>
                  <p>回答数: {survey._count.responses}</p>
                  <p>ステータス: {survey.isActive ? "公開中" : "非公開"}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/${survey.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" /> 編集
                  </Link>
                </Button>
                <Button variant="secondary" size="sm" asChild>
                  <Link href={`/admin/${survey.id}/results`}>
                    <BarChart className="mr-2 h-4 w-4" /> 結果
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
