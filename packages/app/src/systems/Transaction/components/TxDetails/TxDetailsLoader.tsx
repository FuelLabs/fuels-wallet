import type { ContentLoaderProps } from '@fuel-ui/react';
import { Card, ContentLoader } from '@fuel-ui/react';

export const TxDetailsLoader = (props: ContentLoaderProps) => (
  <Card>
    <ContentLoader width={300} height={40} viewBox="0 0 300 42" {...props}>
      <rect x="6" y="12" width="110" height="20" rx="4" />
      <rect x="174" y="12" width="120" height="20" rx="4" />
    </ContentLoader>
  </Card>
);
