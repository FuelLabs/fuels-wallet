import type { StoryFn } from '@storybook/react';

import { ChangePassword } from './ChangePassword';

export default {
  component: ChangePassword,
  title: 'Settings/Pages/1. ChangePassword',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage: StoryFn<unknown> = () => <ChangePassword />;
