import { cssObj } from '@fuel-ui/css';
import { Alert, Link } from '@fuel-ui/react';

import { useFuel } from '../hooks/useFuel';

export function ConnectionAlert() {
  const [, notDetected] = useFuel();
  if (!notDetected) return null;
  return (
    <Alert status="warning" css={styles.alert}>
      <Alert.Description>{notDetected}</Alert.Description>
      <Alert.Actions>
        <Link
          download={true}
          href={process.env.NEXT_PUBLIC_WALLET_DOWNLOAD_URL}
        >
          Download Wallet
        </Link>
      </Alert.Actions>
    </Alert>
  );
}

const styles = {
  alert: cssObj({
    mb: '$8',

    '.fuel_Alert-content': {
      gap: '$0',
    },

    '&, &::after': {
      borderRadius: '$none',
    },

    a: {
      cursor: 'pointer',
    },
  }),
};
