import type { ContentLoaderProps } from '@fuel-ui/react';
import { Card, ContentLoader } from '@fuel-ui/react';

export const TxHeaderLoader = (props: ContentLoaderProps) => (
  <Card>
    <ContentLoader width={300} height={74} viewBox="0 0 300 76" {...props}>
      <rect x="12" y="13" width="150" height="20" rx="4" />
      <rect x="12" y="45" width="100" height="20" rx="4" />
      <rect x="225" y="13" width="50" height="20" rx="4" />
    </ContentLoader>
  </Card>
);
