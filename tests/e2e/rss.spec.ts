import { expect, test } from "@playwright/test";

test("rss feed responds with XML", async ({ request }) => {
  const response = await request.get("/rss.xml");

  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("xml");
  await expect(response.text()).resolves.toContain("<rss");
});
