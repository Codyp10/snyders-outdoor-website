import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import sanity from '@sanity/astro';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://snydersoutdoorsolutions.com',
  output: 'static',
  trailingSlash: 'never',
  integrations: [
    // Embedded Sanity Studio at /admin (config in ./sanity.config.ts).
    // Only the /admin route ships the studio bundle; marketing pages stay static + JS-free.
    sanity({
      projectId: '1fn9gr4s',
      dataset: 'production',
      useCdn: false,
      studioBasePath: '/admin',
    }),
    react(),
    sitemap({
      // Keep utility/admin routes out of the sitemap.
      filter: (page) => !/\/(privacy|terms|admin)(\/|$)/.test(page),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    responsiveStyles: false,
  },
});
