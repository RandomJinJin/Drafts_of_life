// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkDirective from 'remark-directive';
import remarkImageGrid from './src/components/mdrenders/remark-image-grid.mjs';

// https://astro.build/config
export default defineConfig({
  markdown: {
    processor: unified({
      remarkPlugins: [remarkDirective, remarkImageGrid],
    }),
  },
});
