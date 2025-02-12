import { cssObj } from '@fuel-ui/css';
import { Box, ContentLoader } from '@fuel-ui/react';

export function NFTImageLoading({ size = 89 }: { size?: number }) {
  return (
    <Box
      css={cssObj({
        overflow: 'hidden',
        borderRadius: '10px',
        width: `${size}px`,
        height: `${size}px`,
      })}
    >
      <ContentLoader width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <rect x="0" y="0" rx="0" ry="0" width={size} height={size} />
      </ContentLoader>
    </Box>
  );
}
