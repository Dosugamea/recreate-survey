import { describe, it, expect, vi, beforeEach } from "vitest";
import { createApp, updateApp, getApp, getAllApps } from "@/app/actions/apps";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { AppSchema } from "@/lib/schemas";

// Mock dependencies
vi.mock("@/lib/prisma", () => ({
  prisma: {
    app: {
      create: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/lib/auth-utils", () => ({
  ensureUser: vi.fn(),
  ensureAdmin: vi.fn(),
  getCurrentUser: vi.fn(),
}));

describe("apps actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createApp", () => {
    it("should create an app with valid data", async () => {
      const validData = {
        name: "Test App",
        slug: "test-app",
        privacyPolicyUrl: "https://example.com/privacy",
        faviconImageUrl: "https://example.com/favicon.ico",
        copyrightNotice: "© 2024 Test",
        contactUrl: "https://example.com/contact",
      };

      vi.mocked(prisma.app.create).mockResolvedValue({
        id: "app-1",
        ...validData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await createApp(validData);

      expect(prisma.app.create).toHaveBeenCalledWith({
        data: {
          name: validData.name,
          slug: validData.slug,
          privacyPolicyUrl: validData.privacyPolicyUrl,
          faviconImageUrl: validData.faviconImageUrl,
          copyrightNotice: validData.copyrightNotice,
          contactUrl: validData.contactUrl,
        },
      });
      expect(redirect).toHaveBeenCalledWith("/admin/apps");
    });

    it("should create an app with optional fields as null", async () => {
      const validData = {
        name: "Test App",
        slug: "test-app",
        privacyPolicyUrl: "",
        faviconImageUrl: "",
        copyrightNotice: "",
        contactUrl: "",
      };

      vi.mocked(prisma.app.create).mockResolvedValue({
        id: "app-1",
        name: validData.name,
        slug: validData.slug,
        privacyPolicyUrl: null,
        faviconImageUrl: null,
        copyrightNotice: null,
        contactUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await createApp(validData);

      expect(prisma.app.create).toHaveBeenCalledWith({
        data: {
          name: validData.name,
          slug: validData.slug,
          privacyPolicyUrl: null,
          faviconImageUrl: null,
          copyrightNotice: null,
          contactUrl: null,
        },
      });
    });

    it("should return error for invalid data", async () => {
      const invalidData: Partial<AppSchema> = {
        name: "",
        slug: "invalid slug with spaces",
      };

      const result = await createApp(invalidData as AppSchema);

      expect(result).toEqual({ error: "Invalid data" });
      expect(prisma.app.create).not.toHaveBeenCalled();
      expect(redirect).not.toHaveBeenCalled();
    });

    it("should return error on database error", async () => {
      const validData = {
        name: "Test App",
        slug: "test-app",
      };

      vi.mocked(prisma.app.create).mockRejectedValue(
        new Error("Database error")
      );

      const result = await createApp(validData);

      expect(result).toEqual({ error: "Database error occurred." });
      expect(redirect).not.toHaveBeenCalled();
    });
  });

  describe("updateApp", () => {
    it("should update an app with valid data", async () => {
      const appId = "app-1";
      const validData = {
        name: "Updated App",
        slug: "updated-app",
        privacyPolicyUrl: "https://example.com/privacy",
        faviconImageUrl: "",
        copyrightNotice: "",
        contactUrl: "",
      };

      vi.mocked(prisma.app.update).mockResolvedValue({
        id: appId,
        ...validData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await updateApp(appId, validData);

      expect(prisma.app.update).toHaveBeenCalledWith({
        where: { id: appId },
        data: {
          name: validData.name,
          slug: validData.slug,
          privacyPolicyUrl: validData.privacyPolicyUrl,
          faviconImageUrl: null,
          copyrightNotice: null,
          contactUrl: null,
        },
      });
      expect(result).toEqual({ success: true });
    });

    it("should return error for invalid data", async () => {
      const appId = "app-1";
      const invalidData: Partial<AppSchema> = {
        name: "",
        slug: "invalid",
      };

      const result = await updateApp(appId, invalidData as AppSchema);

      expect(result).toEqual({ error: "Invalid data" });
      expect(prisma.app.update).not.toHaveBeenCalled();
    });

    it("should return error on database error", async () => {
      const appId = "app-1";
      const validData = {
        name: "Updated App",
        slug: "updated-app",
      };

      vi.mocked(prisma.app.update).mockRejectedValue(
        new Error("Database error")
      );

      const result = await updateApp(appId, validData);

      expect(result).toEqual({ error: "Database error occurred." });
    });
  });

  describe("getApp", () => {
    it("should return an app when found", async () => {
      const appId = "app-1";
      const mockApp = {
        id: appId,
        name: "Test App",
        slug: "test-app",
        privacyPolicyUrl: null,
        faviconImageUrl: null,
        copyrightNotice: null,
        contactUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.app.findUnique).mockResolvedValue(mockApp);

      const result = await getApp(appId);

      expect(prisma.app.findUnique).toHaveBeenCalledWith({
        where: { id: appId },
      });
      expect(result).toEqual(mockApp);
    });

    it("should return null when app not found", async () => {
      const appId = "non-existent";

      vi.mocked(prisma.app.findUnique).mockResolvedValue(null);

      const result = await getApp(appId);

      expect(result).toBeNull();
    });

    it("should return null on database error", async () => {
      const appId = "app-1";

      vi.mocked(prisma.app.findUnique).mockRejectedValue(
        new Error("Database error")
      );

      const result = await getApp(appId);

      expect(result).toBeNull();
    });
  });

  describe("getAllApps", () => {
    it("should return all apps ordered by createdAt desc", async () => {
      const mockApps = [
        {
          id: "app-1",
          name: "App 1",
          slug: "app-1",
          privacyPolicyUrl: null,
          faviconImageUrl: null,
          copyrightNotice: null,
          contactUrl: null,
          createdAt: new Date("2024-01-02"),
          updatedAt: new Date("2024-01-02"),
        },
        {
          id: "app-2",
          name: "App 2",
          slug: "app-2",
          privacyPolicyUrl: null,
          faviconImageUrl: null,
          copyrightNotice: null,
          contactUrl: null,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-01"),
        },
      ];

      vi.mocked(prisma.app.findMany).mockResolvedValue(mockApps);

      const result = await getAllApps();

      expect(prisma.app.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual(mockApps);
    });

    it("should return empty array on database error", async () => {
      vi.mocked(prisma.app.findMany).mockRejectedValue(
        new Error("Database error")
      );

      const result = await getAllApps();

      expect(result).toEqual([]);
    });
  });
});
