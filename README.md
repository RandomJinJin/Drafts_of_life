# 人间底稿

以中文小说报纸形式呈现的故事站点，基于 Astro 静态构建。最新文章自动成为头版头条，另有系列、归档、投稿页面。完整设计规范见 [docs/design/README.md](docs/design/README.md)。

## 本地开发

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev -- --background` | 在后台启动开发服务 |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 内容结构

- `src/content/stories/*.md` — 文章，一篇一个文件，文件名即文章 id。
- `src/content/series.json` — 系列的名称、简介、状态与显示顺序。文章 `series` 填对应 `slug`，独立短篇填 `null`；新增系列只需在此文件加一项。
- `src/content/characters/<slug>.json` — 系列人物图谱（可选），文件名与系列 `slug` 一致，格式见设计规范。
- `public/templates/submission.md` — 投稿模板，投稿页提供下载。

### 文章 frontmatter

```yaml
---
title: 文章标题
description: 一句话摘要（出现在头版和归档列表）
series: office-story      # 独立短篇填 null
publishedAt: 2026-11-04
author: 署名
authorurl: https://example.com   # 可选个人主页，没有就删掉这行
source: editorial         # editorial 编辑部 / contribution 投稿
cover:                    # 可选封面，没有就删掉
  src: 图片链接
  caption: 图片说明
---
```

阅读时长按正文自动计算（约每分钟 400 字）；系列页按发布日期排序并自动标注篇序。

## 文章图片并排

使用 `:::image-grid` 包裹图片，每张图片之间空一行：

```markdown
:::image-grid
![第一张图片的说明](https://example.com/image-1.webp)

![第二张图片的说明](https://example.com/image-2.webp)
:::
```

每行显示两张，更多图片自动换行；奇数张时最后一张位于左列。
移动端仍为两列，图片保持原始比例，不裁切、不强制等高。布局无需客户端 JavaScript。
实际示例见 `src/content/stories/20261104.md`。
图片的说明文字（`![说明文字](链接)` 中的文字）会显示在对应图片下方，居中排列；留空则不显示说明。
单张图片同样支持说明：将 `![说明文字](链接)` 单独写成一段即可，无需包裹 `:::image-grid`。

## RSS 订阅

站点在构建期生成静态 RSS 2.0 源，无额外依赖：

| 地址 | 内容 |
| :--- | :--- |
| `/rss.xml` | 全部故事，按刊登时间倒序 |
| `/series/<slug>/rss.xml` | 单个系列的故事 |

- 生成逻辑在 `src/lib/feed.ts`，路由见 `src/pages/rss.xml.ts` 与 `src/pages/series/[slug]/rss.xml.ts`。
- 站点标题、描述与订阅源路径集中在 `src/data/site.ts`；部署域名同时写在 `astro.config.mjs` 的 `site` 中，RSS 的绝对链接由它生成，换域名需两处同步修改。
- 所有页面 `<head>` 通过 `Newspaper.astro` 自动输出 `<link rel="alternate" type="application/rss+xml">`，系列页会指向该系列的源。
- 订阅说明页为 `src/pages/subscribe.astro`，页脚“RSS 订阅”入口指向它。
- 源内每条包含标题、摘要、作者、系列分类与刊登时间；不提供全文，读者点击链接回到站内阅读。

## 投稿
投稿页为 `src/pages/submit.astro`，投稿邮箱、邮件标题、回执天数配置在 `src/data/submission.ts`。
`public/templates/submission.md` 是给投稿者的写作模板，包含 frontmatter 填写说明、头图 AI 提示词和正文排版要求。

修改 Markdown 插件后若页面仍显示旧内容，使用 `npm run build -- --force` 强制构建；开发服务可用 `npm run astro -- dev stop` 停止，再执行 `npm run dev -- --background --force`。
