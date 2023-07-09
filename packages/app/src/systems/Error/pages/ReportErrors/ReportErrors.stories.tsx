import type { ComponentStoryFn, Meta } from '@storybook/react';

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

const Template: ComponentStoryFn<typeof ReportErrors> = (_args) => {
  return <ReportErrors />;
};

export const Usage = Template.bind({});
