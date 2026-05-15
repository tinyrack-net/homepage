import { describe, expect, it, vi } from "vitest";
import {
  GISCUS_ORIGIN,
  setupGiscusThemeSync,
  syncGiscusTheme,
} from "./blog-article";

function mountGiscusFrame(postMessage = vi.fn()) {
  document.body.innerHTML = '<iframe class="giscus-frame"></iframe>';
  const iframe = document.querySelector(
    "iframe.giscus-frame",
  ) as HTMLIFrameElement;

  Object.defineProperty(iframe, "contentWindow", {
    configurable: true,
    value: { postMessage },
  });

  return { iframe, postMessage };
}

describe("giscus theme sync", () => {
  it("posts the current theme to the giscus iframe", () => {
    document.documentElement.dataset.theme = "black";
    const { postMessage } = mountGiscusFrame();

    expect(syncGiscusTheme(document)).toBe(true);
    expect(postMessage).toHaveBeenCalledWith(
      {
        giscus: {
          setConfig: {
            theme: "dark",
          },
        },
      },
      GISCUS_ORIGIN,
    );
  });

  it("watches theme mutations and giscus messages", async () => {
    document.documentElement.dataset.theme = "light";
    const { postMessage } = mountGiscusFrame();

    const cleanup = setupGiscusThemeSync();

    document.documentElement.dataset.theme = "black";
    await new Promise((resolve) => window.setTimeout(resolve, 0));

    expect(postMessage).toHaveBeenCalledTimes(1);

    window.dispatchEvent(
      new MessageEvent("message", {
        origin: GISCUS_ORIGIN,
        data: { giscus: { discussion: {} } },
      }),
    );

    expect(postMessage).toHaveBeenCalledTimes(2);
    cleanup();
  });
});
