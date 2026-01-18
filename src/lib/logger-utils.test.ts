import { describe, it, expect, vi, beforeEach } from "vitest";
import { insertAuditLog } from "@/lib/logger-utils";
import { prisma } from "@/lib/prisma";
import * as authUtils from "@/lib/auth-utils";

// Mock dependencies
vi.mock("@/lib/prisma", () => ({
  prisma: {
    auditLog: {
      create: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth-utils", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn().mockReturnValue({
    get: vi.fn((key) => {
      if (key === "x-forwarded-for") return "127.0.0.1";
      if (key === "user-agent") return "Mozilla/5.0";
      return null;
    }),
  }),
}));

describe("insertAuditLog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create audit log with current user", async () => {
    vi.mocked(authUtils.getCurrentUser).mockResolvedValue({
      id: "user-1",
      userName: "Test User",
      isAdmin: true,
    });

    await insertAuditLog({
      action: "CREATE",
      resource: "SURVEY",
      resourceId: "survey-1",
      details: { title: "New Survey" },
    });

    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: {
        userId: "user-1",
        action: "CREATE",
        resource: "SURVEY",
        resourceId: "survey-1",
        details: JSON.stringify({ title: "New Survey" }),
        ipAddress: "127.0.0.1",
        userAgent: "Mozilla/5.0",
      },
    });
  });

  it("should use provided userId if available", async () => {
    await insertAuditLog({
      action: "LOGIN",
      resource: "AUTH",
      userId: "user-provided",
    });

    expect(authUtils.getCurrentUser).not.toHaveBeenCalled();
    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: "user-provided",
        }),
      })
    );
  });

  it("should skip logging if no user id found", async () => {
    vi.mocked(authUtils.getCurrentUser).mockResolvedValue({
      id: "",
      userName: "",
      isAdmin: false,
    });

    await insertAuditLog({
      action: "CREATE",
      resource: "SURVEY",
    });

    expect(prisma.auditLog.create).not.toHaveBeenCalled();
  });

  it("should handle errors gracefully", async () => {
    vi.mocked(authUtils.getCurrentUser).mockResolvedValue({
      id: "user-1",
      userName: "Test User",
      isAdmin: true,
    });
    vi.mocked(prisma.auditLog.create).mockRejectedValue(new Error("DB Error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await insertAuditLog({
      action: "CREATE",
      resource: "SURVEY",
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to create audit log:",
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });
});
