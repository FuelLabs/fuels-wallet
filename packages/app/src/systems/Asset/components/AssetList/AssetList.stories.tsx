import { Box } from '@fuel-ui/react';

import { MOCK_ASSETS } from '../../__mocks__/assets';

import type { AssetListProps } from './AssetList';
import { AssetList } from './AssetList';

export default {
  component: AssetList,
  title: 'Asset/Components/AssetList',
};

export const Usage = (args: AssetListProps) => (
  <Box css={{ width: 300 }}>
    <AssetList {...args} assets={MOCK_ASSETS} />
  </Box>
);

export const Loading = () => (
  <Box css={{ width: 300, height: 300 }}>
    <AssetList.Loading items={3} />
  </Box>
);

export const Empty = () => (
  <Box css={{ width: 300, height: 300 }}>
    <AssetList.Empty />
  </Box>
);

export const EmptyDevnet = () => (
  <Box css={{ width: 300, height: 300 }}>
    <AssetList.Empty isDevnet />
  </Box>
);
