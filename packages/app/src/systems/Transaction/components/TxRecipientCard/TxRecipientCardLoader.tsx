import { darkColors } from '@fuel-ui/css';
import { Card } from '@fuel-ui/react';
import type { IContentLoaderProps } from 'react-content-loader';
import ContentLoader from 'react-content-loader';

export const TxRecipientCardLoader = (props: IContentLoaderProps) => (
  <Card>
    <ContentLoader
      style={{ border: 0 }}
      speed={2}
      width={149}
      height={154}
      viewBox="0 0 149 156"
      backgroundColor={darkColors.gray2}
      foregroundColor={darkColors.gray3}
      {...props}
    >
      <rect x="48" y="16" width="56" height="20" rx="4" />
      <rect x="48" y="48" width="56" height="56" rx="28" />
      <rect x="35" y="120" width="80" height="20" rx="4" />
    </ContentLoader>
  </Card>
);
