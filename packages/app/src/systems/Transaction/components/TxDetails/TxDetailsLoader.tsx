import { darkColors } from '@fuel-ui/css';
import { Card } from '@fuel-ui/react';
import type { IContentLoaderProps } from 'react-content-loader';
import ContentLoader from 'react-content-loader';

export const TxDetailsLoader = (props: IContentLoaderProps) => (
  <Card>
    <ContentLoader
      speed={2}
      width={300}
      height={40}
      viewBox="0 0 300 42"
      backgroundColor={darkColors.gray2}
      foregroundColor={darkColors.gray3}
      {...props}
    >
      <rect x="6" y="12" width="110" height="20" rx="4" />
      <rect x="174" y="12" width="120" height="20" rx="4" />
    </ContentLoader>
  </Card>
);
