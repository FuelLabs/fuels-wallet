import { Box } from '@fuel-ui/react';

import { MOCK_ASSETS_AMOUNTS } from '../../__mocks__/assets';

import type { AssetsAmountProps } from './AssetsAmount';
import { AssetsAmount } from './AssetsAmount';

export default {
  component: AssetsAmount,
  title: 'Asset/Components/AssetsAmount',
};

export const Single = (args: AssetsAmountProps) => (
  <Box css={{ maxWidth: 300 }}>
    <AssetsAmount {...args} amounts={[MOCK_ASSETS_AMOUNTS[0]]} />
  </Box>
);

export const Multiple = (args: AssetsAmountProps) => (
  <Box css={{ maxWidth: 300 }}>
    <AssetsAmount {...args} amounts={MOCK_ASSETS_AMOUNTS} />
  </Box>
);
