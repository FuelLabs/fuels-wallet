import { ContentLoader, type ContentLoaderProps } from '@fuel-wallet/ui';

export const TxFeeAmountLoader = (props: ContentLoaderProps) => (
  <ContentLoader width={'100%'} height={24} {...props}>
    <rect x="8" y="8" width="48" height="12" />
    <rect x="64" y="8" width="120" height="12" />
  </ContentLoader>
);
