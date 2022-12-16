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
      <circle cx="32" cy="36" r="24" />
      <rect x="64" y="13" width="120" height="20" rx="4" />
      <rect x="64" y="45" width="100" height="14" rx="4" />
      <rect x="225" y="13" width="60" height="20" rx="4" />
      <rect x="225" y="45" width="50" height="14" rx="4" />
    </ContentLoader>
  </Card>
);
