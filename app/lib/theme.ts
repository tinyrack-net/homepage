export const THEME_KEY = "theme-preference";
export const THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";

export const THEME = {
  AUTO: "auto",
  LIGHT: "light",
  DARK: "dark",
} as const;

export type SupportedTheme = (typeof THEME)[keyof typeof THEME];
export type AppliedTheme = "tinyrack-light" | "tinyrack-dark";

type ThemeStorage = Pick<Storage, "getItem" | "setItem">;

export function isSupportedTheme(
  value: string | null | undefined,
): value is SupportedTheme {
  return value === THEME.AUTO || value === THEME.LIGHT || value === THEME.DARK;
}

export function getThemePreference(
  storage?: Pick<ThemeStorage, "getItem">,
): SupportedTheme {
  const value = storage?.getItem(THEME_KEY);
  return isSupportedTheme(value) ? value : THEME.AUTO;
}

export function setThemePreference(
  storage: Pick<ThemeStorage, "setItem">,
  theme: SupportedTheme,
) {
  storage.setItem(THEME_KEY, theme);
}

export function resolveAppliedTheme(
  theme: SupportedTheme,
  prefersDark: boolean,
): AppliedTheme {
  if (theme === THEME.AUTO) {
    return prefersDark ? "tinyrack-dark" : "tinyrack-light";
  }

  return theme === THEME.DARK ? "tinyrack-dark" : "tinyrack-light";
}

export function applyTheme(
  html: HTMLElement,
  theme: SupportedTheme,
  prefersDark: boolean,
) {
  const applied = resolveAppliedTheme(theme, prefersDark);
  html.dataset.theme = applied;
  html.style.colorScheme = applied === "tinyrack-dark" ? "dark" : "light";
}

type ThemeSetupOptions = {
  document?: Document;
  window?: Window;
};

/**
 * Wires the system-preference listener so an AUTO preference reacts to OS
 * changes. Unlike the previous Astro implementation there is no
 * `astro:after-swap` hook — React Router keeps `<html>` mounted across client
 * navigations, so no re-sync is needed there.
 */
export function setupTheme({
  document: documentObject = document,
  window: windowObject = window,
}: ThemeSetupOptions = {}) {
  const mediaQuery =
    typeof windowObject.matchMedia === "function"
      ? windowObject.matchMedia(THEME_MEDIA_QUERY)
      : null;

  const syncTheme = () => {
    applyTheme(
      documentObject.documentElement,
      getThemePreference(windowObject.localStorage),
      mediaQuery?.matches ?? false,
    );
  };

  const handleMediaChange = () => {
    if (getThemePreference(windowObject.localStorage) === THEME.AUTO) {
      syncTheme();
    }
  };

  syncTheme();
  mediaQuery?.addEventListener("change", handleMediaChange);

  return () => {
    mediaQuery?.removeEventListener("change", handleMediaChange);
  };
}

/**
 * Inline, render-blocking script that applies the persisted (or system)
 * theme before first paint to avoid a flash. Mirrors {@link resolveAppliedTheme}.
 */
export const themeScript = `(() => {
  try {
    var pref = localStorage.getItem(${JSON.stringify(THEME_KEY)});
    var prefersDark = window.matchMedia(${JSON.stringify(THEME_MEDIA_QUERY)}).matches;
    var applied = pref === "light" ? "tinyrack-light"
      : pref === "dark" ? "tinyrack-dark"
      : prefersDark ? "tinyrack-dark" : "tinyrack-light";
    document.documentElement.dataset.theme = applied;
    document.documentElement.style.colorScheme = applied === "tinyrack-dark" ? "dark" : "light";
  } catch (e) {}
})();`;
