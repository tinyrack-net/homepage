import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

const defaultLocale = "en";
const locales = {
  en: "en-US",
  ko: "ko-KR",
};

// https://astro.build/config
export default defineConfig({
  site: "https://winetree94.com",
  i18n: {
    defaultLocale,
    locales: Object.keys(locales),
    routing: {
      redirectToDefaultLocale: false,
      prefixDefaultLocale: true,
    },
  },
  server: {
    host: true,
    port: 7432,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      i18n: {
        locales: locales,
        defaultLocale: defaultLocale,
      },
    }),
  ],
});
