import { darkColors } from '@fuel-ui/css';
import { CardList } from '@fuel-ui/react';
import type { IContentLoaderProps } from 'react-content-loader';
import ContentLoader from 'react-content-loader';

export const AssetItemLoader = (props: IContentLoaderProps) => (
  <CardList.Item css={{ padding: 0 }}>
    <ContentLoader
      speed={2}
      width={300}
      height={60}
      viewBox="0 0 300 60"
      backgroundColor={darkColors.gray3}
      foregroundColor={darkColors.gray4}
      {...props}
    >
      <circle cx="26" cy="30" r="18" />
      <rect x="56" y="12" rx="4" ry="4" width="92" height="14" />
      <rect x="56" y="36" rx="4" ry="4" width="62" height="14" />
      <rect x="194" y="24" rx="4" ry="4" width="92" height="14" />
    </ContentLoader>
  </CardList.Item>
);
