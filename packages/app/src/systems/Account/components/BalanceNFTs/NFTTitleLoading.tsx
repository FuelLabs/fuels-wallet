import { cssObj } from '@fuel-ui/css';
import { Box, ContentLoader } from '@fuel-ui/react';

export function NFTTitleLoading({ height = 18 }: { height?: number }) {
  return (
    <Box
      css={cssObj({
        overflow: 'hidden',
        borderRadius: '6px',
        width: '89px',
        height: `${height}px`,
      })}
    >
      <ContentLoader
        width="89px"
        height={height ?? '100%'}
        viewBox={`0 0 89 ${height}`}
      >
        <rect x="0" y="0" rx="0" ry="0" width="89" height="18" />
      </ContentLoader>
    </Box>
  );
}
