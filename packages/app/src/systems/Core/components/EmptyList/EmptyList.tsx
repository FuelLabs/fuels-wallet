import { cssObj } from '@fuel-ui/css';
import { Box, Heading, useFuelTheme } from '@fuel-ui/react';

import { relativeUrl } from '../../utils';
import { ImageLoader } from '../ImageLoader';

export type EmptyListProps = {
  label: string;
};

export function EmptyList({ label }: EmptyListProps) {
  const { current: theme } = useFuelTheme();
  return (
    <Box.Stack gap="$2" css={styles.root}>
      <ImageLoader
        src={relativeUrl(`/empty_activity_${theme}.png`)}
        width={231}
        height={175}
        alt="No assets"
      />
      <Heading as="h3">{label}</Heading>
    </Box.Stack>
  );
}

const styles = {
  root: cssObj({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    '& h3': {
      margin: 0,
      color: '$intentsBase12',
      fontSize: '$xl',
    },
  }),
};
