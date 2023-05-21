import { BoxCentered, Button } from '@fuel-ui/react';
import type { ComponentStoryFn, Meta } from '@storybook/react';

import { ReportErrors } from './ReportErrors';

import { Layout } from '~/systems/Core';
import { store } from '~/systems/Store';

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
  return (
    <Layout>
      <BoxCentered css={{ minW: '100%', minH: '100%' }}>
        <Button onPress={store.openViewReportErrors}>Toggle Modal</Button>
      </BoxCentered>
    </Layout>
  );
};

export const Usage = Template.bind({});
