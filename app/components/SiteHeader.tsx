"use client";

import { TRButton } from "@tinyrack/ui/components/button";
import { TRDrawer } from "@tinyrack/ui/components/drawer";
import { TRIconButton } from "@tinyrack/ui/components/icon-button";
import { TRLink } from "@tinyrack/ui/components/link";
import { TRSeparator } from "@tinyrack/ui/components/separator";
import {
  TRTreeNav,
  type TRTreeNavItem,
} from "@tinyrack/ui/components/tree-nav";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { t } from "@/i18n/index.ts";
import { getAlternativeLanguageLinks } from "@/lib/alternative-language-links.ts";
import { getAllArticles, getAllPages } from "@/lib/content.ts";
import { LOCALE_INFO, SUPPORTED_LANGUAGE_CODES } from "@/lib/language.ts";
import {
  getBlogPath,
  getContentPath,
  getHomePath,
  getOpenSourcePath,
  getProductsPath,
} from "@/lib/routes.ts";
import { PRODUCT_LINKS, SOCIAL_LINKS } from "@/lib/site-links.ts";
import { getLanguageSwitchPath, resolveSitePage } from "@/lib/site-page.ts";
import { BrandLockup } from "./BrandLockup.tsx";
import { type LanguageLink, LanguageSelect } from "./LanguageSelect.tsx";
import { RouterLink } from "./RouterLink.tsx";
import { ThemeSwitcher } from "./ThemeSwitcher.tsx";

type DrawerNavLeaf = {
  active?: boolean;
  external?: boolean;
  href: string;
  label: string;
};

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

  // About leads, then Products (its overview page is still a coming-soon
  // placeholder), then what ships today: Open Source and the blog.
  const navItems = [
    { href: getContentPath(lang, "about"), label: t(lang, "nav.about") },
    { href: getProductsPath(lang), label: t(lang, "nav.products") },
    { href: getOpenSourcePath(lang), label: t(lang, "nav.openSource") },
    { href: getBlogPath(lang), label: t(lang, "nav.blog") },
  ];

  const isActive = (href: string) =>
    href === getBlogPath(lang)
      ? page.kind === "blog" || page.kind === "tag"
      : location.pathname === href;

  const drawerNavItems: readonly TRTreeNavItem<DrawerNavLeaf>[] = [
    {
      activeBranch: navItems.some((item) => isActive(item.href)),
      children: navItems.map((item) => ({
        data: { ...item, active: isActive(item.href) },
        key: item.href,
        type: "leaf" as const,
      })),
      key: "site",
      label: t(lang, "nav.site"),
      type: "group",
    },
    {
      children: PRODUCT_LINKS.map((item) => ({
        data: { ...item, external: true },
        key: item.href,
        type: "leaf" as const,
      })),
      key: "products",
      label: t(lang, "nav.products"),
      type: "group",
    },
    {
      children: SOCIAL_LINKS.map((item) => ({
        data: { ...item, external: true },
        key: item.href,
        type: "leaf" as const,
      })),
      key: "community",
      label: t(lang, "nav.community"),
      type: "group",
    },
  ];

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
          aria-label={t(lang, "nav.site")}
          className="hidden items-center gap-tinyrack-lg md:flex"
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

        <TRIconButton
          appearance="ghost"
          aria-label={t(lang, "nav.menu.open")}
          className="ms-auto md:hidden"
          onClick={() => setOpen(true)}
          uiSize="sm"
        >
          <Menu aria-hidden="true" />
        </TRIconButton>
        <div
          className="ms-auto hidden items-center gap-tinyrack-md md:flex"
          data-desktop-header-utilities
        >
          <ThemeSwitcher lang={lang} />
          <LanguageSelect lang={lang} links={languageLinks} />
          <TRButton
            appearance="ghost"
            aria-label={t(lang, "nav.menu.open")}
            onClick={() => setOpen(true)}
            uiSize="sm"
          >
            <Menu aria-hidden="true" />
            {t(lang, "nav.menu.label")}
          </TRButton>
        </div>
      </div>

      {/* Anchored to the trailing edge, under the button that opens it — the
          panel is dismissed by swiping back out the way it came. */}
      <TRDrawer.Root onOpenChange={setOpen} open={open} swipeDirection="right">
        <TRDrawer.Portal>
          <TRDrawer.Backdrop />
          <TRDrawer.Viewport>
            <TRDrawer.Popup className="site-nav-drawer">
              <TRDrawer.Content>
                <div className="flex items-center justify-between gap-tinyrack-md">
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
                <TRTreeNav<DrawerNavLeaf>
                  className="site-nav-tree"
                  data-site-nav-tree
                  defaultGroupsOpen
                  items={drawerNavItems}
                  label={t(lang, "nav.site")}
                  renderLeaf={({ data: item }) =>
                    item.external ? (
                      <TRLink
                        className="site-nav-tree-link"
                        href={item.href}
                        rel="noopener noreferrer"
                        target="_blank"
                        underline="none"
                      >
                        <span>{item.label}</span>
                      </TRLink>
                    ) : (
                      <RouterLink
                        aria-current={item.active ? "page" : undefined}
                        className="site-nav-tree-link"
                        data-active={item.active || undefined}
                        onClick={() => setOpen(false)}
                        to={item.href}
                        underline="none"
                      >
                        <span>{item.label}</span>
                      </RouterLink>
                    )
                  }
                />
                <TRSeparator />
                <div className="flex flex-col gap-tinyrack-lg md:hidden">
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
