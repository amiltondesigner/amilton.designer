// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://amiltondesigner.com',
  integrations: [
    preact(),
    mdx(),
    sitemap({
      // páginas de trabalho local ficam fora do índice
      filter: (page) => !page.includes('/dev/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
