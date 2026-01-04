"use server";

import { ensureAdmin, ensureUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

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
