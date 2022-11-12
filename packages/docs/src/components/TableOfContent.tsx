import { cssObj } from '@fuel-ui/css';
import { Box, Heading, List } from '@fuel-ui/react';

import type { NodeHeading } from '../types';

type TableOfContentProps = {
  headings: NodeHeading[];
};

export function TableOfContent({ headings }: TableOfContentProps) {
  return (
    <Box>
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
    </Box>
  );
}

const styles = {
  root: cssObj({
    position: 'sticky',
    top: 0,
    py: '$8',
    pr: '$8',

    h6: {
      mt: 0,
    },

    '.fuel_list > .fuel_list-item': {
      pb: '$2',
      a: {
        fontWeight: '$semibold',
        color: '$gray11',
      },
    },
    '.fuel_list > .fuel_list-item > .fuel_list > .fuel_list-item': {
      a: {
        fontWeight: '$normal',
        color: '$gray8',
      },
    },
    '.fuel_list > .fuel_list-item > .fuel_list > .fuel_list-item:nth-child(1)':
      {
        pt: '$2',
      },
  }),
};
