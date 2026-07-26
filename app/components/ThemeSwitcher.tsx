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

export function ThemeSwitcher({ lang }: { lang: SupportedLanguageCodes }) {
  const { preference, setPreference } = useTinyrackColorScheme();

  const options: {
    value: TinyrackColorSchemePreference;
    label: string;
  }[] = [
    { value: "auto", label: t(lang, "theme.auto") },
    { value: "light", label: t(lang, "theme.light") },
    { value: "dark", label: t(lang, "theme.dark") },
  ];

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
            onClick={() => setPreference(value)}
            uiSize="sm"
          >
            <Icon aria-hidden="true" size={16} />
          </TRIconButton>
        );
      })}
    </div>
  );
}
