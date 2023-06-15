import type { ContentLoaderProps } from '@fuel-ui/react';
import { CardList, ContentLoader } from '@fuel-ui/react';

export const AssetItemLoader = (props: ContentLoaderProps) => (
  <CardList.Item css={{ padding: '$2 !important' }}>
    <ContentLoader width={300} height={60} viewBox="0 0 300 60" {...props}>
      <circle cx="26" cy="30" r="18" />
      <rect x="56" y="12" rx="4" ry="4" width="92" height="14" />
      <rect x="56" y="36" rx="4" ry="4" width="62" height="14" />
      <rect x="180" y="24" rx="4" ry="4" width="92" height="14" />
    </ContentLoader>
  </CardList.Item>
);
