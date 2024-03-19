import { headingRank } from 'hast-util-heading-rank';
import { toString as toHtmlString } from 'hast-util-to-string';
import { visit } from 'unist-util-visit';
import type { NodeHeading } from '~/src/types';

type Params = {
  rank: number;
  headings: NodeHeading[];
};

export function rehypeExtractHeadings({ headings }: Params) {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return (tree: any) => {
    visit(tree, 'element', (node) => {
      const rank = headingRank(node);
      if (rank) {
        node.properties['data-rank'] = `h${rank}`;
      }
      if (rank === 2 && node?.type === 'element') {
        headings.push({
          title: toHtmlString(node),
          id: node.properties.id.toString(),
        });
      }
      if (rank === 3 && node?.type === 'element') {
        const last = headings[headings.length - 1];
        if (last) {
          last.children = last?.children || [];
          last.children.push({
            title: toHtmlString(node),
            id: node.properties.id.toString(),
          });
        }
      }
    });
  };
}
