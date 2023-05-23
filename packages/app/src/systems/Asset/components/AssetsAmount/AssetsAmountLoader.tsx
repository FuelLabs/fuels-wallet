import { darkColors } from '@fuel-ui/css';
import { Card } from '@fuel-ui/react';
import type { IContentLoaderProps } from 'react-content-loader';
import ContentLoader from 'react-content-loader';

export const AssetsAmountLoader = (props: IContentLoaderProps) => (
  <Card css={{ padding: 0 }}>
    <ContentLoader
      speed={2}
      width={300}
      height={84}
      viewBox="0 0 300 86"
      backgroundColor={darkColors.gray2}
      foregroundColor={darkColors.gray3}
      {...props}
    >
      <rect x="12" y="18" width="100" height="20" rx="4" />
      <rect x="12" y="50" width="125" height="20" rx="4" />
      <rect x="189" y="34" width="100" height="20" rx="4" />
    </ContentLoader>
  </Card>
);
