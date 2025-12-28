import { auth } from "@/auth";

/**
 * 現在のユーザーが管理者（ADMINロール）であることを確認します。
 */
export async function ensureAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("管理権限がありません。あーし、おこっちゃうよ！💢");
  }
}

/**
 * 現在のユーザーがログインしていることを確認します。
 */
export async function ensureUser() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("ログインが必要です。あーしに誰か教えて！💖");
  }
}
