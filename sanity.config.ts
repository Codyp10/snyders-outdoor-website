import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './src/sanity/schemaTypes';

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
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
