import { darkColors } from '@fuel-ui/css';
import { Card } from '@fuel-ui/react';
import type { IContentLoaderProps } from 'react-content-loader';
import ContentLoader from 'react-content-loader';

export const TxDetailsLoader = (props: IContentLoaderProps) => (
  <Card>
    <ContentLoader
      speed={2}
      width={300}
      height={117}
      viewBox="0 0 300 119"
      backgroundColor={darkColors.gray2}
      foregroundColor={darkColors.gray3}
      {...props}
    >
      <rect x="12" y="15" width="150" height="20" rx="4" />
      <rect x="0" y="45" width="300" height="1" rx="4" />
      <rect x="12" y="55" width="110" height="20" rx="4" />
      <rect x="12" y="88" width="110" height="20" rx="4" />
      <rect x="174" y="55" width="110" height="20" rx="4" />
      <rect x="174" y="88" width="110" height="20" rx="4" />
    </ContentLoader>
  </Card>
);
