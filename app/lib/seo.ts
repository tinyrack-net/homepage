import { createSiteMeta } from "@tinyrack/docs/site";
import * as m from "../i18n/paraglide/messages.js";
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
    tag?.translations[lang]?.description ||
    m.site_description({}, { locale: lang });
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
    description: m.site_description({}, { locale: lang }),
    logo: `${SITE}/brand/tinyrack-lockup.svg`,
    name: m.nav_site({}, { locale: "en" }),
    sameAs: [LINKS.GITHUB, LINKS.YOUTUBE, LINKS.FORUM],
    url: SITE,
  });
}

export function buildMeta(pathname: string) {
  const page = resolveSitePage(pathname);
  const lang = page.lang;
  const messageOptions = { locale: lang } as const;
  const canonical = absoluteSiteUrl(
    pathname.endsWith("/") ? pathname : `${pathname}/`,
  );

  let title: string = m.nav_site({}, messageOptions);
  let description: string = m.site_description({}, messageOptions);
  let ogImage = getSiteImage(lang);
  let type: "article" | "website" = "website";
  let publishedAt: string | undefined;

  if (page.kind === "content") {
    title = page.entry.data.title;
    description =
      page.entry.data.excerpt || m.site_description({}, messageOptions);
    ogImage = page.entry.data.featureImage ?? getSiteImage(lang);
    if (page.entry.collection === "articles") {
      type = "article";
      publishedAt = page.entry.data.publishedAt;
    }
  } else if (page.kind === "tag") {
    const info = tagInfo(page.tagSlug, lang);
    title = `${info.title} - ${m.nav_site({}, messageOptions)}`;
    description = info.description;
  } else if (page.kind === "openSource") {
    title = m.open_source_meta_title(
      { site: m.nav_site({}, messageOptions) },
      messageOptions,
    );
    description = m.open_source_meta_description({}, messageOptions);
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
