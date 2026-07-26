import {
  getSiteImage,
  LINKS,
  SITE,
  SITE_DESCRIPTIONS,
  SITE_TITLES,
} from "./constants.ts";
import { getAllTags } from "./content.ts";
import type { SupportedLanguageCodes } from "./language.ts";
import { resolveSitePage } from "./site-page.ts";

type MetaDescriptor =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string }
  | { tagName: "link"; rel: string; href: string };

function tagInfo(slug: string, lang: SupportedLanguageCodes) {
  const tag = getAllTags().find((entry) => entry.slug === slug);
  const title = tag?.translations[lang]?.title || tag?.name || slug;
  const description =
    tag?.translations[lang]?.description || SITE_DESCRIPTIONS[lang];
  return { title, description };
}

/**
 * Organization data so search engines can associate the logo with the site.
 * The logo URL must be absolute, and it points at the Latin lockup because
 * structured data has no locale dimension.
 */
export function buildOrganizationJsonLd(lang: SupportedLanguageCodes): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    description: SITE_DESCRIPTIONS[lang],
    logo: `${SITE}/brand/tinyrack-lockup.svg`,
    name: SITE_TITLES.en,
    sameAs: [LINKS.GITHUB, LINKS.YOUTUBE, LINKS.FORUM],
    url: SITE,
  });
}

export function buildMeta(pathname: string): MetaDescriptor[] {
  const page = resolveSitePage(pathname);
  const lang = page.lang;
  const canonical = `${SITE}${pathname.endsWith("/") ? pathname : `${pathname}/`}`;

  let title = SITE_TITLES[lang];
  let description = SITE_DESCRIPTIONS[lang];
  let ogImage = getSiteImage(lang);

  if (page.kind === "content") {
    title = page.entry.data.title;
    description = page.entry.data.excerpt || SITE_DESCRIPTIONS[lang];
    ogImage = page.entry.data.featureImage ?? getSiteImage(lang);
  } else if (page.kind === "tag") {
    const info = tagInfo(page.tagSlug, lang);
    title = `${info.title} - ${SITE_TITLES[lang]}`;
    description = info.description;
  }

  const ogImageUrl = ogImage.startsWith("http") ? ogImage : `${SITE}${ogImage}`;

  return [
    { title },
    { name: "title", content: title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: canonical },
    { property: "og:type", content: "website" },
    { property: "og:url", content: canonical },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: ogImageUrl },
    { property: "twitter:card", content: "summary_large_image" },
    { property: "twitter:url", content: canonical },
    { property: "twitter:title", content: title },
    { property: "twitter:description", content: description },
    { property: "twitter:image", content: ogImageUrl },
  ];
}
