// 手写 RSS 2.0 生成器：不引入额外依赖，构建期产出静态 XML。
// 仅用于本项目的纯文本摘要源，因此不生成 content:encoded 全文节点。

export interface FeedEntry {
  title: string;
  link: string;
  description: string;
  pubDate: Date;
  author: string;
  category?: string;
}

export interface FeedOptions {
  title: string;
  description: string;
  /** 对应栏目首页的绝对地址 */
  link: string;
  /** 该源自身的绝对地址，用于 atom:link 自引用 */
  feedUrl: string;
  language?: string;
  entries: FeedEntry[];
  /** 源的最后构建时间，缺省取最新一篇的发布时间 */
  lastBuildDate?: Date;
}

/** 转义 XML 文本节点与属性值，& 必须最先处理。 */
export function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** 去掉摘要里可能出现的 HTML 标签，避免描述字段被阅读器误解析。 */
function plainText(value: string): string {
  return value.replace(/<[^>]*>/g, '');
}

function rfc822(date: Date): string {
  // RFC 822 / RFC 1123：阅读器普遍依赖 toUTCString 的固定格式。
  return date.toUTCString();
}

function buildItem(entry: FeedEntry): string {
  const lines = [
    '    <item>',
    `      <title>${xmlEscape(entry.title)}</title>`,
    `      <link>${xmlEscape(entry.link)}</link>`,
    `      <guid isPermaLink="true">${xmlEscape(entry.link)}</guid>`,
    `      <pubDate>${rfc822(entry.pubDate)}</pubDate>`,
    `      <description>${xmlEscape(plainText(entry.description))}</description>`,
    `      <dc:creator>${xmlEscape(entry.author)}</dc:creator>`,
  ];
  if (entry.category) {
    lines.push(`      <category>${xmlEscape(entry.category)}</category>`);
  }
  lines.push('    </item>');
  return lines.join('\n');
}

export function buildRssFeed(options: FeedOptions): string {
  const entries = [...options.entries].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
  const lastBuildDate = options.lastBuildDate ?? entries[0]?.pubDate ?? new Date();

  const channel = [
    `    <title>${xmlEscape(options.title)}</title>`,
    `    <link>${xmlEscape(options.link)}</link>`,
    `    <description>${xmlEscape(options.description)}</description>`,
    `    <language>${xmlEscape(options.language ?? 'zh-CN')}</language>`,
    `    <lastBuildDate>${rfc822(lastBuildDate)}</lastBuildDate>`,
    '    <generator>Astro</generator>',
    '    <ttl>60</ttl>',
    `    <atom:link href="${xmlEscape(options.feedUrl)}" rel="self" type="application/rss+xml" />`,
  ];

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    '  <channel>',
    ...channel,
    ...entries.map(buildItem),
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}

export const feedHeaders = {
  'Content-Type': 'application/rss+xml; charset=utf-8',
};
