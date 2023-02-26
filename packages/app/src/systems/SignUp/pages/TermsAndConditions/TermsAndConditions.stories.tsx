import type { StoryFn } from '@storybook/react';

import { TermsAndConditions } from './TermsAndConditions';

export default {
  component: TermsAndConditions,
  title: 'SignUp/Pages/2. TermsAndConditions',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage: StoryFn<unknown> = () => <TermsAndConditions />;
