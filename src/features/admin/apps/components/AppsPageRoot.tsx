import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit } from "lucide-react";
import { format } from "date-fns";
import { PageHeader } from "@/features/admin/layout/components/PageHeader";
import { App } from "@prisma/client";

interface AppsPageRootProps {
  apps: App[];
}

export function AppsPageRoot({ apps }: AppsPageRootProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="アプリ管理"
        description="アプリの基本情報を管理できます。"
        action={
          <Button asChild className="w-full sm:w-auto">
            <Link href="/admin/apps/create">
              <PlusCircle className="mr-2 h-4 w-4" /> アプリ作成
            </Link>
          </Button>
        }
      />

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
                  <div className="flex items-center gap-2">
                    {app.faviconImageUrl && (
                      <Image
                        src={app.faviconImageUrl}
                        alt={`${app.name}のアイコン`}
                        width={24}
                        height={24}
                        className="h-6 w-6 object-contain"
                        unoptimized
                      />
                    )}
                    <CardTitle className="text-lg">{app.name}</CardTitle>
                  </div>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/apps/${app.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 flex-1">
                <div className="text-sm text-muted-foreground">
                  <p>作成日: {format(app.createdAt, "yyyy/MM/dd")}</p>
                </div>
                {app.privacyPolicyUrl && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">
                      プライバシーポリシー:{" "}
                    </span>
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
                {app.contactUrl && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">
                      お問い合わせ:{" "}
                    </span>
                    <a
                      href={app.contactUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      リンク
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
