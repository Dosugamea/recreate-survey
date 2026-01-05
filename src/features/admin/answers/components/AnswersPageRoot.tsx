import { SurveyList } from "@/features/admin/surveys/components/list/SurveyList";
import { Prisma } from "@prisma/client";

// SurveyListが期待するsurveysの型に合わせて定義
// prisma.survey.findManyの戻り値の型から推論するか、明示的に定義する
type SurveyWithAppAndCount = Prisma.SurveyGetPayload<{
  include: {
    app: true;
    _count: {
      select: { responses: true };
    };
  };
}>;

interface AnswersPageRootProps {
  apps: {
    id: string;
    name: string;
  }[];
  surveys: SurveyWithAppAndCount[];
  currentAppId?: string;
}

export function AnswersPageRoot({
  apps,
  surveys,
  currentAppId,
}: AnswersPageRootProps) {
  return (
    <SurveyList
      apps={apps}
      surveys={surveys}
      currentAppId={currentAppId}
      showResponseCount={true}
      headerTitle="アンケート結果一覧"
      headerDescription="回答があるアンケートの一覧を表示しています。各アンケートの結果を確認できます。"
      showCreateButton={false}
      showDetailButton={false}
    />
  );
}
