import { Box, Button } from '@fuel-ui/react';
import { action } from '@storybook/addon-actions';
import { bn } from 'fuels';
import { useEffect, useState } from 'react';

import type { AmountInputProps } from './AmountInput';
import { AmountInput } from './AmountInput';

export default {
  component: AmountInput,
  title: 'Asset/Components/AmountInput',
};

export const Usage = (args: AmountInputProps) => {
  const [amount, setAmount] = useState(bn());

  // Log onChange amount
  useEffect(() => {
    action('onChange')(amount.formatUnits());
  }, [amount]);

  return (
    <Box css={{ width: 300 }}>
      <AmountInput
        {...args}
        balance={bn.parseUnits('1.57')}
        onChange={(e) => {
          setAmount(e);
        }}
        value={amount}
      />
      <Button
        css={{ marginTop: '$3' }}
        onPress={() => setAmount(bn(1_000_000_011))}
      >
        Set amount (1.000000011)
      </Button>
    </Box>
  );
};

export const Loader = () => (
  <Box css={{ width: 300 }}>
    <AmountInput.Loader />
  </Box>
);
