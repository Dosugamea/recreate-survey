import type { StorybookConfig } from "@storybook/nextjs-vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: [
    "../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/features/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
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
    // Helper to resolve mock paths
    const getMockPath = (filename: string) =>
      path.resolve(__dirname, "./mocks", filename);

    // Define aliases using an array format for better control and priority.
    // We use RegExp for local files to match any path ending with the target filename,
    // ensuring we catch relative, absolute, and aliased imports.
    const aliases = [
      // 1. Critical Libraries that fail in browser
      {
        find: "next-auth/providers/credentials",
        replacement: getMockPath("next-auth-providers-credentials.ts"),
      },
      {
        find: "next-auth",
        replacement: getMockPath("next-auth.ts"),
      },
      {
        find: "bcryptjs",
        replacement: getMockPath("bcryptjs.ts"),
      },

      // 2. Local Project Files (Force Mocking)
      // Catch any import ending in lib/auth/auth.ts (or .js/tsx etc implicitly)
      // This prevents the real src/lib/auth/auth.ts from loading.
      {
        find: /.*\/lib\/auth\/auth(\.ts)?$/,
        replacement: getMockPath("auth.ts"),
      },
      // Catch explicit alias usage for auth
      { find: "@/lib/auth/auth", replacement: getMockPath("auth.ts") },

      // Catch any import ending in lib/prisma.ts
      {
        find: /.*\/lib\/prisma(\.ts)?$/,
        replacement: getMockPath("prisma.ts"),
      },
      // Catch explicit alias usage for prisma
      { find: "@/lib/prisma", replacement: getMockPath("prisma.ts") },

      // 3. Next.js modules
      {
        find: "next/navigation",
        replacement: getMockPath("next-navigation.ts"),
      },
      { find: "next/cache", replacement: getMockPath("next-cache.ts") },

      // 4. Prisma Packages
      {
        find: "@prisma/adapter-better-sqlite3",
        replacement: getMockPath("adapter-better-sqlite3.ts"),
      },
      {
        find: "@prisma/client",
        replacement: getMockPath("prisma-client.ts"),
      },
      {
        find: ".prisma/client",
        replacement: getMockPath("prisma-client.ts"),
      },
    ];

    // Merge with existing aliases, placing our overrides FIRST
    config.resolve = config.resolve || {};
    let existingAliases: unknown[] = [];
    if (Array.isArray(config.resolve.alias)) {
      existingAliases = config.resolve.alias;
    } else if (config.resolve.alias) {
      existingAliases = Object.entries(config.resolve.alias).map(
        ([find, replacement]) => ({ find, replacement })
      );
    }
    // @ts-expect-error: existingAliases is unknown[], which mismatches the strict Alias type expected by Vite, but we know it's valid from extraction above.
    config.resolve.alias = [...aliases, ...existingAliases];

    // Exclude problematic dependencies from optimization
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.exclude = [
      ...(config.optimizeDeps.exclude || []),
      "better-sqlite3",
      "@prisma/client",
      ".prisma/client",
    ];

    // Handle SSR externals
    config.ssr = config.ssr || {};
    const externals = ["better-sqlite3", "@prisma/client", ".prisma/client"];
    if (Array.isArray(config.ssr.external)) {
      config.ssr.external = [...config.ssr.external, ...externals];
    } else {
      config.ssr.external = externals;
    }

    return config;
  },
};
export default config;
