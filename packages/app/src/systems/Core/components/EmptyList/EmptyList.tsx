import { cssObj } from '@fuel-ui/css';
import { Heading, Stack } from '@fuel-ui/react';

import { ImageLoader, relativeUrl } from '~/systems/Core';

export type EmptyListProps = {
  label: string;
};

export function EmptyList({ label }: EmptyListProps) {
  return (
    <Stack gap="$2" css={styles.root}>
      <ImageLoader
        src={relativeUrl('/empty-list.png')}
        width={258}
        height={157}
        alt="No assets"
      />
      <Heading as="h3">{label}</Heading>
    </Stack>
  );
}

const styles = {
  root: cssObj({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    '& h3': {
      margin: 0,
      color: '$gray12',
      fontSize: '$xl',
    },
  }),
};
