import { headers } from "next/headers";

/**
 * Turnstileのトークンを検証する
 * @param token Turnstileのトークン
 * @returns 検証結果(true: 成功, false: 失敗)
 */
export async function verifyTurnstile(token: string | null): Promise<boolean> {
  if (!token) {
    console.error("Turnstile token is missing");
    return false;
  }

  // Cloudflare Workers/Pagesを使用している場合はCF-Connecting-IPを使用
  // それ以外の場合は通常のIPヘッダーを使用
  const headersList = await headers();
  const ip =
    headersList.get("CF-Connecting-IP") ||
    headersList.get("x-forwarded-for")?.split(",")[0] ||
    headersList.get("x-real-ip") ||
    "";

  const verifyFormData = new FormData();
  verifyFormData.append("secret", process.env.CF_TURNSTILE_SECRET_KEY!);
  verifyFormData.append("response", token);
  if (ip) {
    verifyFormData.append("remoteip", ip);
  }

  try {
    const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    const result = await fetch(url, {
      body: verifyFormData,
      method: "POST",
    });

    const outcome = (await result.json()) as {
      success: boolean;
      "error-codes": string[];
    };

    if (!outcome.success) {
      console.error("Turnstile validation failed", {
        errorCodes: outcome["error-codes"],
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}
