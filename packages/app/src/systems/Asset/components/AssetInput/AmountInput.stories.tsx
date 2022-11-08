import { Box } from '@fuel-ui/react';
import { bn } from 'fuels';

import type { AmountInputProps } from './AmountInput';
import { AmountInput } from './AmountInput';

export default {
  component: AmountInput,
  title: 'Asset/Components/AmountInput',
};

export const Usage = (args: AmountInputProps) => (
  <Box css={{ width: 300 }}>
    <AmountInput {...args} amount={bn.parseUnits('1.57')} />
  </Box>
);

export const Loader = () => (
  <Box css={{ width: 300 }}>
    <AmountInput.Loader />
  </Box>
);
