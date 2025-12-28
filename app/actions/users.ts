"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const UserSchema = z.object({
  name: z.string().min(1, "名前を入力してね"),
  email: z.email("有効なメールアドレスを入力してね"),
  password: z.string().min(6, "パスワードは6文字以上で入力してね"),
  role: z.enum(["ADMIN", "USER"]),
});

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  const validated = UserSchema.safeParse({
    name,
    email,
    password,
    role,
  });

  if (!validated.success) {
    return {
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.data.email },
    });

    if (existingUser) {
      return {
        error: {
          email: ["そのメールアドレスは既にあーしが知ってるよ（登録済みだよ）"],
        },
      };
    }

    const hashedPassword = await bcrypt.hash(validated.data.password, 10);

    await prisma.user.create({
      data: {
        name: validated.data.name,
        email: validated.data.email,
        password: hashedPassword,
        role: validated.data.role,
      },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to create user:", error);
    return {
      error: { _form: ["ユーザー作成に失敗しちゃった。ごめんね、せんぱい。"] },
    };
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: { id },
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { error: "ユーザーを削除できなかったよ..." };
  }
}
