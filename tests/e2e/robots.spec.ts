import { expect, test } from "@playwright/test";

test("robots.txt responds with plain text", async ({ request }) => {
  const response = await request.get("/robots.txt");

  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("text/plain");
  await expect(response.text()).resolves.toContain("User-agent: *");
});
