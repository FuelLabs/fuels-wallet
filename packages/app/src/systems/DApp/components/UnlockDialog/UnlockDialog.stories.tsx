import { Button } from '@fuel-ui/react';
import type { StoryFn } from '@storybook/react';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    if (opened) {
      setOpened(false);
    }
  }, [opened]);

  return (
    <>
      <UnlockDialog isOpen={opened} onUnlock={() => {}} />
      <Button onPress={() => setOpened(true)}>Open Unlock</Button>
    </>
  );
};

Usage.loaders = [
  async () => {
    await createMockAccount('123123123');
    return {};
  },
];
Usage.parameters = {
  layout: 'centered',
};
