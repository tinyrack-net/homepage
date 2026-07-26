"use client";

import { TRIconButton } from "@tinyrack/ui/components/icon-button";
import { type LucideIcon, Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { t } from "@/i18n/index.ts";
import type { SupportedLanguageCodes } from "@/lib/language.ts";
import {
  applyTheme,
  getThemePreference,
  type SupportedTheme,
  setThemePreference,
  setupTheme,
  THEME,
  THEME_MEDIA_QUERY,
} from "@/lib/theme.ts";

const ICONS: Record<SupportedTheme, LucideIcon> = {
  [THEME.AUTO]: Monitor,
  [THEME.LIGHT]: Sun,
  [THEME.DARK]: Moon,
};

export function ThemeSwitcher({ lang }: { lang: SupportedLanguageCodes }) {
  const [preference, setPreference] = useState<SupportedTheme>(THEME.AUTO);

  useEffect(() => {
    setPreference(getThemePreference(window.localStorage));
    return setupTheme();
  }, []);

  const options: { value: SupportedTheme; label: string }[] = [
    { value: THEME.AUTO, label: t(lang, "theme.auto") },
    { value: THEME.LIGHT, label: t(lang, "theme.light") },
    { value: THEME.DARK, label: t(lang, "theme.dark") },
  ];

  function handleSelect(value: SupportedTheme) {
    setThemePreference(window.localStorage, value);
    applyTheme(
      document.documentElement,
      value,
      window.matchMedia(THEME_MEDIA_QUERY).matches,
    );
    setPreference(value);
  }

  return (
    <div className="flex items-center gap-tinyrack-xs">
      {options.map(({ value, label }) => {
        const Icon = ICONS[value];
        const active = preference === value;
        return (
          <TRIconButton
            key={value}
            appearance={active ? "solid" : "ghost"}
            aria-label={label}
            aria-pressed={active}
            intent={active ? "primary" : "neutral"}
            onClick={() => handleSelect(value)}
            uiSize="sm"
          >
            <Icon aria-hidden="true" size={16} />
          </TRIconButton>
        );
      })}
    </div>
  );
}
