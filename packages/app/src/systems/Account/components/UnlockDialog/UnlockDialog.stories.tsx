import { Button } from '@fuel-ui/react';
import { action } from '@storybook/addon-actions';
import type { StoryFn } from '@storybook/react';

import { UnlockDialog } from './UnlockDialog';

import { store } from '~/store';
import { createMockAccount } from '~/systems/Account/__mocks__';

export default {
  component: UnlockDialog,
  title: 'DApp/Components/UnlockDialog',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage: StoryFn<never> = () => {
  return (
    <>
      <Button onPress={() => store.unlock({ onSuccess: action('onSuccess') })}>
        Open Unlock
      </Button>
      <UnlockDialog />
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
