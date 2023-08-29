import type { ContentLoaderProps } from '@fuel-ui/react';
import { Box, ContentLoader } from '@fuel-ui/react';

import { styles } from './styles';

export const AssetsAmountLoader = (props: ContentLoaderProps) => (
  <Box
    css={{
      ...styles.card,
      height: 48,
    }}
  >
    <ContentLoader
      width={'100%'}
      height={'100%'}
      viewBox="0 0 300 48"
      {...props}
    >
      <ContentLoader.Rect x="0" y="0" width="100" height="18" rx="4" />
      <ContentLoader.Rect
        x="0"
        y="0"
        stickY="bottom"
        width="125"
        height="18"
        rx="4"
      />
      <ContentLoader.Rect
        stickX="right"
        x="0"
        y="14"
        width="100"
        height="20"
        rx="4"
      />
    </ContentLoader>
  </Box>
);
