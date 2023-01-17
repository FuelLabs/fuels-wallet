/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Box } from '@fuel-ui/react';
import type { Meta, Story } from '@storybook/react';
import { Wallet } from 'fuels';
import { useEffect } from 'react';

import { getMockedTransaction } from '../../__mocks__/dapp-transaction';

import { TransactionRequest } from './TransactionRequest';

import { createMockAccount } from '~/systems/Account';
import { NetworkService } from '~/systems/Network';

async function loader() {
  const { account, password } = await createMockAccount();
  await NetworkService.clearNetworks();
  const network = await NetworkService.addFirstNetwork();
  const wallet = Wallet.generate();
  const transactionRequest = await getMockedTransaction(
    account?.publicKey || '',
    wallet.publicKey,
    network?.url!
  );

  return { transactionRequest, network, password };
}

export default {
  component: TransactionRequest,
  title: 'DApp/Pages/TransactionRequest',
  loaders: [loader],
  decorators: [(Story) => <Story />],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'chromeExtension',
    },
  },
} as Meta;

export const Usage: Story = (_args, { loaded }) => {
  useEffect(() => {
    // eslint-disable-next-line no-alert
    alert(`use this password to unlock: ${loaded.password}`);
  }, []);

  return (
    <Box css={{ width: 300 }}>
      <TransactionRequest />
    </Box>
  );
};
