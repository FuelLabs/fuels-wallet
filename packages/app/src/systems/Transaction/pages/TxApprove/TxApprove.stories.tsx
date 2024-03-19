import { Box, Button } from '@fuel-ui/react';
import type { Meta, StoryFn } from '@storybook/react';
import { useEffect } from 'react';
import { Layout } from '~/systems/Core';
import { useTransactionRequest } from '~/systems/DApp';
import { sendLoader } from '~/systems/Send/__mocks__/send';
import { store } from '~/systems/Store';

import { TxApprove } from './TxApprove';

export default {
  component: TxApprove,
  title: 'Transaction/Pages/TxApprove',
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'chromeExtension',
    },
  },
} as Meta;

const Template: StoryFn<typeof TxApprove> = (_args, { loaded }) => {
  const txRequest = useTransactionRequest();
  const { transactionRequest, network, address } = loaded || {};

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    txRequest.handlers.request({
      address,
      transactionRequest,
      providerUrl: network?.url,
    });
  }, []);

  return (
    <Layout>
      <Box.Centered css={{ minW: '100%', minH: '100%' }}>
        <Button onPress={store.openTransactionApprove}>Toggle Modal</Button>
      </Box.Centered>
    </Layout>
  );
};

export const Usage = Template.bind({});
Usage.loaders = [sendLoader()];
