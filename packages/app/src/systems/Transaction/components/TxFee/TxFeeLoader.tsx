import { Card, type ContentLoaderProps } from '@fuel-wallet/ui';

import { TxFeeAmountLoader } from './TxFeeAmountLoader';

export const TxFeeLoader = (props: ContentLoaderProps) => (
  <Card css={{ padding: '$2', border: '1px solid var(--fuel-line)' }}>
    <TxFeeAmountLoader {...props} />
  </Card>
);
