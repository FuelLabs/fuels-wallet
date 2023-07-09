import { Box, Button } from '@fuel-ui/react';

import { ResetDialog } from './ResetDialog';

import { createMockAccount } from '~/systems/Account/__mocks__';
import { useOverlay } from '~/systems/Overlay';

export default {
  component: ResetDialog,
  title: 'Unlock/Components/ResetDialog',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage = () => {
  const overlay = useOverlay();
  return (
    <Box.Stack>
      <Button onClick={() => overlay.open({ modal: 'reset' })}>
        Open reset wallet
      </Button>
      <ResetDialog />
    </Box.Stack>
  );
};

Usage.loaders = [
  async () => {
    await createMockAccount();
    return {};
  },
];

Usage.parameters = {
  layout: 'centered',
};
