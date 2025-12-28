/**
 * Webhook送信用のユーティリティ関数
 */

interface WebhookPayload {
  event: string;
  timestamp: string;
  data: {
    surveyId: string;
    surveyTitle: string;
    responseId: string;
    userId: string;
    submittedAt: string;
    answers: Array<{
      questionId: string;
      questionLabel: string;
      value: string;
    }>;
  };
}

/**
 * 指定されたURLにWebhookを送信する
 * @param url Webhook送信先URL
 * @param payload 送信するデータ
 * @returns 送信成功時はtrue、失敗時はfalse
 */
export async function sendWebhook(
  url: string,
  payload: WebhookPayload
): Promise<boolean> {
  try {
    console.log(`[Webhook] 送信開始: ${url}`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "RecreateSurvey/1.0",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000), // 10秒でタイムアウト
    });

    if (!response.ok) {
      console.error(
        `[Webhook] 送信失敗: ${response.status} ${response.statusText}`
      );
      return false;
    }

    console.log(`[Webhook] 送信成功: ${url}`);
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`[Webhook] エラー: ${error.message}`);
    } else {
      console.error(`[Webhook] 不明なエラー:`, error);
    }
    return false;
  }
}
