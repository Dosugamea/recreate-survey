import { useMemo } from "react";
import { format } from "date-fns";

/**
 * アンケートの期間判定結果
 */
export interface SurveyPeriodStatus {
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
 * アンケートの期間判定を行う
 * @param startAt アンケートの開始日時。必須
 * @param endAt アンケートの終了日時。必須
 * @returns 期間判定結果
 */
export function getSurveyPeriodStatus(
  startAt: Date | null,
  endAt: Date | null
): SurveyPeriodStatus {
  if (!startAt || !endAt) {
    throw new Error("開始日時と終了日時は両方必須です");
  }

  const now = new Date();
  const isNotStarted = now < startAt;
  const isExpired = now > endAt;
  const isActive = !isNotStarted && !isExpired;

  const periodMessage = (() => {
    if (isNotStarted) {
      return `キャンペーンは ${format(startAt, "yyyy年MM月dd日 HH:mm")} 開始です`;
    }
    if (isExpired) {
      return "キャンペーンは終了しました";
    }
    return `実施期間: ${format(endAt, "yyyy年MM月dd日 HH:mmまで")}`;
  })();

  return { isNotStarted, isExpired, isActive, periodMessage };
}

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
  const { isNotStarted, isExpired, isActive, periodMessage } = useMemo(
    () => getSurveyPeriodStatus(startAt, endAt),
    [startAt, endAt]
  );

  return { isNotStarted, isExpired, isActive, periodMessage };
}
