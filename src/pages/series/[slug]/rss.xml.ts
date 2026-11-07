import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildRssFeed, feedHeaders, type FeedEntry } from '../../../lib/feed';
import { site } from '../../../data/site';
import series from '../../../content/series.json';

export async function getStaticPaths() {
  const stories = await getCollection('stories');
  return series
    .filter(item => stories.some(story => story.data.series === item.slug))
    .map(item => ({ params: { slug: item.slug }, props: { item } }));
}

export const GET: APIRoute = async ({ props, site: astroSite }) => {
  const base = astroSite ?? new URL(site.url);
  const { item } = props as { item: (typeof series)[number] };
  const stories = await getCollection('stories');

  const entries: FeedEntry[] = stories
    .filter(story => story.data.series === item.slug)
    .map(story => ({
      title: story.data.title,
      link: new URL(`/stories/${story.id}/`, base).href,
      description: story.data.description,
      pubDate: story.data.publishedAt,
      author: story.data.author,
      category: item.title,
    }));

  const xml = buildRssFeed({
    title: `${item.title} · ${site.title}`,
    description: item.description,
    link: new URL(`/series/${item.slug}/`, base).href,
    feedUrl: new URL(`/series/${item.slug}/rss.xml`, base).href,
    language: site.language,
    entries,
  });

  return new Response(xml, { headers: feedHeaders });
};
