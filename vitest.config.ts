import { fileURLToPath, URL } from "node:url";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const resolve = {
  alias: {
    "@": fileURLToPath(new URL("./src", import.meta.url)),
  },
};

export default defineConfig({
  resolve,
  test: {
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,js}"],
      exclude: ["src/**/*.test.ts"],
      reporter: ["text", "html", "lcov"],
    },
    projects: [
      {
        resolve,
        test: {
          name: "unit",
          environment: "node",
          setupFiles: ["./vitest.setup.ts"],
          include: ["src/**/*.test.ts", "scripts/**/*.test.mjs"],
          exclude: ["src/**/*.browser.test.ts", "tests/**"],
        },
      },
      {
        resolve,
        test: {
          name: "browser",
          setupFiles: ["./vitest.setup.ts"],
          include: ["src/**/*.browser.test.ts"],
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
