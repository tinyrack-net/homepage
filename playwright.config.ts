import { defineConfig } from "@playwright/test";

const isCI = Boolean(process.env.CI);
const workers = process.env.PLAYWRIGHT_WORKERS ?? (isCI ? "100%" : undefined);

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  failOnFlakyTests: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  workers,
  use: {
    baseURL: "http://127.0.0.1:4511",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: {
    command:
      "pnpm build:app && pnpm exec vite preview --host 127.0.0.1 --port 4511 --strictPort",
    port: 4511,
    reuseExistingServer: false,
    timeout: 180000,
  },
});
