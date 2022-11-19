import { cssObj } from '@fuel-ui/css';
import { Box, Icon } from '@fuel-ui/react';
import Link from 'next/link';

import { useDocContext } from '~/hooks/useDocContext';

export function DocFooter() {
  const { docLink } = useDocContext();
  return (
    <Box as="footer" css={styles.root}>
      <Box css={{ flex: 1 }}>
        {docLink.prev && (
          <Link href={`docs/${docLink.prev.slug}`}>
            <Icon icon={Icon.is('ArrowLeft')} size={24} /> {docLink.prev.label}
          </Link>
        )}
      </Box>
      <Box>
        {docLink.next && (
          <Link href={`docs/${docLink.next.slug}`}>
            {docLink.next.label} <Icon icon={Icon.is('ArrowRight')} size={24} />
          </Link>
        )}
      </Box>
    </Box>
  );
}

const styles = {
  root: cssObj({
    display: 'flex',
    pt: '$12',
    pb: '$4',
    mt: '$14',
    borderTop: '1px dashed $gray3',

    a: {
      display: 'inline-flex',
      alignItems: 'center',
      fontSize: '$xl',
      gap: '$4',
      color: '$gray9',
    },
    'a:hover': {
      color: '$accent11',
    },
  }),
};
