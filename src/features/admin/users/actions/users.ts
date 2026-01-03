"use server";

import { ensureUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function getUsers() {
  await ensureUser();
  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
}
