import { describe, expect, it } from "vitest";
import {
  clampScale,
  getNextScale,
  getScreenMatchedScale,
  getWheelScaleDelta,
  MAX_ZOOM_LEVEL,
  MIN_ZOOM_LEVEL,
  shouldTrackZoomModifierKey,
  ZOOM_STEP,
} from "./resume-viewer";

describe("resume viewer helpers", () => {
  it("clamps scale to the supported min and max", () => {
    expect(clampScale(MIN_ZOOM_LEVEL - 1)).toBe(MIN_ZOOM_LEVEL);
    expect(clampScale(MAX_ZOOM_LEVEL + 1)).toBe(MAX_ZOOM_LEVEL);
    expect(clampScale(0.5)).toBe(0.5);
  });

  it("calculates screen-matched scale within bounds", () => {
    expect(getScreenMatchedScale(100, 400)).toBe(MIN_ZOOM_LEVEL);
    expect(getScreenMatchedScale(400, 400)).toBe(MAX_ZOOM_LEVEL);
    expect(getScreenMatchedScale(200, 400)).toBe(0.5);
  });

  it("moves scale up and down by one zoom step", () => {
    expect(getNextScale(0.5, ZOOM_STEP)).toBe(0.6);
    expect(getNextScale(0.5, -ZOOM_STEP)).toBe(0.4);
  });

  it("derives wheel zoom direction from deltaY", () => {
    expect(getWheelScaleDelta(1)).toBe(-ZOOM_STEP);
    expect(getWheelScaleDelta(-1)).toBe(ZOOM_STEP);
  });

  it("tracks only control and meta keys for zoom modifiers", () => {
    expect(shouldTrackZoomModifierKey("Control")).toBe(true);
    expect(shouldTrackZoomModifierKey("Meta")).toBe(true);
    expect(shouldTrackZoomModifierKey("Shift")).toBe(false);
  });
});
