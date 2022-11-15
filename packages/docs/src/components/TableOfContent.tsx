import { cssObj } from '@fuel-ui/css';
import { Box, Heading, Link, List, Text } from '@fuel-ui/react';

import { useDocContext } from '../hooks/useDocContext';

export function TableOfContent() {
  const { doc } = useDocContext();
  const { headings } = doc;
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
        <Text as="div" css={styles.feedback}>
          <Link
            isExternal
            href="https://github.com/fuellabs/fuels-wallet/issues/new/choose"
          >
            Questions? Give us a feedback
          </Link>
          <Link isExternal href={doc.pageLink}>
            Edit this page
          </Link>
        </Text>
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
        color: '$gray9',
      },
    },
    '.fuel_list > .fuel_list-item > .fuel_list > .fuel_list-item:nth-child(1)':
      {
        pt: '$2',
      },
  }),
  feedback: cssObj({
    display: 'flex',
    flexDirection: 'column',
    pt: '$3',
    borderTop: '1px solid $gray4',
    fontSize: '$xs',

    'a, a:visited': {
      color: '$gray10',
    },
  }),
};
