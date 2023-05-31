import type { ContentLoaderProps } from '@fuel-ui/react';
import { Card, ContentLoader } from '@fuel-ui/react';

export const TxRecipientCardLoader = (props: ContentLoaderProps) => (
  <Card>
    <ContentLoader width={149} height={154} viewBox="0 0 149 156" {...props}>
      <rect x="48" y="16" width="56" height="20" rx="4" />
      <rect x="48" y="48" width="56" height="56" rx="28" />
      <rect x="35" y="120" width="80" height="20" rx="4" />
    </ContentLoader>
  </Card>
);
