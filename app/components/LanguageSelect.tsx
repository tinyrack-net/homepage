"use client";

import { TRSelect } from "@tinyrack/ui/components/select";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router";
import { t } from "@/i18n/index.ts";
import type { SupportedLanguageCodes } from "@/lib/language.ts";

export type LanguageLink = {
  href: string;
  label: string;
  lang: SupportedLanguageCodes;
};

export type LanguageSelectProps = {
  lang: SupportedLanguageCodes;
  links: LanguageLink[];
  onNavigate?: () => void;
};

/**
 * Language switcher built on the public Select. `@tinyrack/ui` dropped
 * `TRLanguageSelect` in 0.9.0, so the part that mattered is reproduced here:
 * each option carries its own `lang` so the browser picks the matching IBM
 * Plex Sans variant instead of rendering every language in the page's font.
 */
export function LanguageSelect({
  lang,
  links,
  onNavigate,
}: LanguageSelectProps) {
  const navigate = useNavigate();
  const selected = links.find((link) => link.lang === lang);

  return (
    <TRSelect.Root
      items={links.map((link) => ({ label: link.label, value: link.lang }))}
      onValueChange={(next) => {
        const target = links.find((link) => link.lang === next);
        if (!target || target.lang === lang) {
          return;
        }
        onNavigate?.();
        navigate(target.href);
      }}
      value={lang}
    >
      <TRSelect.Trigger aria-label={t(lang, "language")} uiSize="sm">
        <TRSelect.Value>
          <span lang={selected?.lang}>{selected?.label ?? lang}</span>
        </TRSelect.Value>
        <TRSelect.Icon aria-hidden="true">
          <ChevronDown />
        </TRSelect.Icon>
      </TRSelect.Trigger>
      <TRSelect.Portal>
        <TRSelect.Positioner>
          <TRSelect.Popup>
            <TRSelect.List>
              {links.map((link) => (
                <TRSelect.Item key={link.lang} value={link.lang}>
                  <TRSelect.ItemText lang={link.lang}>
                    {link.label}
                  </TRSelect.ItemText>
                  <TRSelect.ItemIndicator aria-hidden="true">
                    ✓
                  </TRSelect.ItemIndicator>
                </TRSelect.Item>
              ))}
            </TRSelect.List>
          </TRSelect.Popup>
        </TRSelect.Positioner>
      </TRSelect.Portal>
    </TRSelect.Root>
  );
}
