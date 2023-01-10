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
      <Button onPress={() => store.openUnlock()}>Open Unlock</Button>
      <UnlockDialog
        onCancel={action('onCancel')}
        onSuccess={action('onSuccess')}
        onError={action('onError')}
      />
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
