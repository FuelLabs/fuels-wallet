import { cssObj } from '@fuel-ui/css';
import { Alert, Link } from '@fuel-ui/react';

import { useFuelWeb3 } from '~/src/hooks/useFuelWeb3';

export function ConnectionAlert() {
  const [, notDetected] = useFuelWeb3();
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

    '.fuel_alert--content': {
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
