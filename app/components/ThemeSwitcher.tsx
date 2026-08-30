"use client";

import { TRIconButton } from "@tinyrack/ui/components/icon-button";
import {
  type TinyrackColorSchemePreference,
  useTinyrackColorScheme,
} from "@tinyrack/ui/providers/color-scheme";
import { type LucideIcon, Monitor, Moon, Sun } from "lucide-react";
import * as m from "@/i18n/paraglide/messages.js";
import type { SupportedLanguageCodes } from "@/lib/language.ts";

const ICONS: Record<TinyrackColorSchemePreference, LucideIcon> = {
  auto: Monitor,
  light: Sun,
  dark: Moon,
};

const THEME_LABEL_MESSAGES = {
  auto: m.theme_auto,
  light: m.theme_light,
  dark: m.theme_dark,
} as const satisfies Record<TinyrackColorSchemePreference, typeof m.theme_auto>;

const NEXT_PREFERENCE: Record<
  TinyrackColorSchemePreference,
  TinyrackColorSchemePreference
> = {
  auto: "light",
  light: "dark",
  dark: "auto",
};

export function ThemeSwitcher({ lang }: { lang: SupportedLanguageCodes }) {
  const { preference, setPreference } = useTinyrackColorScheme();
  const nextPreference = NEXT_PREFERENCE[preference];
  const Icon = ICONS[preference];

  return (
    <TRIconButton
      appearance="ghost"
      aria-label={m.theme_switch(
        {
          current: THEME_LABEL_MESSAGES[preference]({}, { locale: lang }),
          next: THEME_LABEL_MESSAGES[nextPreference]({}, { locale: lang }),
        },
        { locale: lang },
      )}
      onClick={() => setPreference(nextPreference)}
      uiSize="md"
    >
      <Icon aria-hidden="true" size={16} />
    </TRIconButton>
  );
}
