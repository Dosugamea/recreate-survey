import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SurveyContainer } from "@/components/survey/SurveyContainer";
import { SurveyIntroduction } from "@/components/survey/SurveryIntroduction";
import { SurveyHeader } from "@/components/survey/SurveyHeader";
import { SurveyForm } from "@/components/survey/SurveyForm";
import { SurveyFooter } from "@/components/survey/SurveyFooter";
import { SurveyBackToTop } from "@/components/survey/SurveyBackToTop";
import type { Metadata } from "next";
import { metadata as notFoundMetadata } from "../../../not-found";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
  params: Promise<{ app: string; slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  // まずAppを取得
  const app = await prisma.app.findUnique({
    where: { slug: params.app },
  });

  if (!app) {
    return notFoundMetadata;
  }

  // Surveyを取得（AppのslugとSurveyのslugの両方で検索）
  const survey = await prisma.survey.findFirst({
    where: {
      slug: params.slug,
      app: {
        slug: params.app,
      },
      isActive: true,
    },
  });

  if (!survey) {
    return notFoundMetadata;
  }

  const metadata: Metadata = {
    title: `${survey.title} | ${app.name}`,
  };

  // ファビコンを設定
  if (app.faviconImageUrl) {
    metadata.icons = {
      icon: app.faviconImageUrl,
      shortcut: app.faviconImageUrl,
      apple: app.faviconImageUrl,
    };
  }

  return metadata;
}

export default async function SurveyPublicPage(props: {
  params: Promise<{ app: string; slug: string }>;
  searchParams: Promise<{ auser_id?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const userId = searchParams.auser_id;

  // Appを取得
  const app = await prisma.app.findUnique({
    where: { slug: params.app },
  });

  if (!app) {
    console.error(`[Survey Form] App not found with slug: "${params.app}"`);
    // デバッグ用: すべてのAppのslugをログ出力
    const allApps = await prisma.app.findMany({
      select: { slug: true, name: true },
    });
    console.error(`[Survey Form] Available apps:`, allApps);
    notFound();
  }

  // Surveyを取得（AppのslugとSurveyのslugの両方で検索）
  const survey = await prisma.survey.findFirst({
    where: {
      slug: params.slug,
      app: {
        slug: params.app,
      },
    },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
      app: true,
    },
  });

  if (!survey) {
    console.error(
      `[Survey Form] Survey not found with slug: "${params.slug}" for app: "${params.app}"`
    );
    // デバッグ用: 該当AppのすべてのSurveyのslugをログ出力
    const appSurveys = await prisma.survey.findMany({
      where: { appId: app.id },
      select: { slug: true, title: true },
    });
    console.error(
      `[Survey Form] Available surveys for app "${params.app}":`,
      appSurveys
    );
    notFound();
  }

  // Surveyが指定されたAppに属していない場合のエラーチェック
  if (survey.app.slug !== params.app) {
    notFound();
  }

  // Check activity/dates
  const now = new Date();
  if (!survey.isActive) {
    notFound();
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

  // フッター用のリンクを構築
  const footerLinks: Array<{ label: string; href: string }> = [];

  if (app.privacyPolicyUrl) {
    footerLinks.push({
      label: "プライバシーポリシー",
      href: app.privacyPolicyUrl,
    });
  }

  if (app.contactEmail) {
    footerLinks.push({
      label: "お問い合わせ",
      href: `mailto:${app.contactEmail}`,
    });
  }

  return (
    <>
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
      <SurveyFooter
        links={footerLinks.length > 0 ? footerLinks : undefined}
        copyright={app.copyrightNotice ?? undefined}
        poweredBy={app.name}
        themeColor={survey.themeColor}
      />
      <SurveyBackToTop />
    </>
  );
}
