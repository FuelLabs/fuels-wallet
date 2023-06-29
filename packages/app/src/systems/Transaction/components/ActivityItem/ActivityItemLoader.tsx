import type { ContentLoaderProps } from '@fuel-ui/react';
import { Card, ContentLoader } from '@fuel-ui/react';

export const ActivityItemLoader = (props: ContentLoaderProps) => (
  <Card>
    <ContentLoader width={360} height={70} viewBox="0 0 360 72" {...props}>
      <circle cx="28" cy="36" r="20" />
      <rect x="60" y="16" width="120" height="20" rx="4" />
      <rect x="60" y="42" width="100" height="14" rx="4" />
      <rect x="220" y="16" width="80" height="20" rx="4" />
      <rect x="240" y="42" width="60" height="14" rx="4" />
    </ContentLoader>
  </Card>
);
