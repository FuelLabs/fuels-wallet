import { darkColors } from '@fuel-ui/css';
import type { IContentLoaderProps } from 'react-content-loader';
import ContentLoader from 'react-content-loader';

import { BalanceWidgetWrapper } from './BalanceWidget';

export const BalanceWidgetLoader = (props: IContentLoaderProps) => (
  <BalanceWidgetWrapper>
    <ContentLoader
      speed={2}
      width={320}
      height={88}
      viewBox="0 0 320 88"
      backgroundColor={darkColors.gray3}
      foregroundColor={darkColors.gray4}
      {...props}
    >
      <circle cx="25" cy="25" r="25" />
      <rect x="63" y="25" rx="4" ry="4" width="107" height="14" />
      <rect x="63" y="50" rx="4" ry="4" width="137" height="20" />
    </ContentLoader>
  </BalanceWidgetWrapper>
);
