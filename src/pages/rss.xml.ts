import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildRssFeed, feedHeaders, type FeedEntry } from '../lib/feed';
import { site } from '../data/site';
import series from '../content/series.json';

export const GET: APIRoute = async ({ site: astroSite }) => {
  const base = astroSite ?? new URL(site.url);
  const stories = await getCollection('stories');

  const entries: FeedEntry[] = stories.map(story => ({
    title: story.data.title,
    link: new URL(`/stories/${story.id}/`, base).href,
    description: story.data.description,
    pubDate: story.data.publishedAt,
    author: story.data.author,
    category: series.find(item => item.slug === story.data.series)?.title ?? '独立短篇',
  }));

  const xml = buildRssFeed({
    title: site.feedTitle,
    description: site.description,
    link: new URL('/', base).href,
    feedUrl: new URL(site.feedHref, base).href,
    language: site.language,
    entries,
  });

  return new Response(xml, { headers: feedHeaders });
};
