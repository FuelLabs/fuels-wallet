import { Box } from '@fuel-ui/react';

import type { AmountVisibilityProps } from './AmountVisibility';
import { AmountVisibility } from './AmountVisibility';

export default {
  component: AmountVisibility,
  title: 'Core/Components/AmountVisibility',
};

export const Usage = (args: AmountVisibilityProps) => (
  <Box css={{ width: 320 }}>
    <AmountVisibility {...args} />
  </Box>
);

Usage.args = {
  visibility: true,
};

export const Hidden = (args: AmountVisibilityProps) => (
  <Box css={{ width: 320 }}>
    <AmountVisibility {...args} />
  </Box>
);

Hidden.args = {
  visibility: false,
};
