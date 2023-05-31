import type { ContentLoaderProps } from '@fuel-ui/react';
import { CardList, ContentLoader } from '@fuel-ui/react';

export const ConnectionItemLoader = (props: ContentLoaderProps) => (
  <CardList.Item css={{ padding: '$0 !important' }}>
    <ContentLoader width={316} height={60} viewBox="0 0 316 60" {...props}>
      <circle cx="32" cy="30" r="16" />
      <rect x="58" y="14" width="158" height="16" rx="5" />
      <rect x="58" y="36" width="112" height="10" rx="5" />
    </ContentLoader>
  </CardList.Item>
);
