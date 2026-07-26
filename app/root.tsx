import "./styles/app.css";

import { MDXProvider } from "@mdx-js/react";
import { createTinyrackMdxComponents } from "@tinyrack/ui/mdx";
import type { ReactNode } from "react";
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
import { SiteHeader } from "./components/SiteHeader.tsx";
import { GTM_ID } from "./lib/constants.ts";
import { getFontPreloadLinks } from "./lib/font-preloads.ts";
import { buildMeta, buildOrganizationJsonLd } from "./lib/seo.ts";
import { langFromPath } from "./lib/site-page.ts";
import { themeScript } from "./lib/theme.ts";

const mdxComponents = createTinyrackMdxComponents({
  components: { wrapper: BlogArticleFrame },
});

const gtmHeadScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`;

export function meta({ location }: { location: { pathname: string } }) {
  return buildMeta(location.pathname);
}

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const lang = langFromPath(location.pathname);

  return (
    <html data-theme="tinyrack-light" lang={lang} suppressHydrationWarning>
      <head>
        {/** biome-ignore lint/security/noDangerouslySetInnerHtml: GTM bootstrap */}
        <script dangerouslySetInnerHTML={{ __html: gtmHeadScript }} />
        <meta charSet="utf-8" />
        {/* No maximum-scale or user-scalable: blocking zoom fails WCAG 1.4.4. */}
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <link href="/sitemap.xml" rel="sitemap" />
        {/* The app icon is a dark tile with a light mark, so it reads on both
            tab backgrounds without needing a per-scheme variant. */}
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <link
          href="/apple-touch-icon.png"
          rel="apple-touch-icon"
          sizes="180x180"
        />
        <meta
          content="#fafafa"
          media="(prefers-color-scheme: light)"
          name="theme-color"
        />
        <meta
          content="#0a0a0a"
          media="(prefers-color-scheme: dark)"
          name="theme-color"
        />
        <Meta />
        <Links />
        {getFontPreloadLinks(lang).map((link) => (
          <link key={link.href} {...link} />
        ))}
        {/** biome-ignore lint/security/noDangerouslySetInnerHtml: no-flash theme */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
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
    <MDXProvider components={mdxComponents}>
      <div className="flex min-h-screen flex-col bg-tinyrack-canvas text-tinyrack-text">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer lang={lang} />
      </div>
    </MDXProvider>
  );
}
