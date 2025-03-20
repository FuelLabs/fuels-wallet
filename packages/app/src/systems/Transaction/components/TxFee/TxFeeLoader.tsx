import type { ContentLoaderProps } from '@fuel-ui/react';
import { Card } from '@fuel-ui/react';

import { TxFeeAmountLoader } from './TxFeeAmountLoader';
import { styles } from './styles';

export const TxFeeLoader = (props: ContentLoaderProps) => (
  <Card css={styles.detailItem()}>
    <TxFeeAmountLoader {...props} />
  </Card>
);
