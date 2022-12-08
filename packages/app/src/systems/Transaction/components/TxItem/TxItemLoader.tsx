import { darkColors } from '@fuel-ui/css';
import { Card } from '@fuel-ui/react';
import type { IContentLoaderProps } from 'react-content-loader';
import ContentLoader from 'react-content-loader';

export const TxItemLoader = (props: IContentLoaderProps) => (
  <Card>
    <ContentLoader
      speed={2}
      width={300}
      height={74}
      viewBox="0 0 300 76"
      backgroundColor={darkColors.gray2}
      foregroundColor={darkColors.gray3}
      {...props}
    >
      <rect x="12" y="13" width="150" height="20" rx="4" />
      <rect x="12" y="45" width="100" height="20" rx="4" />
      <rect x="225" y="13" width="50" height="20" rx="4" />
    </ContentLoader>
  </Card>
);
