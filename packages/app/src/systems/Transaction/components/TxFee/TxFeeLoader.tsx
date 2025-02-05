import type { ContentLoaderProps } from '@fuel-ui/react';
import { Card, ContentLoader, Text } from '@fuel-ui/react';

import { TxFeeAmountLoader } from './TxFeeAmountLoader';
import { styles } from './styles';

export const TxFeeLoader = (props: ContentLoaderProps) => (
  <Card css={styles.detailItem()}>
    <Text color="intentsBase11" css={styles.title}>
      Fee (network)
    </Text>
    <TxFeeAmountLoader {...props} />
  </Card>
);
