import type { ContentLoaderProps } from '@fuel-ui/react';
import { Card, ContentLoader } from '@fuel-ui/react';

export const TxRecipientCardLoader = (props: ContentLoaderProps) => (
  <Card className="TxRecipientCard">
    <ContentLoader width={157} height={169} viewBox="0 0 149 183" {...props}>
      <rect x="48" y="16" width="56" height="20" rx="4" />
      <rect x="48" y="50" width="56" height="56" rx="28" />
      <rect x="35" y="118" width="80" height="22" rx="4" />
      <rect x="35" y="148" width="80" height="20" rx="4" />
    </ContentLoader>
  </Card>
);
