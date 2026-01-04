import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getSurveyPeriodStatus } from "@/hooks/useSurveyPeriod";
import type { Metadata } from "next";
import { metadata as notFoundMetadata } from "@/app/not-found";
import {
  getAppBySlug,
  getPublicSurvey,
} from "@/features/surveys/actions/surveys";
import { SurveyFormPageRoot } from "@/features/surveys/components/SurveyFormPageRoot";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ app: string; slug: string }>;
  searchParams: Promise<{ auser_id?: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;

  const app = await getAppBySlug(params.app);
  if (!app) {
    return notFoundMetadata;
  }

  const survey = await getPublicSurvey(params.app, params.slug);
  if (!survey) {
    return notFoundMetadata;
  }

  const title = `${survey.title} | ${app.name}`;
  const description = `「${app.name}」のキャンペーンに参加しよう！`;
  const metadata: Metadata = {
    title: title,
    description: description,
    keywords: `${app.name},アプリ,キャンペーン`,
    formatDetection: {
      telephone: false,
      address: false,
      email: false,
      date: false,
    },
    openGraph: {
      title: title,
      description: description,
      type: "website",
      siteName: process.env.NEXT_PUBLIC_APP_NAME,
      images: survey.headerImage ? [survey.headerImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      site: process.env.NEXT_PUBLIC_TWITTER_ACCOUNT,
      images: survey.headerImage ? [survey.headerImage] : undefined,
    },
  };

  if (app.faviconImageUrl) {
    metadata.icons = {
      icon: app.faviconImageUrl,
      shortcut: app.faviconImageUrl,
      apple: app.faviconImageUrl,
    };
  }

  return metadata;
}

export default async function SurveyPublicPage(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const userId = searchParams.auser_id;

  // Appを取得
  const app = await getAppBySlug(params.app);
  if (!app) {
    notFound();
  }

  // Surveyを取得
  const survey = await getPublicSurvey(params.app, params.slug);

  if (!survey) {
    notFound();
  }
  const { isExpired, periodMessage } = getSurveyPeriodStatus(
    survey.startAt,
    survey.endAt
  );

  // クッキーをチェックして、既に送信済みかどうかを確認
  const cookieStore = await cookies();
  const cookieName = `survey_${survey.id}_${userId}`;
  const isAlreadySubmitted = userId
    ? cookieStore.get(cookieName)?.value === "submitted"
    : false;

  return (
    <SurveyFormPageRoot
      app={app}
      survey={survey}
      userId={userId}
      isAlreadySubmitted={isAlreadySubmitted}
      isExpired={isExpired}
      periodMessage={periodMessage}
    />
  );
}
