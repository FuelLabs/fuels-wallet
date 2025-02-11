import { cssObj } from '@fuel-ui/css';
import { ContentLoader } from '@fuel-ui/react';

export function NFTImageLoading({ height = 89 }: { height?: number }) {
  return (
    <ContentLoader
      width="100%"
      height={height ?? '100%'}
      viewBox={`0 0 22 ${height}`}
      style={cssObj({
        borderRadius: '12px',
      })}
    >
      <rect x="0" y="0" rx="0" ry="0" width="22" height="89" />
    </ContentLoader>
  );
}
