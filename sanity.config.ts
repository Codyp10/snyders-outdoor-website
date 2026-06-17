import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { presentationTool } from 'sanity/presentation';
import { schemaTypes } from './src/sanity/schemaTypes';

// Where the Presentation tool loads the live site preview. Points at the
// server-rendered preview deployment in production; localhost for dev.
const previewOrigin = import.meta.env.PUBLIC_SANITY_PREVIEW_URL || 'http://localhost:4321';

/**
 * Sanity Studio config — embedded into the website at /admin
 * (see the sanity() integration in astro.config.mjs). This is the
 * dashboard Dustin logs into; the marketing pages stay static and JS-free.
 */
export default defineConfig({
  name: 'default',
  title: "Snyder's Outdoor Solutions",
  projectId: '1fn9gr4s',
  dataset: 'production',
  basePath: '/admin',
  plugins: [
    presentationTool({
      previewUrl: { origin: previewOrigin, preview: '/' },
    }),
    structureTool(),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
