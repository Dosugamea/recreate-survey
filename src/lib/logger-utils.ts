import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";
import { headers } from "next/headers";

interface CreateAuditLogParams {
  action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN";
  resource: "SURVEY" | "USER" | "AUTH";
  resourceId?: string;
  details?: Record<string, unknown>;
  userId?: string; // 明示的に指定する場合（ログイン直後など）
}

/**
 * 監査ログを作成する
 * @param params ログパラメータ
 */
export async function insertAuditLog(params: CreateAuditLogParams) {
  try {
    let userId = params.userId;

    // userIdが指定されていない場合は、現在のユーザーを取得
    if (!userId) {
      const user = await getCurrentUser();
      userId = user?.id;
    }

    if (!userId) {
      console.warn("Audit log creation skipped: User ID not found.");
      return;
    }

    // IPアドレスとUserAgentを取得
    const headersList = await headers();
    const ipAddress =
      headersList.get("CF-Connecting-IP") ||
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip") ||
      null;
    const userAgent = headersList.get("user-agent") || null;

    await prisma.auditLog.create({
      data: {
        userId,
        action: params.action,
        resource: params.resource,
        resourceId: params.resourceId,
        details: params.details ? JSON.stringify(params.details) : null,
        ipAddress,
        userAgent,
      },
    });
  } catch (e) {
    // 監査ログの作成失敗がメイン処理に影響を与えないようにエラーは握りつぶすが、ログには残す
    console.error("Failed to create audit log:", e);
  }
}
