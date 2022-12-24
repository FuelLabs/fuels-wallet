import { Button } from '@fuel-ui/react';
import type { Meta } from '@storybook/react';
import { bn } from 'fuels';

import { MOCK_TRANSACTION_MINT } from '../../__mocks__/tx';
import { TxHeader } from '../TxHeader';

import { TxContent } from '.';

export default {
  title: 'Transaction/Components/TxContent',
  parameters: {
    viewport: {
      defaultViewport: 'chromeExtension',
    },
  },
} as Meta;

const PROVIDER_URL = 'http://localhost:4000';
const TX = MOCK_TRANSACTION_MINT.tx;

export const Info = () => {
  return (
    <TxContent.Info
      tx={TX}
      amount={bn(10000)}
      header={
        <TxHeader
          id={TX.id}
          type={TX.type}
          status={TX.status}
          providerUrl={PROVIDER_URL}
        />
      }
    />
  );
};

export const Loading = () => {
  return <TxContent.Loader header={<TxHeader.Loader />} />;
};

export const Success = () => {
  return (
    <TxContent.Success
      txHash={TX.id}
      providerUrl={PROVIDER_URL}
      footer={
        <Button color="accent" variant="ghost" css={{ mt: '$4' }}>
          Go back to Wallet
        </Button>
      }
    />
  );
};

export const Failed = () => {
  return (
    <TxContent.Failed
      footer={
        <Button color="red" variant="ghost" css={{ mt: '$4' }}>
          Try again
        </Button>
      }
    />
  );
};
