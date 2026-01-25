"use server";

import { redirect } from "next/navigation";
import { appSchema, AppSchema } from "@/lib/schemas";
import { prisma } from "@/lib/prisma";
import { ensureUser } from "@/lib/auth-utils";
import { insertAuditLog } from "@/lib/logger-utils";

export async function createApp(data: AppSchema) {
  await ensureUser();
  const result = appSchema.safeParse(data);

  if (!result.success) {
    return { error: "Invalid data" };
  }

  const {
    name,
    slug,
    privacyPolicyUrl,
    faviconImageUrl,
    copyrightNotice,
    contactUrl,
  } = result.data;

  try {
    const createdApp = await prisma.app.create({
      data: {
        name,
        slug,
        privacyPolicyUrl: privacyPolicyUrl || null,
        faviconImageUrl: faviconImageUrl || null,
        copyrightNotice: copyrightNotice || null,
        contactUrl: contactUrl || null,
      },
    });

    await insertAuditLog({
      action: "CREATE",
      resource: "APP",
      resourceId: createdApp.id,
      details: { name, slug },
    });
  } catch (e: unknown) {
    console.error(e);
    return { error: "Database error occurred." };
  }

  redirect(`/admin/apps`);
}

export async function updateApp(appId: string, data: AppSchema) {
  await ensureUser();
  const result = appSchema.safeParse(data);

  if (!result.success) {
    return { error: "Invalid data" };
  }

  const {
    name,
    slug,
    privacyPolicyUrl,
    faviconImageUrl,
    copyrightNotice,
    contactUrl,
  } = result.data;

  try {
    await prisma.app.update({
      where: { id: appId },
      data: {
        name,
        slug,
        privacyPolicyUrl: privacyPolicyUrl || null,
        faviconImageUrl: faviconImageUrl || null,
        copyrightNotice: copyrightNotice || null,
        contactUrl: contactUrl || null,
      },
    });

    await insertAuditLog({
      action: "UPDATE",
      resource: "APP",
      resourceId: appId,
      details: { name, slug },
    });
  } catch (e: unknown) {
    console.error(e);
    return { error: "Database error occurred." };
  }

  return { success: true };
}

export async function getApp(appId: string) {
  await ensureUser();
  try {
    return await prisma.app.findUnique({
      where: { id: appId },
    });
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getAllApps() {
  await ensureUser();
  try {
    return await prisma.app.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getApps() {
  await ensureUser();
  try {
    return await prisma.app.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
      },
    });
  } catch (e) {
    console.error(e);
    return [];
  }
}
