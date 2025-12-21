import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getSurveyPeriodStatus } from "./useSurveyPeriod";
import { format } from "date-fns";

// Mock date-fns
vi.mock("date-fns", () => ({
  format: vi.fn(),
}));

describe("getSurveyPeriodStatus", () => {
  // テスト用の固定日時
  const mockNow = new Date("2024-12-15T12:00:00Z");
  const beforeStart = new Date("2024-12-20T12:00:00Z"); // 開始前
  const afterEnd = new Date("2024-12-10T12:00:00Z"); // 終了後
  const futureEnd = new Date("2024-12-25T12:00:00Z"); // 未来の終了日

  beforeEach(() => {
    // Date.now() をモックしてテストを安定させる
    vi.useFakeTimers();
    vi.setSystemTime(mockNow);

    // format関数をモック
    vi.mocked(format).mockImplementation((date, formatStr) => {
      if (formatStr === "yyyy年MM月dd日 HH:mm") {
        return "2024年12月20日 12:00";
      }
      if (formatStr === "yyyy年MM月dd日 HH:mmまで") {
        return "2024年12月25日 12:00まで";
      }
      return "formatted-date";
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe("開始前状態", () => {
    it("開始日時と終了日時が両方設定されていて、現在時刻が開始日時より前の場合", () => {
      const result = getSurveyPeriodStatus(beforeStart, futureEnd);

      expect(result).toEqual({
        isNotStarted: true,
        isExpired: false,
        isActive: false,
        periodMessage: "キャンペーンは 2024年12月20日 12:00 開始です",
      });
    });
  });

  describe("実施中状態", () => {
    it("開始日時と終了日時が両方設定されていて、現在時刻が期間内の場合", () => {
      const result = getSurveyPeriodStatus(afterEnd, futureEnd);

      expect(result).toEqual({
        isNotStarted: false,
        isExpired: false,
        isActive: true,
        periodMessage: "実施期間: 2024年12月25日 12:00まで",
      });
    });
  });

  describe("終了状態", () => {
    it("開始日時と終了日時が両方設定されていて、現在時刻が終了日時より後の場合", () => {
      const result = getSurveyPeriodStatus(afterEnd, afterEnd);

      expect(result).toEqual({
        isNotStarted: false,
        isExpired: true,
        isActive: false,
        periodMessage: "キャンペーンは終了しました",
      });
    });
  });

  describe("エラーケース", () => {
    it("開始日時がnullの場合、エラーを投げる", () => {
      expect(() => getSurveyPeriodStatus(null, futureEnd)).toThrow(
        "開始日時と終了日時は両方必須です"
      );
    });

    it("終了日時がnullの場合、エラーを投げる", () => {
      expect(() => getSurveyPeriodStatus(beforeStart, null)).toThrow(
        "開始日時と終了日時は両方必須です"
      );
    });

    it("開始日時と終了日時が両方nullの場合、エラーを投げる", () => {
      expect(() => getSurveyPeriodStatus(null, null)).toThrow(
        "開始日時と終了日時は両方必須です"
      );
    });
  });
});
