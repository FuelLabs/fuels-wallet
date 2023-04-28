import type { Meta, StoryFn } from '@storybook/react';

import { TermsOfUse } from './TermsOfUse';

export default {
  component: TermsOfUse,
  title: 'SignUp/Pages/4. TermsOfUse',
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Usage: StoryFn<unknown> = () => <TermsOfUse />;
