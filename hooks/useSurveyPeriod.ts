import { useMemo } from "react";
import { format } from "date-fns";

interface UseSurveyPeriodProps {
  /** アンケートの開始日時。nullの場合は開始日時の制限なし */
  startAt: Date | null;
  /** アンケートの終了日時。nullの場合は終了日時の制限なし */
  endAt: Date | null;
}

interface UseSurveyPeriodReturn {
  /** アンケートがまだ開始されていないかどうか。現在時刻がstartAtより前の場合にtrue */
  isNotStarted: boolean;
  /** アンケートが終了しているかどうか。現在時刻がendAtより後の場合にtrue */
  isExpired: boolean;
  /** アンケートが実施中かどうか。isNotStartedとisExpiredの両方がfalseの場合にtrue */
  isActive: boolean;
  /** 期間に関するメッセージ。開始前・実施中・終了後のいずれかの状態に応じたメッセージを返す。期間が設定されていない場合はnull */
  periodMessage: string | null;
}

/**
 * アンケートの期間判定ロジックを提供するフック
 */
export function useSurveyPeriod({
  startAt,
  endAt,
}: UseSurveyPeriodProps): UseSurveyPeriodReturn {
  const { isNotStarted, isExpired, isActive, periodMessage } = useMemo(() => {
    const now = new Date();
    const isNotStarted = startAt ? now < startAt : false;
    const isExpired = endAt ? now > endAt : false;
    const isActive = !isNotStarted && !isExpired;

    let periodMessage: string | null = null;
    if (startAt && endAt) {
      if (isNotStarted) {
        periodMessage = `キャンペーンは ${format(
          startAt,
          "yyyy年MM月dd日 HH:mm"
        )} 開始です`;
      } else if (isExpired) {
        periodMessage = "キャンペーンは終了しました";
      } else {
        periodMessage = `実施期間: ${format(
          endAt,
          "yyyy年MM月dd日 HH:mmまで"
        )}`;
      }
    }

    return { isNotStarted, isExpired, isActive, periodMessage };
  }, [startAt, endAt]);

  return { isNotStarted, isExpired, isActive, periodMessage };
}
