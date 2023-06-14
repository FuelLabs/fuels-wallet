import { cssObj } from '@fuel-ui/css';
import { Box, Button } from '@fuel-ui/react';

export function DownloadFuelWallet() {
  return (
    <Box css={styles.root}>
      <a href={process.env.NEXT_PUBLIC_WALLET_DOWNLOAD_URL} download>
        <Button intent="primary">Download Fuel Wallet</Button>
      </a>
    </Box>
  );
}

const styles = {
  root: cssObj({
    pt: '2px',
    pb: '3px',
    px: '6px',
    borderRadius: '$md',
    fontFamily: 'monospace',
    color: '$intentsBase10',
    fontSize: '0.9rem',
  }),
};
