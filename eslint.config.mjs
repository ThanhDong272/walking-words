import { fixupPluginRules, includeIgnoreFile } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import _import from "eslint-plugin-import";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});
const gitignorePath = path.resolve(__dirname, ".gitignore");

export default [
  {
    ignores: [
      "**/orval.config.ts",
      "src/api/generated",
      "src/api/contexts",
      "node_modules/*",
      "**/scripts",
      "**/metro.config.js",
      "src/assets/*",
      "*.props.ts",
    ],
  },
  includeIgnoreFile(gitignorePath),
  ...compat.extends(
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "eslint:recommended",
    "prettier",
  ),
  {
    plugins: {
      react,
      "@typescript-eslint": typescriptEslint,
      "react-hooks": fixupPluginRules(reactHooks),
      "simple-import-sort": simpleImportSort,
      import: fixupPluginRules(_import),
    },

    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },

      react: {
        version: "detect",
      },
    },

    rules: {
      "@typescript-eslint/ban-ts-ignore": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/consistent-type-imports": [1],
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-shadow": [1],
      "@typescript-eslint/no-unused-vars": [
        "off",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-use-before-define": [1],

      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",

      "react/jsx-props-no-spreading": "off",
      "react/require-default-props": "off",
      "react/display-name": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^react", "^@?\\w"],
            ["^(@components)(/.*|$)", "^(@views)(/.*|$)", "^(@locales)(/.*|$)"],
            [
              "^(@generated)(/.*|$)",
              "^(@hooks)(/.*|$)",
              "^(@utils)(/.*|$)",
              "^(@services)(/.*|$)",
              "^(@constants)(/.*|$)",
            ],
            ["^\\u0000"],
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            [
              "^(@assets)(/.*|$)",
              "^(@theme)(/.*|$)",
              "^(@images)",
              "^(@videos)",
              "^(@svgs)",
            ],
          ],
        },
      ],
      //use typescript-eslint/no-unused vars by default
      "no-unused-vars": "off",
      "sort-keys": "off",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js"],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
        __DEV__: true,
        NodeJS: true,
        JSX: true,
        React: true,
        Form: true,
        Layout: true,
        Navigation: true,
        AppIcon: true,
        StorageKey: true,
      },
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
];
