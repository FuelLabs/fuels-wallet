import { cssObj } from '@fuel-ui/css';
import { Box, Icon, Text } from '@fuel-ui/react';
import type { DocType } from '~/src/types';

type BreadcrumbProps = {
  doc: DocType;
};

export function Breadcrumb({ doc }: BreadcrumbProps) {
  return (
    <Box.Flex css={styles.root}>
      <Text as="span" rightIcon={Icon.is('ChevronRight')}>
        Docs
      </Text>
      {doc.category && (
        <Text as="span" rightIcon={Icon.is('ChevronRight')}>
          {doc.category}
        </Text>
      )}
      <Text as="span">{doc.title}</Text>
    </Box.Flex>
  );
}

const styles = {
  root: cssObj({
    alignItems: 'center',
    gap: '$2',

    span: {
      color: '$intentsBase8',
      fontSize: '$sm',
    },
    '& > span:last-of-type': {
      color: '$intentsBase10',
    },
  }),
};
