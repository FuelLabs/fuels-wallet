import type { Meta } from '@storybook/react';

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
const TX = MOCK_TRANSACTION_MINT;

export const Info = () => {
  return (
    <TxContent.Info
      tx={TX}
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
