import { cssObj } from '@fuel-ui/css';
import { Alert, Link, Stack, Text } from '@fuel-ui/react';
import { getBlockExplorerLink } from '@fuel-wallet/sdk';
import type { FC } from 'react';
import { useMemo } from 'react';

import { getTxStatusColor, TxStatus } from '../../utils';

export type TxStatusAlertProps = {
  txStatus?: TxStatus;
  error?: string;
  txId?: string;
  providerUrl?: string;
};

export const TxStatusAlert: FC<TxStatusAlertProps> = ({
  txStatus,
  error,
  txId,
  providerUrl,
}) => {
  const alertStatus = useMemo(() => {
    if (txStatus === TxStatus.pending) return 'warning';
    if (txStatus === TxStatus.success) return 'success';
    if (txStatus === TxStatus.failure || error) return 'error';

    return 'info';
  }, [txStatus, error]);

  const txColor = error
    ? getTxStatusColor(TxStatus.failure)
    : getTxStatusColor(txStatus);

  return (
    <Alert
      key={txStatus || error}
      direction="row"
      status={alertStatus}
      css={styles.root(txColor)}
    >
      <Alert.Description>
        <Stack gap="$1">
          <Text fontSize="sm">
            {txStatus === TxStatus.pending &&
              'Your transaction is still pending, you can close this window if you want.'}
            {txStatus === TxStatus.failure &&
              'Sorry, something wrong happened with your transaction.'}
            {error}
          </Text>
          {txId && (
            <Link
              aria-label="View Transaction on Block Explorer"
              color={txColor}
              isExternal
              href={getBlockExplorerLink({
                path: `transaction/${txId}`,
                providerUrl,
              })}
              css={styles.link}
            >
              Show on Fuel Explorer
            </Link>
          )}
        </Stack>
      </Alert.Description>
    </Alert>
  );
};

const styles = {
  root: (color: string) => {
    const cssColor = color ? `$${color}` : undefined;
    // TODO: remove this overrides when https://github.com/FuelLabs/fuel-ui/issues/180 gets fixed in fuel-ui side
    return cssObj({
      '.fuel_alert--icon': {
        alignSelf: 'flex-start',
        mt: '2px',
        color: cssColor,
        '& .fuel_icon': {
          color: cssColor,
        },
      },
      '& .fuel_heading, & .fuel_icon': {
        color: cssColor,
      },
      '& .fuel_button': {
        p: 0,
        color: cssColor,
        fontWeight: '$semibold',
      },
      '&:after': {
        background: cssColor,
      },
    });
  },
  link: cssObj({
    fontSize: '$sm',
    '&:focus-visible': {
      outline: 'none',
    },
  }),
};
