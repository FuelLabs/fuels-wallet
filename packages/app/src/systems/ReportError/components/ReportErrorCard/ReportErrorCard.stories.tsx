import type { StoryFn } from '@storybook/react';

import { ReportErrorsCard } from './ReportErrorCard';

export default {
  title: 'Error/Report Errors Card',
  component: ReportErrorsCard,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage: StoryFn<never> = () => {
  return (
    <>
      <ReportErrorsCard
        onClose={() => {}}
        onSendAlways={() => {}}
        onDontSend={() => {}}
        onSendOnce={() => {}}
      />
    </>
  );
};

Usage.loaders = [
  async () => {
    return {};
  },
];

Usage.parameters = {
  layout: 'centered',
};
