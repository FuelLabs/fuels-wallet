import { Button } from '@fuel-ui/react';
import type { StoryFn } from '@storybook/react';
import { useState } from 'react';

import { createMockAccount } from '../../../Account/__mocks__';

import { UnlockDialog } from './UnlockDialog';

export default {
  component: UnlockDialog,
  title: 'DApp/Components/UnlockDialog',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage: StoryFn<never> = () => {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <UnlockDialog isOpen={opened} onUnlock={() => setOpened(false)} />
      <Button onPress={() => setOpened(true)}>Open Unlock</Button>
    </>
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
