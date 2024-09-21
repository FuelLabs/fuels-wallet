import { Box } from '@fuel-ui/react';
import { bn } from 'fuels';

import { MOCK_FUEL_ASSETS } from '../../__mocks__/assets';
import type { AssetItemProps } from './AssetItem';
import { AssetItem } from './AssetItem';

export default {
  component: AssetItem,
  title: 'Asset/Components/AssetItem',
};

export const Usage = (args: AssetItemProps) => (
  <Box css={{ width: 300 }}>
    <AssetItem {...args} asset={MOCK_FUEL_ASSETS[0]} amount={bn(14563943834)} />
  </Box>
);

export const Loader = () => (
  <Box css={{ width: 300 }}>
    <AssetItem.Loader />
  </Box>
);
