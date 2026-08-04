import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import sanity from '@sanity/astro';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// Visual-editing PREVIEW build (server-rendered drafts) vs. the normal build.
// Production leaves this flag unset → no adapter, pages prerender → pure static.
// Only the dedicated preview deployment sets it true → SSR drafts for the Studio.
const visualEditing = process.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === 'true';

export default defineConfig({
  site: 'https://snydersoutdoorsolutions.com',
  output: 'static',
  trailingSlash: 'never',
  adapter: visualEditing ? vercel() : undefined,
  integrations: [
    // Embedded Sanity Studio at /admin (config in ./sanity.config.ts).
    // Only the /admin route ships the studio bundle; marketing pages stay static + JS-free.
    sanity({
      projectId: '1fn9gr4s',
      dataset: 'production',
      useCdn: false,
      studioBasePath: '/admin',
      stega: { studioUrl: '/admin' },
    }),
    react(),
    sitemap({
      // Keep utility/admin routes out of the sitemap.
      // outdoor-services is hidden until Phase 2 (see README → "Built but hidden").
      filter: (page) => !/\/(privacy|terms|admin|outdoor-services)(\/|$)/.test(page),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    responsiveStyles: false,
  },
});
