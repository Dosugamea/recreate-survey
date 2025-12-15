import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SurveyContainer } from "@/components/survey/SurveyContainer";
import { SurveyIntroduction } from "@/components/survey/SurveryIntroduction";
import { SurveyHeader } from "@/components/survey/SurveyHeader";
import { SurveyForm } from "@/components/survey/SurveyForm";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "アンケートアプリ";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const survey = await prisma.survey.findUnique({
    where: { slug: params.slug },
  });

  if (!survey) {
    return {
      title: `フォーム | ${appName}`,
    };
  }

  return {
    title: `${survey.title} | ${appName}`,
  };
}

export default async function SurveyPublicPage(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ auser_id?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const userId = searchParams.auser_id;

  const survey = await prisma.survey.findUnique({
    where: { slug: params.slug },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!survey) {
    notFound();
  }

  // Check activity/dates
  const now = new Date();
  if (!survey.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        このアンケートは現在公開されていません。
      </div>
    );
  }
  if (survey.startAt && now < survey.startAt) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        このアンケートはまだ開始されていません。
      </div>
    );
  }
  if (survey.endAt && now > survey.endAt) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        このアンケートは終了しました。
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded shadow text-center max-w-md">
          <h1 className="text-xl font-bold text-red-600 mb-2">エラー</h1>
          <p>
            ユーザーID (auser_id)
            が不足しています。アプリから再度アクセスしてください。
          </p>
        </div>
      </div>
    );
  }

  return (
    <SurveyContainer survey={survey}>
      <SurveyHeader survey={survey} />
      <SurveyIntroduction themeColor={survey.themeColor} />
      <SurveyForm
        surveyId={survey.id}
        questions={survey.questions}
        userId={userId}
        themeColor={survey.themeColor}
      />
    </SurveyContainer>
  );
}
