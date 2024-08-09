import type { Meta, StoryFn } from '@storybook/react';

import { ReportErrors } from './ReportErrors';

export default {
  component: ReportErrors,
  title: 'Error/Pages/ReportErrors',
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'chromeExtension',
    },
  },
} as Meta;

const Template: StoryFn<typeof ReportErrors> = (_args) => {
  return <ReportErrors onRestore={() => {}} />;
};

export const Usage = Template.bind({});
