import type { ContentLoaderProps } from '@fuel-ui/react';
import { Card } from '@fuel-ui/react';

import { TxFeeAmountLoader } from './TxFeeAmountLoader';

export const TxFeeLoader = (props: ContentLoaderProps) => (
  <Card
    css={{ padding: '$2', borderRadius: '10px', border: '1px solid $gray3' }}
  >
    <TxFeeAmountLoader {...props} />
  </Card>
);
