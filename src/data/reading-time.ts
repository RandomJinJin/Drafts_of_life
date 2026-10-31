import type { CollectionEntry } from 'astro:content';

// Chinese prose is counted by character; Latin text is counted by word.
export function readingMinutes(story: CollectionEntry<'stories'>): number {
  const body = story.body ?? '';
  const hanCharacters = body.match(/\p{Script=Han}/gu)?.length ?? 0;
  const latinWords = body.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g)?.length ?? 0;
  return Math.max(1, Math.ceil((hanCharacters + latinWords) / 400));
}
