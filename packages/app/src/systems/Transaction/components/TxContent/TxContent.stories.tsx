import type { Meta } from '@storybook/react';

import { MOCK_TRANSACTION_MINT } from '../../__mocks__/tx';

import { TxContent } from '.';

export default {
  title: 'Transaction/Components/TxContent',
  parameters: {
    viewport: {
      defaultViewport: 'chromeExtension',
    },
  },
} as Meta;

const TX = MOCK_TRANSACTION_MINT;

export const Info = () => {
  return <TxContent.Info tx={TX} />;
};

export const Loading = () => {
  return <TxContent.Loader />;
};
