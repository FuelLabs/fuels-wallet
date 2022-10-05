import { Box, CardList } from '@fuel-ui/react';
import { action } from '@storybook/addon-actions';

import { MOCK_NETWORKS } from '../../__mocks__/networks';

import { NetworkItem } from './NetworkItem';

export default {
  component: NetworkItem,
  title: 'Network/Components/NetworkItem',
};

const NETWORK = MOCK_NETWORKS[0];

export const Usage = () => (
  <Box css={{ maxWidth: '$xs' }}>
    <CardList>
      <NetworkItem network={NETWORK} />
    </CardList>
  </Box>
);

export const WithActions = () => {
  return (
    <Box css={{ maxWidth: '$xs' }}>
      <CardList>
        <NetworkItem
          network={NETWORK}
          onUpdate={action('onUpdate')}
          onRemove={action('onRemove')}
          onPress={action('onPress')}
        />
      </CardList>
    </Box>
  );
};
