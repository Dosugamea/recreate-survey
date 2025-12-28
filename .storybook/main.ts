import type { StorybookConfig } from "@storybook/nextjs-vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ["../components/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
  ],
  framework: "@storybook/nextjs-vite",
  staticDirs: ["../public"],
  async viteFinal(config) {
    // Replace lib/prisma.ts and adapter with mocks for browser environment
    // This prevents better-sqlite3 from being loaded in the browser
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@/lib/prisma": path.resolve(__dirname, "./mocks/prisma.ts"),
      "@prisma/adapter-better-sqlite3": path.resolve(
        __dirname,
        "./mocks/adapter-better-sqlite3.ts"
      ),
      "@prisma/client": path.resolve(__dirname, "./mocks/prisma-client.ts"),
      ".prisma/client": path.resolve(__dirname, "./mocks/prisma-client.ts"),
      "next/navigation": path.resolve(__dirname, "./mocks/next-navigation.ts"),
      "next/cache": path.resolve(__dirname, "./mocks/next-cache.ts"),
      "@/auth": path.resolve(__dirname, "./mocks/auth.ts"),
    };

    // Exclude better-sqlite3 and Prisma from optimization to prevent bundling
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.exclude = [
      ...(config.optimizeDeps.exclude || []),
      "better-sqlite3",
      "@prisma/adapter-better-sqlite3",
      "@prisma/client",
      ".prisma/client",
    ];

    // Externalize better-sqlite3 and Prisma for SSR to prevent loading in browser
    config.ssr = config.ssr || {};
    if (Array.isArray(config.ssr.external)) {
      config.ssr.external = [
        ...config.ssr.external,
        "better-sqlite3",
        "@prisma/client",
        ".prisma/client",
      ];
    } else {
      config.ssr.external = [
        "better-sqlite3",
        "@prisma/client",
        ".prisma/client",
      ];
    }
    // Remove better-sqlite3 from noExternal if present
    if (Array.isArray(config.ssr.noExternal)) {
      config.ssr.noExternal = config.ssr.noExternal.filter(
        (dep) => dep !== "better-sqlite3"
      );
    }

    return config;
  },
};
export default config;
