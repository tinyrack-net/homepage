import { describe, expect, it } from "vitest";
import {
  getViewerScale,
  MAX_ZOOM_LEVEL,
  MIN_ZOOM_LEVEL,
  setupResumeViewer,
} from "./resume-viewer";

function mountResumeViewerDom() {
  document.body.innerHTML = `
    <button id="fullscreen-btn" type="button"></button>
    <button id="zoom-in-btn" type="button"></button>
    <button id="zoom-out-btn" type="button"></button>
    <main id="viewer-root" style="visibility: hidden; --scaling-factor: 1;"></main>
    <div id="zoom-container"></div>
  `;

  const zoomContainer = document.querySelector(
    "#zoom-container",
  ) as HTMLDivElement;
  Object.defineProperty(document.body, "offsetWidth", {
    configurable: true,
    value: 200,
  });
  Object.defineProperty(zoomContainer, "offsetWidth", {
    configurable: true,
    value: 400,
  });
  Object.defineProperty(zoomContainer, "offsetHeight", {
    configurable: true,
    value: 600,
  });

  return {
    viewerRoot: document.querySelector("#viewer-root") as HTMLElement,
    fullscreenButton: document.querySelector(
      "#fullscreen-btn",
    ) as HTMLButtonElement,
    zoomInButton: document.querySelector("#zoom-in-btn") as HTMLButtonElement,
    zoomOutButton: document.querySelector("#zoom-out-btn") as HTMLButtonElement,
  };
}

describe("setupResumeViewer", () => {
  it("initializes the viewer with screen-matched scale and button states", () => {
    const { viewerRoot, fullscreenButton, zoomOutButton } =
      mountResumeViewerDom();

    const cleanup = setupResumeViewer();

    expect(getViewerScale(viewerRoot, window)).toBe(0.5);
    expect(viewerRoot.style.visibility).toBe("visible");
    expect(fullscreenButton.disabled).toBe(true);
    expect(zoomOutButton.disabled).toBe(false);
    cleanup();
  });

  it("updates scale via buttons and ctrl-wheel shortcuts", () => {
    const { viewerRoot, zoomInButton, zoomOutButton } = mountResumeViewerDom();

    const cleanup = setupResumeViewer();

    zoomOutButton.click();
    expect(getViewerScale(viewerRoot, window)).toBe(0.4);

    zoomInButton.click();
    expect(getViewerScale(viewerRoot, window)).toBe(0.5);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Control" }));
    window.dispatchEvent(
      new WheelEvent("wheel", { deltaY: -10, cancelable: true }),
    );
    window.dispatchEvent(new KeyboardEvent("keyup", { key: "Control" }));

    expect(getViewerScale(viewerRoot, window)).toBe(0.6);
    cleanup();
  });

  it("respects min and max zoom bounds", () => {
    const { viewerRoot, zoomInButton, zoomOutButton } = mountResumeViewerDom();

    const cleanup = setupResumeViewer();

    while (!zoomOutButton.disabled) {
      zoomOutButton.click();
    }

    expect(getViewerScale(viewerRoot, window)).toBe(MIN_ZOOM_LEVEL);

    while (!zoomInButton.disabled) {
      zoomInButton.click();
    }

    expect(getViewerScale(viewerRoot, window)).toBe(MAX_ZOOM_LEVEL);
    cleanup();
  });
});
