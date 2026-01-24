"use server";

import { ensureAdmin, ensureUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { insertAuditLog } from "@/lib/logger-utils";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const UserSchema = z.object({
  name: z.string().min(1, "名前を入力してね"),
  email: z.email("有効なメールアドレスを入力してね"),
  password: z
    .string()
    .min(6, "パスワードは6文字以上で入力してね")
    .optional()
    .or(z.literal("")),
  role: z.enum(["ADMIN", "USER"]),
});

export async function createUser(formData: FormData) {
  await ensureAdmin();
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

  if (!validated.data.password) {
    return {
      error: {
        password: ["パスワードを入力してね"],
      },
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

    // User logging manually needs ID, but prisma.create returns it.
    // However, I need to capture it.
    const createdUser = await prisma.user.findUnique({
      where: { email: validated.data.email },
    });
    if (createdUser) {
      await insertAuditLog({
        action: "CREATE",
        resource: "USER",
        resourceId: createdUser.id,
        details: {
          name: createdUser.name,
          email: createdUser.email,
          role: createdUser.role,
        },
      });
    }

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to create user:", error);
    return {
      error: { _form: ["ユーザー作成に失敗しちゃった。ごめんね、せんぱい。"] },
    };
  }
}

export async function updateUser(id: string, formData: FormData) {
  await ensureAdmin();
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
      where: { id },
    });

    if (!existingUser) {
      return {
        error: { _form: ["ユーザーが見つからないよ..."] },
      };
    }

    // Check email uniqueness if email is changed
    if (validated.data.email !== existingUser.email) {
      const emailConflict = await prisma.user.findUnique({
        where: { email: validated.data.email },
      });
      if (emailConflict) {
        return {
          error: {
            email: ["そのメールアドレスは他の子が使ってるみたいだよ"],
          },
        };
      }
    }

    const data: {
      name: string;
      email: string;
      role: "ADMIN" | "USER";
      password?: string;
    } = {
      name: validated.data.name,
      email: validated.data.email,
      role: validated.data.role,
    };

    if (validated.data.password) {
      data.password = await bcrypt.hash(validated.data.password, 10);
    }

    await prisma.user.update({
      where: { id },
      data,
    });

    await insertAuditLog({
      action: "UPDATE",
      resource: "USER",
      resourceId: id,
      details: { name: data.name, email: data.email, role: data.role },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to update user:", error);
    return {
      error: {
        _form: ["ユーザーの更新に失敗しちゃった。ごめんね、せんぱい。"],
      },
    };
  }
}

export async function deleteUser(id: string) {
  await ensureAdmin();
  try {
    await prisma.user.delete({
      where: { id },
    });
    await insertAuditLog({
      action: "DELETE",
      resource: "USER",
      resourceId: id,
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { error: "ユーザーを削除できなかったよ..." };
  }
}

export async function getUsers() {
  await ensureUser();
  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getUser(id: string) {
  await ensureAdmin();
  return await prisma.user.findUnique({
    where: { id },
  });
}
