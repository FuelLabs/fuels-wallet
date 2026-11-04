import { cssObj, Box, Heading } from '@fuel-wallet/ui';
import type { ReactNode } from 'react';

import { EmptyIllustration } from './EmptyIllustration';

export type EmptyListProps = {
  label: string;
  description?: ReactNode;
  children?: ReactNode;
  /** Two ghost rows and tighter spacing, for lists that share the screen. */
  compact?: boolean;
};

export function EmptyList({
  label,
  description,
  children,
  compact,
}: EmptyListProps) {
  return (
    <Box.Stack gap="$2" css={styles.root} data-compact={compact}>
      <EmptyIllustration rows={compact ? 2 : 3} />
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
    '&[data-compact="true"] h3': {
      mt: '$3',
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
