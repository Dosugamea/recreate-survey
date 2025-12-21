import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from "@storybook/nextjs-vite";
import * as projectAnnotations from "./preview";
import { vi } from "vitest";

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);

// Mock Prisma client for browser environment
vi.mock("@/lib/prisma", () => ({
  prisma: {
    app: {
      create: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      delete: vi.fn(),
    },
    survey: {
      create: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      delete: vi.fn(),
    },
    question: {
      create: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      delete: vi.fn(),
    },
    response: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

// Mock Next.js router for browser environment
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => {
    const params = new URLSearchParams();
    return params;
  },
  usePathname: () => "/admin/surveys",
  redirect: vi.fn(),
}));

// Mock apps actions
vi.mock("@/app/actions/apps", () => ({
  getAllApps: vi.fn(() =>
    Promise.resolve([
      {
        id: "app-1",
        name: "Test App 1",
        slug: "test-app-1",
        privacyPolicyUrl: null,
        faviconImageUrl: null,
        copyrightNotice: null,
        contactUrl: null,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      {
        id: "app-2",
        name: "Test App 2",
        slug: "test-app-2",
        privacyPolicyUrl: null,
        faviconImageUrl: null,
        copyrightNotice: null,
        contactUrl: null,
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date("2024-01-02"),
      },
    ])
  ),
  createApp: vi.fn(() => Promise.resolve({ success: true })),
  updateApp: vi.fn(() => Promise.resolve({ success: true })),
  getApp: vi.fn(() =>
    Promise.resolve({
      id: "app-1",
      name: "Test App 1",
      slug: "test-app-1",
      privacyPolicyUrl: null,
      faviconImageUrl: null,
      copyrightNotice: null,
      contactUrl: null,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    })
  ),
}));
