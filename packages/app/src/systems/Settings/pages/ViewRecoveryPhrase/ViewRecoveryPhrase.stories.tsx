import { BoxCentered, Button, Stack, Text } from '@fuel-ui/react';
import type { ComponentStoryFn, Meta } from '@storybook/react';

import { ViewRecoveryPhrase } from './ViewRecoveryPhrase';

import { store } from '~/store';
import { useAccounts } from '~/systems/Account';
import { Layout } from '~/systems/Core';
import { mockVault } from '~/systems/Core/__tests__/utils/mockVault';

export default {
  component: ViewRecoveryPhrase,
  title: 'Settings/Pages/2. View Recovery Phrase',
  decorators: [(Story) => <Story />],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'chromeExtension',
    },
  },
} as Meta;

const Template: ComponentStoryFn<typeof ViewRecoveryPhrase> = () => {
  const { account, isLoading } = useAccounts();
  return (
    <Layout isLoading={isLoading}>
      <BoxCentered css={{ minW: '100%', minH: '100%' }}>
        <Stack>
          <Text>Password: 123123123</Text>
          {account && (
            <Button
              onPress={() => store.openExportSeedPhrase()}
              isLoading={isLoading}
            >
              Toggle Modal
            </Button>
          )}
        </Stack>
      </BoxCentered>
    </Layout>
  );
};

export const Usage = Template.bind({});
Usage.loaders = [
  async () => {
    store.closeOverlay();
    await mockVault({
      password: '123123123',
    });
    return {};
  },
];
