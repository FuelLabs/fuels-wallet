import { darkColors } from '@fuel-ui/css';
import { Card } from '@fuel-ui/react';
import type { IContentLoaderProps } from 'react-content-loader';
import ContentLoader from 'react-content-loader';

export const ConnectInfoLoader = (props: IContentLoaderProps) => (
  <Card>
    <ContentLoader
      speed={2}
      width={300}
      height={48}
      viewBox="0 0 300 52"
      backgroundColor={darkColors.gray2}
      foregroundColor={darkColors.gray3}
      {...props}
    >
      <circle cx="18" cy="26" r="14" />
      <rect x="50" y="18" width="160" height="18" rx="4" />
    </ContentLoader>
  </Card>
);
