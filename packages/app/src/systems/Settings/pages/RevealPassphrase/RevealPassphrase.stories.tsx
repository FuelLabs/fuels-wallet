import type { StoryFn } from '@storybook/react';

import { RecoverPassphrase } from './RevealPassphrase';

export default {
  component: RecoverPassphrase,
  title: 'SignUp/Pages/1. RecoverPassphrase',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage: StoryFn<unknown> = () => <RecoverPassphrase />;
