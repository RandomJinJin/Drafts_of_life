import { visit } from 'unist-util-visit';

export default function remarkImageGrid() {
  return (tree) => {
    visit(tree, 'containerDirective', (node) => {
      if (node.name !== 'image-grid') return;
      node.data = { ...node.data, hName: 'div', hProperties: { className: ['image-grid'] } };
    });

    // Caption standalone image paragraphs both inside and outside grids.
    visit(tree, 'paragraph', (node) => {
      if (node.children.length !== 1 || node.data?.hName === 'figure') return;
      const content = node.children[0];
      const image = content.type === 'image' ? content
        : content.type === 'link' && content.children.length === 1 && content.children[0].type === 'image'
          ? content.children[0] : null;
      if (!image) return;
      node.data = { ...node.data, hName: 'figure', hProperties: { className: ['image-figure'] } };
      if (image.alt?.trim()) {
        node.children.push({
          type: 'paragraph',
          data: { hName: 'figcaption' },
          children: [{ type: 'text', value: image.alt }],
        });
      }
    });
  };
}
