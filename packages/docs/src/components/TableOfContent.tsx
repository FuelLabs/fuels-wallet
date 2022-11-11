import { cssObj } from '@fuel-ui/css';
import { Box, Heading, List } from '@fuel-ui/react';

import type { NodeHeading } from '../types';

type TableOfContentProps = {
  headings: NodeHeading[];
};

export function TableOfContent({ headings }: TableOfContentProps) {
  return (
    <Box css={styles.root}>
      <Heading as="h6">On this page</Heading>
      <List>
        {headings.map((heading) => (
          <List.Item key={heading.title}>
            <a href={`#${heading.id}`}>{heading.title}</a>
            {heading.children && (
              <List type="ordered">
                {heading.children.map((heading) => (
                  <List.Item key={heading.title}>
                    <a href={`#${heading.id}`}>{heading.title}</a>
                  </List.Item>
                ))}
              </List>
            )}
          </List.Item>
        ))}
      </List>
    </Box>
  );
}

const styles = {
  root: cssObj({
    py: '$8',
    pr: '$8',

    '& > .fuel_list > .fuel_list-item': {
      pb: '$2',
      a: {
        fontWeight: '$semibold',
        color: '$gray11',
      },
    },
    '& > .fuel_list > .fuel_list-item > .fuel_list > .fuel_list-item': {
      a: {
        fontWeight: '$normal',
        color: '$gray8',
      },
    },
  }),
};
