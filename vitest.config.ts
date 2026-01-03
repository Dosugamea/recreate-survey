import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";

import { playwright } from "@vitest/browser-playwright";

import tsconfigPaths from "vite-tsconfig-paths";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: "node",
    projects: [
      {
        test: {
          name: "unit",
          include: ["**/*.test.ts", "**/*.test.tsx"],
          exclude: [
            "**/node_modules/**",
            "**/.storybook/**",
            "**/*.stories.tsx",
          ],
          environment: "jsdom",
        },
        resolve: {
          alias: {
            "@": path.resolve(dirname, "./src"),
          },
        },
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, ".storybook") }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
        resolve: {
          alias: {
            "@/prisma": path.resolve(dirname, "./prisma"),
            "@": path.resolve(dirname, "./src"),
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(dirname, "."),
    },
  },
});
