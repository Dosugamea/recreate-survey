import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit } from "lucide-react";
import { format } from "date-fns";

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "アンケートアプリ";

export const metadata: Metadata = {
  title: `アプリ管理 | ${appName}`,
  description: "アプリの管理",
};

export const dynamic = "force-dynamic";

export default async function AppsPage() {
  const apps = await prisma.app.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      surveys: {
        select: {
          id: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            アプリ管理
          </h2>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            アプリの基本情報を管理できます。
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/apps/create">
            <PlusCircle className="mr-2 h-4 w-4" /> アプリ作成
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {apps.length === 0 ? (
          <div className="col-span-full text-center p-8 border rounded-lg border-dashed text-muted-foreground">
            アプリがまだありません。新しいアプリを作成してください。
          </div>
        ) : (
          apps.map((app) => (
            <Card key={app.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{app.name}</CardTitle>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/apps/${app.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 flex-1">
                <div className="text-sm text-muted-foreground">
                  <p>アンケート数: {app.surveys.length}</p>
                  <p>作成日: {format(app.createdAt, "yyyy/MM/dd")}</p>
                </div>
                {app.privacyPolicyUrl && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">プライバシーポリシー: </span>
                    <a
                      href={app.privacyPolicyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      リンク
                    </a>
                  </div>
                )}
                {app.contactEmail && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">お問い合わせ: </span>
                    <a
                      href={`mailto:${app.contactEmail}`}
                      className="text-primary hover:underline"
                    >
                      {app.contactEmail}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

