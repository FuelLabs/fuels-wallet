import type { ContentLoaderProps } from '@fuel-ui/react';
import { ContentLoader } from '@fuel-ui/react';

export const TxFeeAmountLoader = (props: ContentLoaderProps) => (
  <ContentLoader width={100} height={20} viewBox="0 0 100 24" {...props}>
    <ContentLoader.Rect x="0" y="0" width="100" height="24" rx="4" />
  </ContentLoader>
);
