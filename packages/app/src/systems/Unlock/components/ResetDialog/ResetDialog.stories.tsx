import { Button } from '@fuel-ui/react';
import type { StoryFn } from '@storybook/react';

import { ResetDialog } from './ResetDialog';

import { createMockAccount } from '~/systems/Account/__mocks__';

export default {
  component: ResetDialog,
  title: 'Unlock/Components/ResetDialog',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage: StoryFn<never> = () => {
  return (
    <>
      <ResetDialog onReset={() => {}}>
        <Button>Open reset wallet</Button>
      </ResetDialog>
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
