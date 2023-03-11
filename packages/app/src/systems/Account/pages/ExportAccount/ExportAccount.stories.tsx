import { BoxCentered, Button } from '@fuel-ui/react';
import type { ComponentStoryFn, Meta } from '@storybook/react';

import { createMockAccount, useAccounts } from '../..';

import { ExportAccount } from './ExportAccount';

import { store } from '~/store';
import { Layout } from '~/systems/Core';

export default {
  component: ExportAccount,
  title: 'Account/Pages/ExportAccount',
  decorators: [(Story) => <Story />],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'chromeExtension',
    },
  },
} as Meta;

const Template: ComponentStoryFn<typeof ExportAccount> = () => {
  const { account, isLoading, handlers } = useAccounts();
  return (
    <Layout isLoading={isLoading}>
      <BoxCentered css={{ minW: '100%', minH: '100%' }}>
        {account && (
          <Button
            onPress={() => handlers.goToExport({ account })}
            isLoading={isLoading}
          >
            Toggle Modal
          </Button>
        )}
      </BoxCentered>
    </Layout>
  );
};

export const Usage = Template.bind({});
Usage.loaders = [
  async () => {
    store.closeOverlay();
    const { account, manager } = await createMockAccount();
    manager.unlock('123123123');
    return { account };
  },
];
