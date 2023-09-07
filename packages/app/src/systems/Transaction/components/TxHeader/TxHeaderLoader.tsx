import type { ContentLoaderProps } from '@fuel-ui/react';
import { Card, ContentLoader } from '@fuel-ui/react';

export const TxHeaderLoader = (props: ContentLoaderProps) => (
  <Card css={{ height: 72 }}>
    <ContentLoader
      width={'100%'}
      height={'100%'}
      viewBox="0 0 300 72"
      {...props}
    >
      <rect x="16" y="16" width="150" height="16" rx="4" />
      <rect x="16" y="40" width="100" height="16" rx="4" />
      <rect x="225" y="16" width="50" height="16" rx="4" />
    </ContentLoader>
  </Card>
);
