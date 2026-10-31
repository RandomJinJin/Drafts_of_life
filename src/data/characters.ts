export interface CharacterGraphData {
  characters: {
    id: string;
    name: string;
    role: string;
    description: string;
  }[];
  relations: {
    source: string;
    target: string;
    label: string;
  }[];
}

const graphs = import.meta.glob<CharacterGraphData>('../content/characters/*.json', {
  eager: true,
  import: 'default',
});

export function getCharacterGraph(slug: string): CharacterGraphData | undefined {
  return graphs[`../content/characters/${slug}.json`];
}
