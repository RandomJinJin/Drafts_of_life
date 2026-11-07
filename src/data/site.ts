// 站点级元信息：RSS 源、页面标题与页脚共用这里的配置。
export const site = {
  title: '人间底稿',
  titleEn: 'DRAFTS OF LIFE',
  description: '按故事，也按时间阅读的小说合集。',
  language: 'zh-CN',
  author: '人间底稿编辑部',
  // 部署域名；同时用于 astro.config.mjs 的 site，RSS 的绝对链接由此生成。
  url: 'https://story.sanxiaoxing.cn',
  feedHref: '/rss.xml',
  feedTitle: '人间底稿 · 全部故事',
};
