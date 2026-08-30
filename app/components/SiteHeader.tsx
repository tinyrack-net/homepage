"use client";

import { TRDrawer } from "@tinyrack/ui/components/drawer";
import { TRIconButton } from "@tinyrack/ui/components/icon-button";
import { tinyrackBreakpoints } from "@tinyrack/ui/core";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { getLocaleLabel } from "@/i18n/copy.ts";
import * as m from "@/i18n/paraglide/messages.js";
import { getAlternativeLanguageLinks } from "@/lib/alternative-language-links.ts";
import { getAllArticles, getAllPages } from "@/lib/content.ts";
import { SUPPORTED_LANGUAGE_CODES } from "@/lib/language.ts";
import {
  getBlogPath,
  getContentPath,
  getHomePath,
  getOpenSourcePath,
  getProductsPath,
} from "@/lib/routes.ts";
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

  // A drawer opened on a narrow viewport must not survive a resize into the
  // desktop header, where the menu and sidebar do not exist.
  useEffect(() => {
    const desktop = window.matchMedia(`(min-width: ${tinyrackBreakpoints.lg})`);
    const closeOnDesktop = () => {
      if (desktop.matches) {
        setOpen(false);
      }
    };
    desktop.addEventListener("change", closeOnDesktop);
    closeOnDesktop();
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

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
      label: getLocaleLabel(code),
    };
  });

  // About leads, then Products (its overview page is still a coming-soon
  // placeholder), then what ships today: Open Source and the blog.
  const navItems = [
    {
      href: getContentPath(lang, "about"),
      label: m.nav_about({}, { locale: lang }),
    },
    {
      href: getProductsPath(lang),
      label: m.nav_products({}, { locale: lang }),
    },
    {
      href: getOpenSourcePath(lang),
      label: m.nav_open_source({}, { locale: lang }),
    },
    {
      href: getBlogPath(lang),
      label: m.nav_blog({}, { locale: lang }),
    },
  ];

  const isActive = (href: string) =>
    href === getBlogPath(lang)
      ? page.kind === "blog" || page.kind === "tag"
      : location.pathname === href;

  return (
    <header className="sticky top-0 z-tinyrack-chrome border-b-tinyrack-default border-tinyrack-border bg-tinyrack-surface/95 backdrop-blur">
      <div className="wide-shell flex items-center gap-tinyrack-lg py-tinyrack-md md:py-tinyrack-lg">
        {/* `flex`, not the default block: a block anchor wraps the lockup in an
            inline box whose descender gap makes the artwork sit three pixels
            above the nav text beside it. */}
        <Link className="flex items-center no-underline" to={getHomePath(lang)}>
          <BrandLockup lang={lang} />
        </Link>

        <nav
          aria-label={m.nav_site({}, { locale: lang })}
          className="hidden items-center gap-tinyrack-lg lg:flex"
        >
          {navItems.map((item) => (
            <Link
              aria-current={isActive(item.href) ? "page" : undefined}
              className="text-tinyrack-sm font-tinyrack-medium text-tinyrack-text-muted no-underline transition-colors hover:text-tinyrack-text aria-[current]:text-tinyrack-text"
              key={item.href}
              to={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div
          className="ms-auto flex items-center gap-tinyrack-sm lg:hidden"
          data-mobile-header-utilities
        >
          <ThemeSwitcher lang={lang} />
          <TRIconButton
            appearance="ghost"
            aria-label={m.nav_menu_open({}, { locale: lang })}
            onClick={() => setOpen(true)}
            uiSize="md"
          >
            <Menu aria-hidden="true" />
          </TRIconButton>
        </div>
        <div
          className="ms-auto hidden items-center gap-tinyrack-md lg:flex"
          data-desktop-header-utilities
        >
          <ThemeSwitcher lang={lang} />
          <LanguageSelect lang={lang} links={languageLinks} />
        </div>
      </div>

      {/* Mobile navigation follows the docs shell: a full-height drawer from
          the trailing edge with site navigation and locale selection only. */}
      <TRDrawer.Root onOpenChange={setOpen} open={open} swipeDirection="right">
        <TRDrawer.Portal>
          <TRDrawer.Backdrop />
          <TRDrawer.Viewport>
            <TRDrawer.Popup className="site-nav-drawer">
              <TRDrawer.Content className="site-nav-drawer-content">
                <div className="flex items-center justify-between gap-tinyrack-md">
                  <TRDrawer.Title render={<span />}>
                    <BrandLockup lang={lang} />
                  </TRDrawer.Title>
                  <TRDrawer.Close
                    render={
                      <TRIconButton
                        appearance="ghost"
                        aria-label={m.nav_menu_close({}, { locale: lang })}
                        uiSize="md"
                      >
                        <X aria-hidden="true" />
                      </TRIconButton>
                    }
                  />
                </div>
                <nav
                  aria-label={m.nav_site({}, { locale: lang })}
                  className="site-nav-drawer-navigation"
                  data-site-nav
                >
                  {navItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        aria-current={active ? "page" : undefined}
                        className="site-nav-drawer-link"
                        data-active={active || undefined}
                        key={item.href}
                        onClick={() => setOpen(false)}
                        to={item.href}
                      >
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
                <div className="site-nav-drawer-actions">
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
