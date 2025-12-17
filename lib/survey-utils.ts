/**
 * アンケート関連のユーティリティ関数
 */

/**
 * アンケートが期間外かどうかを判定
 */
export function isSurveyExpired(endAt: Date | null): boolean {
  if (!endAt) {
    return false;
  }
  const now = new Date();
  return now > endAt;
}

