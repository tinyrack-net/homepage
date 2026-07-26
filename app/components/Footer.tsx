import { TRLink } from "@tinyrack/ui/components/link";
import { TRSeparator } from "@tinyrack/ui/components/separator";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { t } from "@/i18n/index.ts";
import { LINKS, OWNER_NAME } from "@/lib/constants.ts";
import { getNavigationTags } from "@/lib/content.ts";
import type { SupportedLanguageCodes } from "@/lib/language.ts";
import { getBlogPath, getContentPath, getTagPath } from "@/lib/routes.ts";
import { AUTHOR_LINK, PRODUCT_LINKS, SOCIAL_LINKS } from "@/lib/site-links.ts";

const ITEM_CLASS =
  "text-tinyrack-sm text-tinyrack-text-muted no-underline hover:underline";

function Column({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="flex flex-col gap-tinyrack-sm">
      <h2 className="text-tinyrack-sm font-semibold text-tinyrack-text">
        {title}
      </h2>
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
    <footer className="mt-tinyrack-2xl border-t border-tinyrack-border">
      <div className="page-shell flex flex-col gap-tinyrack-xl py-tinyrack-2xl">
        <div className="grid gap-tinyrack-xl sm:grid-cols-2 lg:grid-cols-4">
          <Column title={t(lang, "nav.site")}>
            <li>
              <Link className={ITEM_CLASS} to={getBlogPath(lang)}>
                {t(lang, "nav.blog")}
              </Link>
            </li>
            <li>
              <Link className={ITEM_CLASS} to={getContentPath(lang, "about")}>
                {t(lang, "nav.about")}
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

          <Column title={t(lang, "nav.products")}>
            {PRODUCT_LINKS.map((link) => (
              <ExternalItem
                href={link.href}
                key={link.href}
                label={link.label}
              />
            ))}
          </Column>

          <Column title={t(lang, "nav.community")}>
            {SOCIAL_LINKS.map((link) => (
              <ExternalItem
                href={link.href}
                key={link.href}
                label={link.label}
              />
            ))}
            <ExternalItem href={AUTHOR_LINK.href} label={AUTHOR_LINK.label} />
          </Column>

          <Column title={t(lang, "nav.tags")}>
            {tags.map((tag) => (
              <li key={tag.slug}>
                <Link className={ITEM_CLASS} to={getTagPath(lang, tag.slug)}>
                  {tag.translations[lang]?.title || tag.name}
                </Link>
              </li>
            ))}
          </Column>
        </div>

        <TRSeparator />

        <div className="flex flex-col gap-tinyrack-sm text-tinyrack-sm text-tinyrack-text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} by {OWNER_NAME}
          </p>
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
