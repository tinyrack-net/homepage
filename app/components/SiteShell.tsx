"use client";

import { TRIconButton } from "@tinyrack/ui/components/icon-button";
import { Menu } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Link, useLocation } from "react-router";
import { getAlternativeLanguageLinks } from "@/lib/alternative-language-links.ts";
import { getAllArticles, getAllPages } from "@/lib/content.ts";
import { LOCALE_INFO, SUPPORTED_LANGUAGE_CODES } from "@/lib/language.ts";
import { getEquivalentLanguagePath, getHomePath } from "@/lib/routes.ts";
import { resolveSitePage } from "@/lib/site-page.ts";
import { Footer } from "./Footer.tsx";
import { type LanguageLink, SiteSidebar } from "./SiteSidebar.tsx";

export function SiteShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const page = resolveSitePage(location.pathname);
  const lang = page.lang;

  const altLinks =
    page.kind === "content"
      ? getAlternativeLanguageLinks(page.entry, [
          ...getAllArticles(),
          ...getAllPages(),
        ])
      : [];

  const languageLinks: LanguageLink[] = SUPPORTED_LANGUAGE_CODES.map((code) => {
    const alt = altLinks.find((link) => link.lang === code);
    return {
      lang: code,
      href: alt?.href ?? getEquivalentLanguagePath(location.pathname, code),
      label: LOCALE_INFO[code],
    };
  });

  return (
    <div className="flex min-h-screen bg-tinyrack-canvas text-tinyrack-text">
      {open ? (
        <button
          aria-label="close sidebar"
          className="fixed inset-0 z-tinyrack-popover bg-tinyrack-scrim lg:hidden"
          onClick={() => setOpen(false)}
          type="button"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-tinyrack-popover transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SiteSidebar
          lang={lang}
          languageLinks={languageLinks}
          onNavigate={() => setOpen(false)}
        />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-tinyrack-dropdown flex items-center gap-tinyrack-md border-b border-tinyrack-border bg-tinyrack-canvas px-tinyrack-lg py-tinyrack-sm lg:hidden">
          <TRIconButton
            appearance="ghost"
            aria-label="open sidebar"
            onClick={() => setOpen(true)}
            uiSize="sm"
          >
            <Menu aria-hidden="true" size={20} />
          </TRIconButton>
          <Link
            className="text-tinyrack-lg font-bold text-tinyrack-text no-underline"
            to={getHomePath(lang)}
          >
            Tinyrack
          </Link>
        </header>
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
