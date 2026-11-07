// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkDirective from 'remark-directive';
import remarkImageGrid from './src/components/mdrenders/remark-image-grid.mjs';

// https://astro.build/config
export default defineConfig({
  // RSS 源需要绝对地址，改域名时同步 src/data/site.ts 的 url。
  site: 'https://story.sanxiaoxing.cn',
  markdown: {
    processor: unified({
      remarkPlugins: [remarkDirective, remarkImageGrid],
    }),
  },
});
