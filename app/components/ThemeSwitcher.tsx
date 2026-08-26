"use client";

import { TRIconButton } from "@tinyrack/ui/components/icon-button";
import {
  type TinyrackColorSchemePreference,
  useTinyrackColorScheme,
} from "@tinyrack/ui/providers/color-scheme";
import { type LucideIcon, Monitor, Moon, Sun } from "lucide-react";
import { t } from "@/i18n/index.ts";
import type { SupportedLanguageCodes } from "@/lib/language.ts";

const ICONS: Record<TinyrackColorSchemePreference, LucideIcon> = {
  auto: Monitor,
  light: Sun,
  dark: Moon,
};

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
      appearance="solid"
      aria-label={t(lang, "theme.switch", {
        current: t(lang, `theme.${preference}`),
        next: t(lang, `theme.${nextPreference}`),
      })}
      intent="primary"
      onClick={() => setPreference(nextPreference)}
      uiSize="sm"
    >
      <Icon aria-hidden="true" size={16} />
    </TRIconButton>
  );
}
