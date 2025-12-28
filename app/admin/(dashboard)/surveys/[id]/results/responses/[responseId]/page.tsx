import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function SurveyResponseDetailPage(props: {
  params: Promise<{ id: string; responseId: string }>;
}) {
  const params = await props.params;

  const survey = await prisma.survey.findUnique({
    where: { id: params.id },
    select: { title: true },
  });

  if (!survey) {
    notFound();
  }

  const response = await prisma.response.findUnique({
    where: { id: params.responseId },
    include: {
      answers: {
        include: {
          question: true,
        },
      },
      survey: {
        include: {
          questions: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!response) {
    notFound();
  }

  // 質問の順番通りに回答を並べ替えるためのマップを作成
  const answerMap = new Map(response.answers.map((a) => [a.questionId, a]));

  const orderedQuestions = response.survey.questions;

  return (
    <div className="space-y-8">
      <PageHeader
        title="回答詳細"
        backHref={`/admin/surveys/${params.id}/results/responses`}
        description={`ユーザーID: ${response.userId} / 回答日時: ${format(
          response.submittedAt,
          "yyyy/MM/dd HH:mm",
          { locale: ja }
        )}`}
      />

      <div className="space-y-6">
        {orderedQuestions.map((question) => {
          const answer = answerMap.get(question.id);
          return (
            <Card key={question.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-start justify-between gap-4">
                  <span>{question.label}</span>
                  <Badge variant="outline">{question.type}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {answer ? (
                  <div className="bg-muted/50 p-3 rounded-md whitespace-pre-wrap">
                    {answer.value}
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm italic">
                    回答なし
                  </span>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
