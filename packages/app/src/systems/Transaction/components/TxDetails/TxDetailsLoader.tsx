import type { ContentLoaderProps } from '@fuel-ui/react';
import { Card, ContentLoader, Text } from '@fuel-ui/react';

import { styles } from './styles';

export const TxDetailsLoader = (props: ContentLoaderProps) => (
  <Card css={styles.detailItem}>
    <Text color="intentsBase10" css={styles.text}>
      Fee (network)
    </Text>
    <ContentLoader width={100} height={20} viewBox="0 0 100 24" {...props}>
      <ContentLoader.Rect x="0" y="0" width="100" height="24" rx="4" />
    </ContentLoader>
  </Card>
);
