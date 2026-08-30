import "./styles/app.css";

import { MDXProvider } from "@mdx-js/react";
import { tinyrackSemanticColors } from "@tinyrack/ui/core";
import { trShikiWebHighlighter } from "@tinyrack/ui/highlighters/shiki-web";
import { createTinyrackMdxComponents } from "@tinyrack/ui/mdx";
import {
  createTinyrackColorSchemeScript,
  TRColorSchemeProvider,
} from "@tinyrack/ui/providers/color-scheme";
import { TRCodeHighlighterProvider } from "@tinyrack/ui/providers/highlighter";
import { type ReactNode, useEffect } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import { BlogArticleFrame } from "./components/BlogArticleFrame.tsx";
import { Footer } from "./components/Footer.tsx";
import { NavigationProgress } from "./components/NavigationProgress.tsx";
import { SiteHeader } from "./components/SiteHeader.tsx";
import * as m from "./i18n/paraglide/messages.js";
import { GTM_ID, THEME_STORAGE_KEY } from "./lib/constants.ts";
import { getFontPreloadLinks } from "./lib/font-preloads.ts";
import { buildMeta, buildOrganizationJsonLd } from "./lib/seo.ts";
import { langFromPath } from "./lib/site-page.ts";

const mdxComponents = createTinyrackMdxComponents({
  components: { wrapper: BlogArticleFrame },
});

const gtmHeadScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`;
const themeScript = createTinyrackColorSchemeScript({
  storageKey: THEME_STORAGE_KEY,
});
const motionScript = 'document.documentElement.dataset.motion = "enabled";';

function getDocumentTheme() {
  if (typeof document === "undefined") {
    return "tinyrack-light";
  }

  return document.documentElement.dataset.theme === "tinyrack-dark"
    ? "tinyrack-dark"
    : "tinyrack-light";
}

function getDocumentMotion() {
  if (typeof document === "undefined") {
    return undefined;
  }

  return document.documentElement.dataset.motion === "enabled"
    ? "enabled"
    : undefined;
}

function HydrationMarker() {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.hydrated = "true";

    return () => {
      delete root.dataset.hydrated;
    };
  }, []);

  return null;
}

export function meta({ location }: { location: { pathname: string } }) {
  return buildMeta(location.pathname);
}

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const lang = langFromPath(location.pathname);

  return (
    <html
      data-motion={getDocumentMotion()}
      data-theme={getDocumentTheme()}
      lang={lang}
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        {/** biome-ignore lint/security/noDangerouslySetInnerHtml: pre-paint motion state */}
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
        {/** biome-ignore lint/security/noDangerouslySetInnerHtml: no-flash theme */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/** biome-ignore lint/security/noDangerouslySetInnerHtml: GTM bootstrap */}
        <script dangerouslySetInnerHTML={{ __html: gtmHeadScript }} />
        {/* No maximum-scale or user-scalable: blocking zoom fails WCAG 1.4.4. */}
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <link href="/sitemap.xml" rel="sitemap" />
        <link
          href="/rss.xml"
          rel="alternate"
          title={`${m.nav_site({}, { locale: lang })} RSS`}
          type="application/rss+xml"
        />
        {/* The app icon is a dark tile with a light mark, so it reads on both
            tab backgrounds without needing a per-scheme variant. */}
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <link
          href="/apple-touch-icon.png"
          rel="apple-touch-icon"
          sizes="180x180"
        />
        <meta
          content={tinyrackSemanticColors.light.surface}
          media="(prefers-color-scheme: light)"
          name="theme-color"
        />
        <meta
          content={tinyrackSemanticColors.dark.surface}
          media="(prefers-color-scheme: dark)"
          name="theme-color"
        />
        <Meta />
        <Links />
        {getFontPreloadLinks(lang).map((link) => (
          <link key={link.href} {...link} />
        ))}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON.stringify output, not interpolated markup
          dangerouslySetInnerHTML={{ __html: buildOrganizationJsonLd(lang) }}
          type="application/ld+json"
        />
      </head>
      <body>
        <noscript>
          <iframe
            height="0"
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            style={{ display: "none", visibility: "hidden" }}
            title="gtm"
            width="0"
          />
        </noscript>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const location = useLocation();
  const lang = langFromPath(location.pathname);

  return (
    <TRColorSchemeProvider storageKey={THEME_STORAGE_KEY}>
      <TRCodeHighlighterProvider highlighter={trShikiWebHighlighter}>
        <HydrationMarker />
        <MDXProvider components={mdxComponents}>
          <div className="flex min-h-screen flex-col overflow-x-clip bg-tinyrack-surface text-tinyrack-text">
            <NavigationProgress />
            <SiteHeader />
            <main className="flex-1">
              <Outlet />
            </main>
            <Footer lang={lang} />
          </div>
        </MDXProvider>
      </TRCodeHighlighterProvider>
    </TRColorSchemeProvider>
  );
}
