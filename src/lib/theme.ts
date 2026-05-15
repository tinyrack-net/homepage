export const THEME_KEY = "theme-preference";
export const THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";

export const THEME = {
  AUTO: "auto",
  LIGHT: "light",
  DARK: "dark",
} as const;

export type SupportedTheme = (typeof THEME)[keyof typeof THEME];
export type AppliedTheme = "light" | "black";

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
    return prefersDark ? "black" : "light";
  }

  return theme === THEME.DARK ? "black" : "light";
}

export function applyTheme(
  html: HTMLElement,
  theme: SupportedTheme,
  prefersDark: boolean,
) {
  html.dataset.theme = resolveAppliedTheme(theme, prefersDark);
}

type ThemeSetupOptions = {
  document?: Document;
  window?: Window;
};

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

  const handleAfterSwap = () => {
    syncTheme();
  };

  syncTheme();
  mediaQuery?.addEventListener("change", handleMediaChange);
  documentObject.addEventListener("astro:after-swap", handleAfterSwap);

  return () => {
    mediaQuery?.removeEventListener("change", handleMediaChange);
    documentObject.removeEventListener("astro:after-swap", handleAfterSwap);
  };
}
