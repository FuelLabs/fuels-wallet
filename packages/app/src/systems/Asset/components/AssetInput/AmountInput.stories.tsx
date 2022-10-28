import { Box } from '@fuel-ui/react';
import { bn } from 'fuels';

import { ASSET_LIST } from '../../utils';

import type { AmountInputProps } from './AmountInput';
import { AmountInput } from './AmountInput';

export default {
  component: AmountInput,
  title: 'Asset/Components/AmountInput',
};

export const Usage = (args: AmountInputProps) => (
  <Box css={{ width: 300 }}>
    <AmountInput
      {...args}
      asset={{
        ...ASSET_LIST[0],
        amount: bn(14563943834),
      }}
    />
  </Box>
);

export const Loader = () => (
  <Box css={{ width: 300 }}>
    <AmountInput.Loader />
  </Box>
);
