import type { StoryFn } from '@storybook/react';

import { RevealPassphrase } from './RevealPassphrase';

export default {
  component: RevealPassphrase,
  title: 'SignUp/Pages/1. RevealPassphrase',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage: StoryFn<unknown> = () => <RevealPassphrase />;
