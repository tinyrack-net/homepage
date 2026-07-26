"use client";

import { TRBadge } from "@tinyrack/ui/components/badge";
import { TRSeparator } from "@tinyrack/ui/components/separator";
import type { CSSProperties, ReactNode } from "react";
import { useLocation } from "react-router";
import { t } from "@/i18n/index.ts";
import { getAlternativeLanguageLinks } from "@/lib/alternative-language-links.ts";
import {
  getAllArticles,
  getAllPages,
  getNavigationTags,
} from "@/lib/content.ts";
import { getTagPath } from "@/lib/routes.ts";
import { resolveSitePage } from "@/lib/site-page.ts";
import { RouterLink } from "./RouterLink.tsx";
import { TextDate } from "./TextDate.tsx";

// Let the shared `.tr-mdx` body fill its parent as a plain reading column
// instead of the design-system's boxed "page" (its own width/padding/surface).
const MDX_VARS = {
  "--tr-mdx-page-width": "100%",
  "--tr-mdx-content-width": "100%",
  "--tr-mdx-page-padding-inline": "0",
  "--tr-mdx-page-padding-top": "0",
  "--tr-mdx-page-padding-bottom": "0",
} as CSSProperties;

export function BlogArticleFrame({ children }: { children?: ReactNode }) {
  const location = useLocation();
  const page = resolveSitePage(location.pathname);

  if (page.kind !== "content") {
    return (
      <div className="reading-shell py-tinyrack-3xl">
        <div className="tr-mdx" style={MDX_VARS}>
          {children}
        </div>
      </div>
    );
  }

  const entry = page.entry;
  const lang = entry.data.lang;
  const altLinks = getAlternativeLanguageLinks(entry, [
    ...getAllArticles(),
    ...getAllPages(),
  ]);
  const altAvailable = t(lang, "article.alternative-language-available");
  // `data.tags` holds slugs, and the reserved language tags are navigation
  // plumbing rather than subjects, so resolve through the navigable set.
  const articleTags =
    entry.collection === "articles"
      ? getNavigationTags().filter((tag) => entry.data.tags.includes(tag.slug))
      : [];

  return (
    <article className="reading-shell py-tinyrack-3xl">
      {entry.data.featureImage ? (
        <img
          alt={entry.data.title}
          className="mb-tinyrack-2xl aspect-video max-h-80 w-full rounded-tinyrack-lg object-cover"
          src={entry.data.featureImage}
        />
      ) : null}
      {/* Three tiers, not one flat gap: the title, then what was published and
          when, then the translations on offer. Spacing is what says they are
          three separate things — at 8px under a 36px heading they read as one
          collided block. */}
      <header>
        {/* No `text-balance`: titles are not authored per locale, and balancing
            happily splits a hyphenated compound across the two lines. */}
        <h1 className="text-tinyrack-4xl font-bold leading-tight">
          {entry.data.title}
        </h1>
        {entry.collection === "articles" ? (
          <div className="mt-tinyrack-lg flex flex-wrap items-center gap-x-tinyrack-md gap-y-tinyrack-sm">
            <TextDate date={entry.data.publishedAt} lang={lang} />
            {articleTags.map((tag) => (
              <RouterLink
                key={tag.slug}
                to={getTagPath(lang, tag.slug)}
                underline="none"
              >
                <TRBadge>
                  {tag.translations[lang]?.title || tag.name || tag.slug}
                </TRBadge>
              </RouterLink>
            ))}
          </div>
        ) : null}
        {altLinks.length > 0 ? (
          <div className="mt-tinyrack-md flex flex-wrap items-center gap-tinyrack-sm text-tinyrack-sm">
            <span className="text-tinyrack-text-muted">{altAvailable}</span>
            {altLinks.map((link) => (
              <RouterLink
                key={link.lang}
                hrefLang={link.lang}
                lang={link.lang}
                to={link.href}
                underline="none"
              >
                <TRBadge>{link.label}</TRBadge>
              </RouterLink>
            ))}
          </div>
        ) : null}
      </header>
      <TRSeparator className="my-tinyrack-2xl" />
      <div className="tr-mdx" style={MDX_VARS}>
        {children}
      </div>
    </article>
  );
}
