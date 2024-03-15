import { cssObj } from '@fuel-ui/css';
import { Box, Tag, Text } from '@fuel-ui/react';
import { useNetwork } from '@fuels/react';

import { ExampleBox } from '../../../src/components/ExampleBox';

export function CurrentNetworkHook() {
  /* useNetwork:start */
  const { network } = useNetwork();
  /* useNetwork:end */

  return (
    <ExampleBox>
      <Box.Stack css={styles.root}>
        <Box.Stack gap="$3" css={{ mt: '$2' }}>
          {network && (
            <Tag size="xs" color="gray" variant="ghost">
              <Text>{network.url}</Text>
            </Tag>
          )}
        </Box.Stack>
      </Box.Stack>
    </ExampleBox>
  );
}

const styles = {
  root: cssObj({
    gap: '$2',
    display: 'inline-flex',
    alignItems: 'flex-start',

    '.fuel_tag': {
      justifyContent: 'flex-start',

      '& > p': {
        fontSize: '$xs',
      },
    },
  }),
};
