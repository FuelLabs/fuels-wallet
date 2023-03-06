import { darkColors } from '@fuel-ui/css';
import { Card } from '@fuel-ui/react';
import type { IContentLoaderProps } from 'react-content-loader';
import ContentLoader from 'react-content-loader';

export const ConnectInfoLoader = (props: IContentLoaderProps) => (
  <Card>
    <ContentLoader
      speed={2}
      width={300}
      height={52}
      viewBox="0 0 300 52"
      backgroundColor={darkColors.gray2}
      foregroundColor={darkColors.gray3}
      {...props}
    >
      <rect x="12" y="14" width="120" height="24" rx="4" />
      <rect x="190" y="14" width="100" height="24" rx="4" />
    </ContentLoader>
  </Card>
);
