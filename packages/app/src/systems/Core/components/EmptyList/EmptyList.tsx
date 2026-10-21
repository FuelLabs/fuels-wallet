import { cssObj, Box, Heading } from '@fuel-wallet/ui';
import type { ReactNode } from 'react';

import { EmptyIllustration } from './EmptyIllustration';

export type EmptyListProps = {
  label: string;
  description?: ReactNode;
  children?: ReactNode;
};

export function EmptyList({ label, description, children }: EmptyListProps) {
  return (
    <Box.Stack gap="$2" css={styles.root}>
      <EmptyIllustration />
      <Heading as="h3" className="fuel-rise" css={styles.title}>
        {label}
      </Heading>
      {description && (
        <Box className="fuel-rise" css={styles.description}>
          {description}
        </Box>
      )}
      {children && (
        <Box className="fuel-rise" css={styles.action}>
          {children}
        </Box>
      )}
    </Box.Stack>
  );
}

const styles = {
  root: cssObj({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',

    '& > .fuel-rise:not(:first-child)': {
      '--fuel-enter-delay': '200ms',
    },
  }),
  title: cssObj({
    m: 0,
    mt: '$5',
    color: '$textHigh',
    fontSize: '$lg',
    fontWeight: '$medium',
  }),
  description: cssObj({
    maxWidth: 280,
    fontSize: '$sm',
    color: '$textLow',
  }),
  action: cssObj({
    mt: '$3',
  }),
};
