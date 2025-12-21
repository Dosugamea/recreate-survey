import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SurveyContainer } from "@/components/survey/layout/SurveyContainer";
import { SurveyTitle } from "@/components/survey/header/SurveyTitle";
import { SurveyWarn } from "@/components/survey/messages/SurveyWarn";
import { SurveyDescription } from "@/components/survey/header/SurveyDescription";
import { SurveyContent } from "@/components/survey/layout/SurveyContent";
import { SurveyNotes } from "@/components/survey/messages/SurveyNotes";
import { SurveyFooter } from "@/components/survey/footer/SurveyFooter";
import { SurveyBackToTop } from "@/components/survey/footer/SurveyBackToTop";
import { getSurveyPeriodStatus } from "@/hooks/useSurveyPeriod";
import type { Metadata } from "next";
import { metadata as notFoundMetadata } from "@/app/not-found";

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

  // Check activity
  if (!survey.isActive) {
    notFound();
  }

  // 期間判定を行う
  const { isExpired, periodMessage } = getSurveyPeriodStatus(
    survey.startAt,
    survey.endAt
  );

  // フッター用のリンクを構築
  const footerLinks: Array<{ label: string; href: string }> = [];

  if (app.privacyPolicyUrl) {
    footerLinks.push({
      label: "プライバシーポリシー",
      href: app.privacyPolicyUrl,
    });
  }

  if (app.contactUrl) {
    footerLinks.push({
      label: "お問い合わせ",
      href: app.contactUrl,
    });
  }

  return (
    <>
      <SurveyContainer survey={survey}>
        {!isExpired && userId ? (
          <SurveyContent
            survey={survey}
            questions={survey.questions}
            userId={userId}
            appName={app.name}
          />
        ) : (
          <article>
            <SurveyTitle
              title={survey.title}
              headerImage={survey.headerImage}
            />
            <SurveyWarn show={!userId} />
            <SurveyDescription
              description={survey.description}
              themeColor={survey.themeColor}
              periodMessage={periodMessage}
            />
          </article>
        )}
        <SurveyNotes survey={survey} />
      </SurveyContainer>
      <SurveyFooter
        links={footerLinks.length > 0 ? footerLinks : undefined}
        copyright={app.copyrightNotice ?? undefined}
        themeColor={survey.themeColor}
      />
      <SurveyBackToTop />
    </>
  );
}
