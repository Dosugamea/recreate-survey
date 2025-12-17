"use server";

import { redirect } from "next/navigation";
import { appSchema, AppSchema } from "@/lib/schemas";
import { prisma } from "@/lib/prisma";

export async function createApp(data: AppSchema) {
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
    await prisma.app.create({
      data: {
        name,
        slug,
        privacyPolicyUrl: privacyPolicyUrl || null,
        faviconImageUrl: faviconImageUrl || null,
        copyrightNotice: copyrightNotice || null,
        contactUrl: contactUrl || null,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error(e);
    return { error: "Database error occurred." };
  }

  redirect(`/admin/apps`);
}

export async function updateApp(appId: string, data: AppSchema) {
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
  } catch (e: any) {
    console.error(e);
    return { error: "Database error occurred." };
  }

  return { success: true };
}

export async function getApp(appId: string) {
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
  try {
    return await prisma.app.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error(e);
    return [];
  }
}
