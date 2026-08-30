import type {
  SiteFeedDescriptor,
  SitePageDescriptor,
  SiteSeoConfig,
} from "@tinyrack/docs/site";
import type { RoutePlanEntry } from "../content/routes-plan.ts";
import { planRoutes } from "../content/routes-plan.ts";
import * as m from "../i18n/paraglide/messages.js";
import { getSiteImage, SITE } from "./constants.ts";
import type { BlogManifest, ContentEntry } from "./content-types.ts";
import { defaultLangCode, type SupportedLanguageCodes } from "./language.ts";

const OPEN_GRAPH_LOCALES: Record<SupportedLanguageCodes, string> = {
  en: "en_US",
  ja: "ja_JP",
  ko: "ko_KR",
};

export const siteSeoConfig: SiteSeoConfig = {
  description: m.site_description({}, { locale: defaultLangCode }),
  image: { url: `${SITE}${getSiteImage(defaultLangCode)}` },
  locale: {
    language: defaultLangCode,
    openGraph: OPEN_GRAPH_LOCALES[defaultLangCode],
  },
  title: m.nav_site({}, { locale: defaultLangCode }),
  url: SITE,
};

export function siteLocale(lang: SupportedLanguageCodes) {
  return { language: lang, openGraph: OPEN_GRAPH_LOCALES[lang] };
}

export function absoluteSiteUrl(path: string): string {
  return new URL(path, `${SITE}/`).toString();
}

function contentForRoute(
  route: RoutePlanEntry,
  manifest: BlogManifest,
): ContentEntry | undefined {
  if (route.kind !== "content") {
    return undefined;
  }
  return [...manifest.articles, ...manifest.pages].find(
    (entry) => entry.routeFile === route.routeFile,
  );
}

function equivalentRouteKey(
  route: RoutePlanEntry,
  manifest: BlogManifest,
): string {
  if (route.kind === "content") {
    return `content:${contentForRoute(route, manifest)?.data.translationKey ?? route.id}`;
  }
  if (route.kind === "tag") {
    return `tag:${route.tagSlug}:${route.page ?? 1}`;
  }
  if (route.kind === "blog") {
    return `blog:${route.page ?? 1}`;
  }
  if (route.kind === "openSource") {
    return "open-source";
  }
  return "home";
}

function routeTitleAndDescription(
  route: RoutePlanEntry,
  manifest: BlogManifest,
) {
  const content = contentForRoute(route, manifest);
  if (content) {
    return {
      description:
        content.data.excerpt || m.site_description({}, { locale: route.lang }),
      title: content.data.title,
    };
  }

  if (route.kind === "tag") {
    const tag = manifest.tags.find((entry) => entry.slug === route.tagSlug);
    const translation = tag?.translations[route.lang];
    return {
      description:
        translation?.description ??
        m.site_description({}, { locale: route.lang }),
      title: `${translation?.title ?? tag?.name ?? route.tagSlug} - ${m.nav_site({}, { locale: route.lang })}`,
    };
  }

  if (route.kind === "openSource") {
    const messageOptions = { locale: route.lang } as const;
    return {
      description: m.open_source_meta_description({}, messageOptions),
      title: m.open_source_meta_title(
        { site: m.nav_site({}, messageOptions) },
        messageOptions,
      ),
    };
  }

  return {
    description: m.site_description({}, { locale: route.lang }),
    title: m.nav_site({}, { locale: route.lang }),
  };
}

export function createHomepagePageDescriptors(
  manifest: BlogManifest,
): SitePageDescriptor[] {
  const routes = planRoutes(manifest);
  return routes.map((route) => {
    const content = contentForRoute(route, manifest);
    const { description, title } = routeTitleAndDescription(route, manifest);
    const imagePath = content?.data.featureImage ?? getSiteImage(route.lang);
    const equivalentKey = equivalentRouteKey(route, manifest);
    const alternates = routes
      .filter(
        (candidate) =>
          candidate.lang !== route.lang &&
          equivalentRouteKey(candidate, manifest) === equivalentKey,
      )
      .map((candidate) => ({
        language: candidate.lang,
        locale: siteLocale(candidate.lang),
        url: absoluteSiteUrl(candidate.path),
      }));

    return {
      alternates,
      description,
      image: { url: absoluteSiteUrl(imagePath) },
      locale: siteLocale(route.lang),
      publishedAt:
        content?.collection === "articles"
          ? content.data.publishedAt
          : undefined,
      sitemap: (route.page ?? 1) === 1,
      title,
      type: content?.collection === "articles" ? "article" : "website",
      url: absoluteSiteUrl(route.path),
    };
  });
}

export function createHomepageFeed(manifest: BlogManifest): SiteFeedDescriptor {
  const items = manifest.articles
    .filter((entry) => !entry.data.draft && entry.data.lang === defaultLangCode)
    .sort(
      (left, right) =>
        new Date(right.data.publishedAt).getTime() -
        new Date(left.data.publishedAt).getTime(),
    )
    .map((entry) => ({
      description: entry.data.excerpt,
      publishedAt: entry.data.publishedAt,
      title: entry.data.title,
      url: absoluteSiteUrl(entry.path),
    }));

  return {
    description: m.site_description({}, { locale: defaultLangCode }),
    imageUrl: `${SITE}/brand/tinyrack-app-icon.svg`,
    items,
    language: defaultLangCode,
    path: "/rss.xml",
    siteUrl: `${SITE}/`,
    title: m.nav_site({}, { locale: defaultLangCode }),
  };
}
