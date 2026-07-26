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
// Products are reachable from the footer only: the header stays site navigation.
import { SOCIAL_LINKS } from "@/lib/site-links.ts";
import { getLanguageSwitchPath, resolveSitePage } from "@/lib/site-page.ts";
import { BrandLockup } from "./BrandLockup.tsx";
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

  // About first: it says what this place is, which is what a first-time
  // visitor needs before a list of posts means anything.
  const navItems = [
    { href: getContentPath(lang, "about"), label: t(lang, "nav.about") },
    { href: getBlogPath(lang), label: t(lang, "nav.blog") },
  ];

  const isActive = (href: string) =>
    href === getBlogPath(lang)
      ? page.kind === "blog" || page.kind === "tag"
      : location.pathname === href;

  return (
    <header className="sticky top-0 z-tinyrack-dropdown border-b border-tinyrack-border bg-tinyrack-canvas/95 backdrop-blur">
      <div className="page-shell flex h-16 items-center gap-tinyrack-lg">
        {/* `flex`, not the default block: a block anchor wraps the lockup in an
            inline box whose descender gap makes the artwork sit three pixels
            above the nav text beside it. */}
        <Link className="flex items-center no-underline" to={getHomePath(lang)}>
          <BrandLockup lang={lang} />
        </Link>

        <nav
          aria-label={t(lang, "nav.site")}
          className="hidden items-center gap-tinyrack-lg md:flex"
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
        </nav>

        {/* Theme and language live in the drawer at every breakpoint. They are
            settings, not navigation, and duplicating them in the bar bought a
            crowded header for two controls a reader touches once. */}
        <TRIconButton
          appearance="ghost"
          aria-label={t(lang, "nav.menu.open")}
          className="ms-auto"
          onClick={() => setOpen(true)}
          uiSize="sm"
        >
          <Menu aria-hidden="true" />
        </TRIconButton>
      </div>

      {/* Anchored to the trailing edge, under the button that opens it — the
          panel is dismissed by swiping back out the way it came. */}
      <TRDrawer.Root onOpenChange={setOpen} open={open} swipeDirection="right">
        <TRDrawer.Portal>
          <TRDrawer.Backdrop />
          <TRDrawer.Viewport>
            <TRDrawer.Popup>
              <TRDrawer.Content>
                <div className="flex items-center justify-between gap-tinyrack-md p-tinyrack-lg">
                  <TRDrawer.Title render={<span />}>
                    <BrandLockup lang={lang} />
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
                <div className="flex flex-col gap-tinyrack-lg p-tinyrack-lg">
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
