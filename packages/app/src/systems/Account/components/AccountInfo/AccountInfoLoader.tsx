import type { ContentLoaderProps } from '@fuel-ui/react';
import { Card, ContentLoader } from '@fuel-ui/react';
import { AccountItemLoader } from '~/systems/Account/components/AccountItem/AccountItemLoader';

export const AccountInfoLoader = (props: ContentLoaderProps) => (
  <Card>
    <Card.Header css={{ py: '$3' }}>
      <ContentLoader width={300} height={16} viewBox="0 0 300 16" {...props}>
        <rect x="0" y="0" width="120" height="16" rx="4" />
      </ContentLoader>
    </Card.Header>
    <Card.Body css={{ padding: '$0' }}>
      <AccountItemLoader />
    </Card.Body>
  </Card>
);
