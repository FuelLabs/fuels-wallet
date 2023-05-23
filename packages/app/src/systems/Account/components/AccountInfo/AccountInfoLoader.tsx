import { darkColors } from '@fuel-ui/css';
import { Card } from '@fuel-ui/react';
import type { IContentLoaderProps } from 'react-content-loader';
import ContentLoader from 'react-content-loader';

import { AccountItemLoader } from '~/systems/Account/components/AccountItem/AccountItemLoader';

export const AccountInfoLoader = (props: IContentLoaderProps) => (
  <Card>
    <Card.Header>
      <ContentLoader
        speed={2}
        width={300}
        height={24}
        viewBox="0 0 300 24"
        backgroundColor={darkColors.gray2}
        foregroundColor={darkColors.gray3}
        {...props}
      >
        <rect x="0" y="0" width="120" height="24" rx="4" />
      </ContentLoader>
    </Card.Header>
    <Card.Body>
      <AccountItemLoader />
    </Card.Body>
  </Card>
);
