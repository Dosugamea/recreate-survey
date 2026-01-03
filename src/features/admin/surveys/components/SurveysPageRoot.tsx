import { SurveyList } from "@/features/admin/surveys/components/SurveyList";
import { Prisma } from "@prisma/client";

// SurveyListが期待するsurveysの型に合わせて定義
type SurveyWithApp = Prisma.SurveyGetPayload<{
  include: {
    app: true;
  };
}>;

interface SurveysPageRootProps {
  apps: {
    id: string;
    name: string;
  }[];
  surveys: SurveyWithApp[];
  currentAppId?: string;
}

export function SurveysPageRoot({
  apps,
  surveys,
  currentAppId,
}: SurveysPageRootProps) {
  return (
    <SurveyList apps={apps} surveys={surveys} currentAppId={currentAppId} />
  );
}
