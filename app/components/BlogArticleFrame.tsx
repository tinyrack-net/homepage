"use client";

import { TRBadge } from "@tinyrack/ui/components/badge";
import { TRSeparator } from "@tinyrack/ui/components/separator";
import type { CSSProperties, ReactNode } from "react";
import { useLocation } from "react-router";
import { t } from "@/i18n/index.ts";
import { getAlternativeLanguageLinks } from "@/lib/alternative-language-links.ts";
import { getAllArticles, getAllPages } from "@/lib/content.ts";
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
      <div className="mx-auto w-full max-w-article px-tinyrack-lg py-tinyrack-2xl">
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

  return (
    <article className="mx-auto w-full max-w-article px-tinyrack-lg py-tinyrack-2xl">
      {entry.data.featureImage ? (
        <img
          alt={entry.data.title}
          className="aspect-video max-h-80 w-full rounded-tinyrack-lg object-cover"
          src={entry.data.featureImage}
        />
      ) : null}
      <header className="mt-tinyrack-xl flex flex-col gap-tinyrack-sm">
        <h1 className="text-tinyrack-4xl font-bold">{entry.data.title}</h1>
        {entry.collection === "articles" ? (
          <TextDate date={entry.data.publishedAt} lang={lang} />
        ) : null}
        {altLinks.length > 0 ? (
          <div className="mt-tinyrack-xs flex flex-wrap items-center gap-tinyrack-sm text-tinyrack-sm">
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
      <TRSeparator className="my-tinyrack-xl" />
      <div className="tr-mdx" style={MDX_VARS}>
        {children}
      </div>
    </article>
  );
}
