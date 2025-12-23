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
import { AppFilterSelect } from "@/components/admin/survey/AppFilterSelect";
import { PageHeader } from "@/components/admin/layout/PageHeader";

interface App {
  id: string;
  name: string;
}

interface Survey {
  id: string;
  title: string;
  slug: string;
  isActive: boolean;
  createdAt: Date;
  app: {
    id: string;
    name: string;
    slug: string;
    faviconImageUrl: string | null;
  };
  _count?: {
    responses: number;
  };
}

interface SurveyListProps {
  apps: App[];
  surveys: Survey[];
  currentAppId?: string;
  showResponseCount?: boolean;
  headerTitle?: string;
  headerDescription?: string;
  showCreateButton?: boolean;
}

export function SurveyList({
  apps,
  surveys,
  currentAppId,
  showResponseCount = false,
  headerTitle = "アンケート一覧",
  headerDescription = "作成したアンケートの一覧を表示しています。詳細の確認や編集ができます。",
  showCreateButton = true,
}: SurveyListProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={headerTitle}
        description={headerDescription}
        action={
          showCreateButton ? (
            <Button asChild className="w-full sm:w-auto">
              <Link href="/admin/surveys/create">
                <PlusCircle className="mr-2 h-4 w-4" /> アンケート作成
              </Link>
            </Button>
          ) : undefined
        }
      />

      {apps.length > 0 && (
        <AppFilterSelect apps={apps} currentAppId={currentAppId} />
      )}

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
                  {showResponseCount && survey._count && (
                    <p className="font-semibold text-foreground">
                      回答数: {survey._count.responses}件
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/surveys/${survey.id}`}>
                    <Eye className="mr-2 h-4 w-4" /> 詳細
                  </Link>
                </Button>
                {showResponseCount &&
                  survey._count &&
                  survey._count.responses > 0 && (
                    <Button variant="default" size="sm" asChild>
                      <Link href={`/admin/surveys/${survey.id}/results`}>
                        結果を見る
                      </Link>
                    </Button>
                  )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
