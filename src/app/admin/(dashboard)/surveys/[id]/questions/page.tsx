import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { QuestionList } from "@/features/admin/questions/components/QuestionList";
import { PageHeader } from "@/features/admin/layout/components/PageHeader";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  const survey = await prisma.survey.findUnique({
    where: { id: params.id },
  });

  if (!survey) {
    return {
      title: `質問項目編集 | ${appName}`,
    };
  }

  return {
    title: `質問項目編集 | ${appName}`,
    description: `「${survey.title}」の質問項目編集`,
  };
}

export const dynamic = "force-dynamic";

export default async function EditQuestionsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const survey = await prisma.survey.findUnique({
    where: { id: params.id },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
      app: true,
    },
  });

  if (!survey) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`質問項目編集: ${survey.title}`}
        backHref={`/admin/surveys/${survey.id}`}
        url={`/${survey.app.slug}/${survey.slug}/form`}
        externalLinkHref={`/${survey.app.slug}/${survey.slug}/form?auser_id=dummy`}
        externalLinkTitle="アンケートを開く"
      />

      <QuestionList surveyId={survey.id} questions={survey.questions} />
    </div>
  );
}
