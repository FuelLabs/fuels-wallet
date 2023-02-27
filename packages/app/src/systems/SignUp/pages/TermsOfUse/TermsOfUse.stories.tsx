import type { StoryFn } from '@storybook/react';

import { TermsOfUse } from './TermsOfUse';

export default {
  component: TermsOfUse,
  title: 'SignUp/Pages/2. TermsOfUse',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage: StoryFn<unknown> = () => <TermsOfUse />;
