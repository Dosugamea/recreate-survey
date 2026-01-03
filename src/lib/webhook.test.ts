import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendWebhook } from "@/lib/webhook";

// グローバルfetchをモック
global.fetch = vi.fn();

describe("webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // コンソールログをモック
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("sendWebhook", () => {
    const testUrl = "https://example.com/webhook";
    const testPayload = {
      event: "survey.response.created",
      timestamp: "2025-12-28T20:00:00.000Z",
      data: {
        surveyId: "survey-1",
        surveyTitle: "テストアンケート",
        responseId: "response-1",
        userId: "user-1",
        submittedAt: "2025-12-28T20:00:00.000Z",
        answers: [
          {
            questionId: "question-1",
            questionLabel: "お名前を教えてください",
            value: "山田太郎",
          },
        ],
      },
    };

    it("正常にwebhookを送信できる", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        status: 200,
        statusText: "OK",
      } as Response);

      const result = await sendWebhook(testUrl, testPayload);

      expect(result).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
        testUrl,
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "RecreateSurvey/1.0",
          },
          body: JSON.stringify(testPayload),
        })
      );
      expect(console.log).toHaveBeenCalledWith(
        `[Webhook] 送信開始: ${testUrl}`
      );
      expect(console.log).toHaveBeenCalledWith(
        `[Webhook] 送信成功: ${testUrl}`
      );
    });

    it("HTTPエラーの場合はfalseを返す", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      } as Response);

      const result = await sendWebhook(testUrl, testPayload);

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        "[Webhook] 送信失敗: 500 Internal Server Error"
      );
    });

    it("ネットワークエラーの場合はfalseを返す", async () => {
      const networkError = new Error("Network error");
      vi.mocked(fetch).mockRejectedValue(networkError);

      const result = await sendWebhook(testUrl, testPayload);

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        "[Webhook] エラー: Network error"
      );
    });

    it("不明なエラーの場合はfalseを返す", async () => {
      vi.mocked(fetch).mockRejectedValue("Unknown error");

      const result = await sendWebhook(testUrl, testPayload);

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        "[Webhook] 不明なエラー:",
        "Unknown error"
      );
    });
  });
});
