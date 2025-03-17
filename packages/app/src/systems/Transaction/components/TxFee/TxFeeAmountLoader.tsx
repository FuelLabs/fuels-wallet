import type { ContentLoaderProps } from '@fuel-ui/react';
import { ContentLoader } from '@fuel-ui/react';

export const TxFeeAmountLoader = (props: ContentLoaderProps) => (
  <ContentLoader width={'100%'} height={24} {...props}>
    <rect x="40" y="7" width="45" height="15" rx="4" />
    <rect x="90" y="7" width="130" height="15" rx="4" />
  </ContentLoader>
);
