import { createSiteMeta } from "@tinyrack/docs/site";
import { getOpenSourceCopy } from "../content/open-source.ts";
import { getSiteDescription, getSiteTitle } from "../i18n/copy.ts";
import { getAlternativeLanguageLinks } from "./alternative-language-links.ts";
import { getSiteImage, LINKS, SITE } from "./constants.ts";
import { getAllArticles, getAllPages, getAllTags } from "./content.ts";
import {
  SUPPORTED_LANGUAGE_CODES,
  type SupportedLanguageCodes,
} from "./language.ts";
import { absoluteSiteUrl, siteLocale, siteSeoConfig } from "./site-assets.ts";
import { getLanguageSwitchPath, resolveSitePage } from "./site-page.ts";

function tagInfo(slug: string, lang: SupportedLanguageCodes) {
  const tag = getAllTags().find((entry) => entry.slug === slug);
  const title = tag?.translations[lang]?.title || tag?.name || slug;
  const description =
    tag?.translations[lang]?.description || getSiteDescription(lang);
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
    description: getSiteDescription(lang),
    logo: `${SITE}/brand/tinyrack-lockup.svg`,
    name: getSiteTitle("en"),
    sameAs: [LINKS.GITHUB, LINKS.YOUTUBE, LINKS.FORUM],
    url: SITE,
  });
}

export function buildMeta(pathname: string) {
  const page = resolveSitePage(pathname);
  const lang = page.lang;
  const canonical = absoluteSiteUrl(
    pathname.endsWith("/") ? pathname : `${pathname}/`,
  );

  let title = getSiteTitle(lang);
  let description = getSiteDescription(lang);
  let ogImage = getSiteImage(lang);
  let type: "article" | "website" = "website";
  let publishedAt: string | undefined;

  if (page.kind === "content") {
    title = page.entry.data.title;
    description = page.entry.data.excerpt || getSiteDescription(lang);
    ogImage = page.entry.data.featureImage ?? getSiteImage(lang);
    if (page.entry.collection === "articles") {
      type = "article";
      publishedAt = page.entry.data.publishedAt;
    }
  } else if (page.kind === "tag") {
    const info = tagInfo(page.tagSlug, lang);
    title = `${info.title} - ${getSiteTitle(lang)}`;
    description = info.description;
  } else if (page.kind === "openSource") {
    const openSource = getOpenSourceCopy(lang);
    title = openSource.meta.title;
    description = openSource.meta.description;
  }

  const alternates =
    page.kind === "content"
      ? getAlternativeLanguageLinks(page.entry, [
          ...getAllArticles(),
          ...getAllPages(),
        ]).map((alternate) => ({
          language: alternate.lang,
          locale: siteLocale(alternate.lang),
          url: absoluteSiteUrl(alternate.href),
        }))
      : SUPPORTED_LANGUAGE_CODES.filter((code) => code !== lang).map(
          (code) => ({
            language: code,
            locale: siteLocale(code),
            url: absoluteSiteUrl(getLanguageSwitchPath(pathname, code)),
          }),
        );

  return createSiteMeta(siteSeoConfig, {
    alternates,
    description,
    image: { url: absoluteSiteUrl(ogImage) },
    locale: siteLocale(lang),
    publishedAt,
    title,
    type,
    url: canonical,
  });
}
