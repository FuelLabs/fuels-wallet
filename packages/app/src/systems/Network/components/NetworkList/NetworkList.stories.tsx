import { Box } from '@fuel-ui/react';
import { action } from '@storybook/addon-actions';

import { MOCK_NETWORKS } from '../../__mocks__/networks';

import type { NetworkListProps } from './NetworkList';
import { NetworkList } from './NetworkList';

export default {
  component: NetworkList,
  title: 'Network/Components/NetworkList',
};

export const Usage = (args: NetworkListProps) => (
  <Box css={{ maxWidth: '$xs' }}>
    <NetworkList
      {...args}
      networks={MOCK_NETWORKS}
      onUpdate={action('onUpdate')}
      onRemove={action('onRemove')}
      onPress={action('onPress')}
    />
  </Box>
);
