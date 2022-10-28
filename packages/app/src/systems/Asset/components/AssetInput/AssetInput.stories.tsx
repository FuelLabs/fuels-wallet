import { Box } from '@fuel-ui/react';
import { bn } from 'fuels';

import { ASSET_LIST } from '../../utils';

import type { AssetInputProps } from './AssetInput';
import { AssetInput } from './AssetInput';

export default {
  component: AssetInput,
  title: 'Asset/Components/AssetInput',
};

export const Usage = (args: AssetInputProps) => (
  <Box css={{ width: 300 }}>
    <AssetInput
      {...args}
      asset={{
        ...ASSET_LIST[0],
        amount: bn(157),
      }}
    />
  </Box>
);

export const Loader = () => (
  <Box css={{ width: 300 }}>
    <AssetInput.Loader />
  </Box>
);
