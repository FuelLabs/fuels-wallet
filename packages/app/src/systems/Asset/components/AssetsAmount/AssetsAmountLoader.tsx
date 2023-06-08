import type { ContentLoaderProps } from '@fuel-ui/react';
import { Card, ContentLoader } from '@fuel-ui/react';

export const AssetsAmountLoader = (props: ContentLoaderProps) => (
  <Card css={{ padding: 0 }}>
    <ContentLoader width={300} height={68} viewBox="0 0 300 86" {...props}>
      <rect x="12" y="18" width="100" height="20" rx="4" />
      <rect x="12" y="50" width="125" height="20" rx="4" />
      <rect x="189" y="34" width="100" height="20" rx="4" />
    </ContentLoader>
  </Card>
);
