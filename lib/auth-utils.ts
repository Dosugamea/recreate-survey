import { auth } from "@/auth";

/**
 * 現在ログインしているユーザー情報を取得します。
 * @returns ユーザー情報、未ログイン時はnull
 */
export async function getCurrentUser() {
  const session = await auth();
  return {
    userName: session?.user?.name || "",
    isAdmin: session?.user?.role === "ADMIN",
  };
}

/**
 * 現在のユーザーが管理者（ADMINロール）であることを確認します。
 * @throws Error
 */
export async function ensureAdmin(): Promise<void> {
  const { isAdmin } = await getCurrentUser();
  if (!isAdmin) {
    throw new Error("管理権限がありません。あーし、おこっちゃうよ！💢");
  }
}

/**
 * 現在のユーザーがログインしていることを確認します。
 * @throws Error
 */
export async function ensureUser(): Promise<void> {
  const { userName } = await getCurrentUser();
  if (!userName) {
    throw new Error("ログインが必要です。あーしに誰か教えて！💖");
  }
}
