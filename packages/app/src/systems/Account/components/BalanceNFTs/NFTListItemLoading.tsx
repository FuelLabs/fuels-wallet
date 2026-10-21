import { cssObj, Box } from '@fuel-wallet/ui';
import { NFTImageLoading } from './NFTImageLoading';
import { NFTTitleLoading } from './NFTTitleLoading';

export function NFTListItemLoading() {
  return (
    <Box
      css={cssObj({
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      })}
    >
      <NFTImageLoading />
      <NFTTitleLoading />
    </Box>
  );
}
