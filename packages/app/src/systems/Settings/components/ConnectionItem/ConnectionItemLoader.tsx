import { darkColors } from '@fuel-ui/css';
import { CardList } from '@fuel-ui/react';
import type { IContentLoaderProps } from 'react-content-loader';
import ContentLoader from 'react-content-loader';

export const ConnectionItemLoader = (props: IContentLoaderProps) => (
  <CardList.Item css={{ padding: 0 }}>
    <ContentLoader
      speed={2}
      width={316}
      height={60}
      viewBox="0 0 316 60"
      backgroundColor={darkColors.gray3}
      foregroundColor={darkColors.gray4}
      {...props}
    >
      <circle cx="32" cy="30" r="16" />
      <rect x="58" y="14" width="158" height="16" rx="5" />
      <rect x="58" y="36" width="112" height="10" rx="5" />
    </ContentLoader>
  </CardList.Item>
);
