import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Edit, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "アンケートアプリ";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const survey = await prisma.survey.findUnique({
    where: { id: params.id },
  });

  if (!survey) {
    return {
      title: `アンケート詳細 | ${appName}`,
    };
  }

  return {
    title: `アンケート詳細 | ${appName}`,
    description: `「${survey.title}」の詳細情報`,
  };
}

export const dynamic = "force-dynamic";

export default async function SurveyDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const survey = await prisma.survey.findUnique({
    where: { id: params.id },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!survey) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/surveys">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">{survey.title}</h2>
          <div className="flex items-center gap-2 mt-1 text-muted-foreground">
            <span>Slug:</span>
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
              {survey.slug}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              asChild
              title="アンケートを開く"
            >
              <Link href={`/${survey.slug}?auser_id=dummy`} target="_blank">
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-[calc(100vh-200px)]">
        {/* 左側：アンケート情報 */}
        <Card className="flex flex-col max-h-[80vh]">
          <CardHeader className="shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle>基本情報</CardTitle>
              <Button variant="default" size="sm" asChild>
                <Link href={`/admin/surveys/${survey.id}/details`}>
                  <Edit className="mr-2 h-4 w-4" />
                  基本情報を編集
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 overflow-y-auto flex-1 min-h-0">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                公開ステータス
              </p>
              <div className="mt-1">
                <Badge variant={survey.isActive ? "default" : "secondary"}>
                  {survey.isActive ? "公開中" : "非公開"}
                </Badge>
              </div>
            </div>

            {survey.description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  説明
                </p>
                <div className="mt-1 max-h-[100px] overflow-y-auto border rounded-md p-2 bg-muted/30 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <p className="whitespace-pre-wrap text-sm">
                    {survey.description}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  作成日時
                </p>
                <p className="mt-1">
                  {format(survey.createdAt, "yyyy/MM/dd HH:mm")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  更新日時
                </p>
                <p className="mt-1">
                  {format(survey.updatedAt, "yyyy/MM/dd HH:mm")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  開始日
                </p>
                <p className="mt-1">
                  {survey.startAt
                    ? format(new Date(survey.startAt), "yyyy/MM/dd HH:mm")
                    : "未設定"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  終了日
                </p>
                <p className="mt-1">
                  {survey.endAt
                    ? format(new Date(survey.endAt), "yyyy/MM/dd HH:mm")
                    : "未設定"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                テーマカラー
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: survey.themeColor }}
                />
                <code className="text-sm">{survey.themeColor}</code>
              </div>
            </div>

            {(survey.headerImage || survey.bgImage) && (
              <div
                className={
                  survey.headerImage && survey.bgImage
                    ? "grid grid-cols-2 gap-4"
                    : ""
                }
              >
                {survey.headerImage && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      ヘッダー画像
                    </p>
                    <a
                      href={survey.headerImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block relative w-full h-40 bg-muted rounded-md border overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <Image
                        src={survey.headerImage}
                        alt="ヘッダー画像"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-contain"
                        priority
                      />
                    </a>
                  </div>
                )}

                {survey.bgImage && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      背景画像
                    </p>
                    <a
                      href={survey.bgImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block relative w-full h-40 bg-muted rounded-md border overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <Image
                        src={survey.bgImage}
                        alt="背景画像"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-contain"
                        priority
                      />
                    </a>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 右側：フォーム一覧 */}
        <Card className="flex flex-col max-h-[80vh]">
          <CardHeader className="shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle>質問項目</CardTitle>
              <Button variant="secondary" size="sm" asChild>
                <Link href={`/admin/surveys/${survey.id}/questions`}>
                  <Edit className="mr-2 h-4 w-4" />
                  質問項目を編集
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="overflow-y-auto flex-1 min-h-0">
            <div className="space-y-4">
              {survey.questions.length === 0 ? (
                <div className="text-center p-8 border rounded-lg border-dashed text-muted-foreground">
                  質問はまだありません。
                </div>
              ) : (
                survey.questions.map((q, index) => (
                  <div
                    key={q.id}
                    className="p-4 border rounded-lg bg-card space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-muted-foreground">
                            Q{index + 1}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {q.type}
                          </Badge>
                          {q.required && (
                            <Badge variant="destructive" className="text-xs">
                              必須
                            </Badge>
                          )}
                        </div>
                        <p className="font-medium wrap-break-word">{q.label}</p>
                        {q.options && (
                          <p className="text-sm text-muted-foreground mt-1 wrap-break-word">
                            選択肢:{" "}
                            {(() => {
                              try {
                                return JSON.parse(q.options).join(", ");
                              } catch {
                                return q.options;
                              }
                            })()}
                          </p>
                        )}
                        {q.maxLength && (
                          <p className="text-sm text-muted-foreground mt-1">
                            最大文字数: {q.maxLength}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
