"use server";

import { signIn, signOut } from "@/lib/auth/auth";
import { AuthError } from "next-auth";

/**
 * サインインアクション
 * @param prevState 前の状態
 * @param formData フォームデータ
 * @returns エラーメッセージまたはundefined
 */
export async function signInAction(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

/**
 * サインアウトアクション
 */
export async function signOutAction() {
  await signOut({ redirectTo: "/admin/login" });
}
