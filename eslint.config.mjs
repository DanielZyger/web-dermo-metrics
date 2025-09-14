import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: [
      "next/core-web-vitals",
      "next/typescript",
      "plugin:prettier/recommended", // 🔥 integra prettier
    ],
    rules: {
      indent: "off",

      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "space-before-blocks": ["error", "always"],
      "keyword-spacing": ["error", { before: true, after: true }],
      "comma-spacing": ["error", { before: false, after: true }],
      "semi-spacing": ["error", { before: false, after: true }],
    },
  }),
];

export default eslintConfig;
