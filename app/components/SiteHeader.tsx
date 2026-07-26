"use client";

import { TRDrawer } from "@tinyrack/ui/components/drawer";
import { TRIconButton } from "@tinyrack/ui/components/icon-button";
import { TRLink } from "@tinyrack/ui/components/link";
import { TRSeparator } from "@tinyrack/ui/components/separator";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { t } from "@/i18n/index.ts";
import { getAlternativeLanguageLinks } from "@/lib/alternative-language-links.ts";
import { getAllArticles, getAllPages } from "@/lib/content.ts";
import { LOCALE_INFO, SUPPORTED_LANGUAGE_CODES } from "@/lib/language.ts";
import { getBlogPath, getContentPath, getHomePath } from "@/lib/routes.ts";
import { PRODUCT_LINKS, SOCIAL_LINKS } from "@/lib/site-links.ts";
import { getLanguageSwitchPath, resolveSitePage } from "@/lib/site-page.ts";
import { type LanguageLink, LanguageSelect } from "./LanguageSelect.tsx";
import { ThemeSwitcher } from "./ThemeSwitcher.tsx";

export function SiteHeader() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const page = resolveSitePage(location.pathname);
  const lang = page.lang;

  // Close the drawer on navigation so a link tap does not leave it hanging open.
  // biome-ignore lint/correctness/useExhaustiveDependencies: the pathname is the trigger, not a value read here.
  useEffect(() => setOpen(false), [location.pathname]);

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
      href: alt?.href ?? getLanguageSwitchPath(location.pathname, code),
      label: LOCALE_INFO[code],
    };
  });

  const navItems = [
    { href: getBlogPath(lang), label: t(lang, "nav.blog") },
    { href: getContentPath(lang, "about"), label: t(lang, "nav.about") },
  ];

  const isActive = (href: string) =>
    href === getBlogPath(lang)
      ? page.kind === "blog" || page.kind === "tag"
      : location.pathname === href;

  return (
    <header className="sticky top-0 z-tinyrack-dropdown border-b border-tinyrack-border bg-tinyrack-canvas/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-content items-center gap-tinyrack-lg px-tinyrack-lg">
        <Link
          className="text-tinyrack-lg font-bold text-tinyrack-text no-underline"
          to={getHomePath(lang)}
        >
          {t(lang, "nav.site")}
        </Link>

        <nav
          aria-label={t(lang, "nav.site")}
          className="hidden flex-1 items-center gap-tinyrack-lg md:flex"
        >
          {navItems.map((item) => (
            <Link
              aria-current={isActive(item.href) ? "page" : undefined}
              className="text-tinyrack-sm font-medium text-tinyrack-text-muted no-underline transition-colors hover:text-tinyrack-text aria-[current]:text-tinyrack-text"
              key={item.href}
              to={item.href}
            >
              {item.label}
            </Link>
          ))}
          {PRODUCT_LINKS.map((item) => (
            <TRLink
              className="text-tinyrack-sm font-medium"
              href={item.href}
              key={item.href}
              rel="noopener noreferrer"
              target="_blank"
              variant="muted"
            >
              {item.label}
            </TRLink>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-tinyrack-sm md:ms-0">
          <div className="hidden items-center gap-tinyrack-sm md:flex">
            <ThemeSwitcher lang={lang} />
            <LanguageSelect lang={lang} links={languageLinks} />
          </div>
          <TRIconButton
            appearance="ghost"
            aria-label={t(lang, "nav.menu.open")}
            className="md:hidden"
            onClick={() => setOpen(true)}
            uiSize="sm"
          >
            <Menu aria-hidden="true" />
          </TRIconButton>
        </div>
      </div>

      {/* Anchored to the trailing edge: the panel opens by swiping left. */}
      <TRDrawer.Root onOpenChange={setOpen} open={open} swipeDirection="left">
        <TRDrawer.Portal>
          <TRDrawer.Backdrop />
          <TRDrawer.Viewport>
            <TRDrawer.Popup>
              <TRDrawer.Content>
                <div className="flex items-center justify-between gap-tinyrack-md p-tinyrack-lg">
                  <TRDrawer.Title className="text-tinyrack-lg font-bold">
                    {t(lang, "nav.site")}
                  </TRDrawer.Title>
                  <TRDrawer.Close
                    render={
                      <TRIconButton
                        appearance="ghost"
                        aria-label={t(lang, "nav.menu.close")}
                        uiSize="sm"
                      >
                        <X aria-hidden="true" />
                      </TRIconButton>
                    }
                  />
                </div>
                <TRSeparator />
                <nav
                  aria-label={t(lang, "nav.site")}
                  className="flex flex-col gap-tinyrack-md p-tinyrack-lg"
                >
                  {navItems.map((item) => (
                    <Link
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className="font-medium text-tinyrack-text no-underline"
                      key={item.href}
                      onClick={() => setOpen(false)}
                      to={item.href}
                    >
                      {item.label}
                    </Link>
                  ))}

                  <p className="mt-tinyrack-md text-tinyrack-sm font-semibold text-tinyrack-text-muted">
                    {t(lang, "nav.products")}
                  </p>
                  {PRODUCT_LINKS.map((item) => (
                    <TRLink
                      href={item.href}
                      key={item.href}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {item.label}
                    </TRLink>
                  ))}

                  <p className="mt-tinyrack-md text-tinyrack-sm font-semibold text-tinyrack-text-muted">
                    {t(lang, "nav.community")}
                  </p>
                  {SOCIAL_LINKS.map((item) => (
                    <TRLink
                      href={item.href}
                      key={item.href}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {item.label}
                    </TRLink>
                  ))}
                </nav>
                <TRSeparator />
                <div className="flex flex-col gap-tinyrack-md p-tinyrack-lg">
                  <ThemeSwitcher lang={lang} />
                  <LanguageSelect
                    lang={lang}
                    links={languageLinks}
                    onNavigate={() => setOpen(false)}
                  />
                </div>
              </TRDrawer.Content>
            </TRDrawer.Popup>
          </TRDrawer.Viewport>
        </TRDrawer.Portal>
      </TRDrawer.Root>
    </header>
  );
}
