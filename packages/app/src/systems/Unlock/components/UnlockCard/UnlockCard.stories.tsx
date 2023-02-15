import type { StoryFn } from '@storybook/react';

import { UnlockCard } from './UnlockCard';

import { createMockAccount } from '~/systems/Account/__mocks__';

export default {
  component: UnlockCard,
  title: 'Unlock/Components/UnlockDialog',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage: StoryFn<never> = () => {
  return (
    <>
      <UnlockCard onUnlock={() => {}} onReset={() => {}} />
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
