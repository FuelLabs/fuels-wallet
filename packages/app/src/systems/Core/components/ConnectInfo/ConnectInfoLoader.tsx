import type { ContentLoaderProps } from '@fuel-ui/react';
import { Card, ContentLoader } from '@fuel-ui/react';

export const ConnectInfoLoader = (props: ContentLoaderProps) => (
  <Card>
    <ContentLoader width={300} height={48} viewBox="0 0 300 52" {...props}>
      <circle cx="18" cy="26" r="14" />
      <rect x="50" y="18" width="160" height="18" rx="4" />
    </ContentLoader>
  </Card>
);
