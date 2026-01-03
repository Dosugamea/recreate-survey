// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettierConfig,
  {
    plugins: {
      prettier,
      import: importPlugin,
    },
    rules: {
      "prettier/prettier": "error",
      // 相対参照を禁止し、絶対パスを強制
      "import/no-relative-packages": "error",
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../*", "./*"],
              message:
                "相対パスでのインポートは禁止されています。@/ エイリアスを使用した絶対パスでインポートしてください。",
            },
          ],
        },
      ],
    },
  },
  // Storybook configuration for story files and .storybook directory
  {
    files: ["**/*.stories.@(js|jsx|mjs|ts|tsx)", ".storybook/**/*"],
    plugins: {
      storybook,
    },
    rules: {
      ...storybook.configs.recommended.rules,
      // .storybookディレクトリ内では相対パスを許可
      "no-restricted-imports": "off",
      "import/no-relative-packages": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
