import { Button } from '@fuel-ui/react';
import type { StoryFn } from '@storybook/react';
import { useState } from 'react';

import { UnlockDialog } from './UnlockDialog';

import { createMockAccount } from '~/systems/Account/__mocks__';

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
