import type { ContentLoaderProps } from '@fuel-ui/react';
import { CardList, ContentLoader } from '@fuel-ui/react';

export const AccountItemLoader = (props: ContentLoaderProps) => (
  <CardList.Item css={{ padding: '$0 !important' }}>
    <ContentLoader width={320} height={69} viewBox="0 0 320 69" {...props}>
      <path d="M72 21C72 18.7909 73.7909 17 76 17H169C171.209 17 173 18.7909 173 21V27C173 29.2091 171.209 31 169 31H76C73.7909 31 72 29.2091 72 27V21Z" />
      <rect x="72" y="38" width="80" height="14" rx="4" />
      <path d="M59 33.9999C59 45.0456 50.0458 54 39.0001 54C27.9543 54 19 45.0456 19 33.9999C19 22.9542 27.9543 14 39.0001 14C50.0457 14 59 22.9542 59 33.9999Z" />
    </ContentLoader>
  </CardList.Item>
);
