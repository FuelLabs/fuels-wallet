import { cssObj } from '@fuel-ui/css';
import { Alert, Link, Stack, Text } from '@fuel-ui/react';
import { getBlockExplorerLink } from '@fuel-wallet/sdk';
import type { FC } from 'react';
import { useMemo } from 'react';

import { getTxStatusColor, Status } from '../../utils';

export type TxStatusAlertProps = {
  txStatus?: Status;
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
    if (txStatus === Status.pending) return 'warning';
    if (txStatus === Status.success) return 'success';
    if (txStatus === Status.failure || error) return 'error';

    return 'info';
  }, [txStatus, error]);

  const txColor = error
    ? getTxStatusColor(Status.failure)
    : getTxStatusColor(txStatus);

  return (
    <Alert
      key={txStatus || error}
      direction="row"
      status={alertStatus}
      css={styles.root(txColor)}
    >
      <Alert.Description>
        <Stack gap="$4">
          <Text fontSize="sm">
            {txStatus === Status.pending &&
              'Your transaction is still pending, you can close this window if you want.'}
            {txStatus === Status.failure &&
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
    '&:focus-visible': {
      outline: 'none',
    },
    fontSize: '$sm',
  }),
};
