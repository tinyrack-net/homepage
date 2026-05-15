import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://tinyrack.net",
  server: {
    host: true,
    port: 8432,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
});
