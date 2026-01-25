"use server";

import { ensureAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function getAuditLogs(page = 1, pageSize = 20) {
  await ensureAdmin();

  const skip = (page - 1) * pageSize;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.auditLog.count(),
  ]);

  return {
    logs,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getAuditLogById(id: string) {
  await ensureAdmin();

  const log = await prisma.auditLog.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!log) {
    throw new Error("Audit log not found");
  }

  return log;
}
