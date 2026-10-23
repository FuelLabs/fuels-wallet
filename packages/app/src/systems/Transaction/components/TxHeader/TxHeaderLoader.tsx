import { Box, ContentLoader, type ContentLoaderProps } from '@fuel-wallet/ui';

export const TxHeaderLoader = (props: ContentLoaderProps) => (
  <Box
    css={{
      height: 120,
      background: '$cardBg',
      boxShadow: 'inset 0 0 0 1px var(--fuel-line)',
    }}
  >
    <ContentLoader
      width={'100%'}
      height={'100%'}
      viewBox="0 0 300 120"
      preserveAspectRatio="none"
      {...props}
    >
      <rect x="16" y="14" width="24" height="12" />
      <rect x="194" y="14" width="90" height="12" />
      <rect x="0" y="40" width="300" height="1" />
      <rect x="16" y="54" width="48" height="12" />
      <rect x="214" y="54" width="70" height="12" />
      <rect x="0" y="80" width="300" height="1" />
      <rect x="16" y="94" width="32" height="12" />
      <rect x="234" y="94" width="50" height="12" />
    </ContentLoader>
  </Box>
);
