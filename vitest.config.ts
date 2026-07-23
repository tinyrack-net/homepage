import { fileURLToPath, URL } from "node:url";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const resolve = {
  alias: {
    "@": fileURLToPath(new URL("./app", import.meta.url)),
  },
};

export default defineConfig({
  resolve,
  test: {
    coverage: {
      provider: "v8",
      include: ["app/**/*.{ts,tsx}"],
      exclude: ["app/**/*.test.{ts,tsx}", "app/**/*.browser.test.{ts,tsx}"],
      reporter: ["text", "html", "lcov"],
    },
    projects: [
      {
        resolve,
        test: {
          name: "unit",
          environment: "node",
          setupFiles: ["./vitest.setup.ts"],
          include: ["app/**/*.test.ts", "scripts/**/*.test.mjs"],
          exclude: ["app/**/*.browser.test.ts", "tests/**"],
        },
      },
      {
        resolve,
        test: {
          name: "browser",
          setupFiles: ["./vitest.setup.ts"],
          include: ["app/**/*.browser.test.ts", "app/**/*.browser.test.tsx"],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
