import { Box } from '@fuel-ui/react';

import type { VisibilityButtonProps } from './VisibilityButton';
import { VisibilityButton } from './VisibilityButton';

export default {
  component: VisibilityButton,
  title: 'Core/Components/VisibilityButton',
};

export const Usage = (args: VisibilityButtonProps) => (
  <Box css={{ width: 320 }}>
    <VisibilityButton {...args} />
  </Box>
);

export const Hidden = (args: VisibilityButtonProps) => (
  <Box css={{ width: 320 }}>
    <VisibilityButton {...args} isHidden />
  </Box>
);
