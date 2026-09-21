import { createRequire } from "node:module";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const require = createRequire(import.meta.url);

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // eslint-plugin-react works out the React version by asking ESLint for the
    // file's name through context.getFilename(), which ESLint 10 removed, so
    // "detect" crashes every run. Naming the installed version skips the ask.
    settings: { react: { version: require("react/package.json").version } },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // The starter app `aiellie init` copies. Its page imports the chat, which
    // only exists once the command has installed it into a real app.
    "packages/cli/template/**",
  ]),
]);

export default eslintConfig;
