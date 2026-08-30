import { TRLink } from "@tinyrack/ui/components/link";
import { TRSeparator } from "@tinyrack/ui/components/separator";
import { TRText } from "@tinyrack/ui/components/text";
import type { ReactNode } from "react";
import { Link } from "react-router";
import * as m from "@/i18n/paraglide/messages.js";
import { LINKS } from "@/lib/constants.ts";
import { getNavigationTags } from "@/lib/content.ts";
import type { SupportedLanguageCodes } from "@/lib/language.ts";
import {
  getBlogPath,
  getContentPath,
  getOpenSourcePath,
  getTagPath,
} from "@/lib/routes.ts";
import { AUTHOR_LINK, PRODUCT_LINKS, SOCIAL_LINKS } from "@/lib/site-links.ts";

const ITEM_CLASS =
  "text-tinyrack-sm text-tinyrack-text-muted no-underline hover:underline";

function Column({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="flex flex-col gap-tinyrack-sm">
      <TRText as="h2" className="m-0" variant="bodySm" weight="medium">
        {title}
      </TRText>
      <ul className="flex flex-col gap-tinyrack-xs">{children}</ul>
    </div>
  );
}

function ExternalItem({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <TRLink
        className="text-tinyrack-sm"
        href={href}
        rel="noopener noreferrer"
        target="_blank"
        variant="muted"
      >
        {label}
      </TRLink>
    </li>
  );
}

export function Footer({ lang }: { lang: SupportedLanguageCodes }) {
  const year = new Date().getFullYear();
  const tags = getNavigationTags();

  return (
    <footer className="mt-tinyrack-2xl border-t-tinyrack-default border-tinyrack-border">
      <div className="wide-shell flex flex-col gap-tinyrack-xl py-tinyrack-2xl">
        <div className="grid gap-tinyrack-xl sm:grid-cols-2 lg:grid-cols-4">
          <Column title={m.nav_products({}, { locale: lang })}>
            {PRODUCT_LINKS.map((link) => (
              <ExternalItem
                href={link.href}
                key={link.href}
                label={link.label}
              />
            ))}
          </Column>

          <Column title={m.nav_site({}, { locale: lang })}>
            <li>
              <Link className={ITEM_CLASS} to={getOpenSourcePath(lang)}>
                {m.nav_open_source({}, { locale: lang })}
              </Link>
            </li>
            <li>
              <Link className={ITEM_CLASS} to={getBlogPath(lang)}>
                {m.nav_blog({}, { locale: lang })}
              </Link>
            </li>
            <li>
              <Link className={ITEM_CLASS} to={getContentPath(lang, "about")}>
                {m.nav_about({}, { locale: lang })}
              </Link>
            </li>
            <li>
              <TRLink
                className="text-tinyrack-sm"
                href="/rss.xml"
                variant="muted"
              >
                RSS
              </TRLink>
            </li>
          </Column>

          <Column title={m.nav_community({}, { locale: lang })}>
            {SOCIAL_LINKS.map((link) => (
              <ExternalItem
                href={link.href}
                key={link.href}
                label={link.label}
              />
            ))}
            <ExternalItem href={AUTHOR_LINK.href} label={AUTHOR_LINK.label} />
          </Column>

          <Column title={m.nav_tags({}, { locale: lang })}>
            {tags.map((tag) => (
              <li key={tag.slug}>
                <Link className={ITEM_CLASS} to={getTagPath(lang, tag.slug)}>
                  {tag.translations[lang]?.title || tag.name}
                </Link>
              </li>
            ))}
          </Column>
        </div>

        <TRSeparator className="footer-separator" />

        <div className="flex flex-col gap-tinyrack-sm text-tinyrack-sm text-tinyrack-text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0">© {year} Tinyrack</p>
          <TRLink
            className="text-tinyrack-sm"
            href={`mailto:${LINKS.EMAIL}`}
            variant="muted"
          >
            {LINKS.EMAIL}
          </TRLink>
        </div>
      </div>
    </footer>
  );
}
