import { describe, expect, it, vi } from "vitest";
import { setupTheme, THEME, THEME_KEY } from "./theme";

function installMatchMedia(initialMatches: boolean) {
  let changeListener: ((event: Event) => void) | undefined;
  const mediaQuery = {
    matches: initialMatches,
    media: "(prefers-color-scheme: dark)",
    onchange: null,
    addEventListener: vi.fn(
      (event: string, listener: (event: Event) => void) => {
        if (event === "change") {
          changeListener = listener;
        }
      },
    ),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn(() => mediaQuery),
  });

  return {
    mediaQuery,
    triggerChange(matches: boolean) {
      mediaQuery.matches = matches;
      changeListener?.(new Event("change"));
    },
  };
}

describe("setupTheme", () => {
  it("applies the stored theme immediately and on astro swaps", () => {
    installMatchMedia(false);
    window.localStorage.setItem(THEME_KEY, THEME.DARK);

    const cleanup = setupTheme();

    expect(document.documentElement.dataset.theme).toBe("black");

    window.localStorage.setItem(THEME_KEY, THEME.LIGHT);
    document.dispatchEvent(new Event("astro:after-swap"));

    expect(document.documentElement.dataset.theme).toBe("light");
    cleanup();
  });

  it("reacts to system theme changes only when auto mode is active", () => {
    const { triggerChange } = installMatchMedia(false);
    window.localStorage.setItem(THEME_KEY, THEME.AUTO);

    const cleanup = setupTheme();
    triggerChange(true);
    expect(document.documentElement.dataset.theme).toBe("black");

    window.localStorage.setItem(THEME_KEY, THEME.LIGHT);
    triggerChange(false);
    expect(document.documentElement.dataset.theme).toBe("black");
    cleanup();
  });
});
