import type { Story } from '@storybook/react';

import { createMockAccount } from '../../../Account/__mocks__';

import { UnlockDialog } from './UnlockDialog';

export default {
  component: UnlockDialog,
  title: 'DApp/Components/UnlockDialog',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage: Story<never> = () => {
  return <UnlockDialog isOpen onUnlock={() => {}} />;
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
