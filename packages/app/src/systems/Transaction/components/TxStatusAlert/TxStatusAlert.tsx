import { cssObj } from '@fuel-ui/css';
import { Alert, Link } from '@fuel-ui/react';
import { getBlockExplorerLink } from '@fuel-wallet/sdk';
import { SimplifiedTransactionStatusNameEnum } from 'fuels';
import type { FC } from 'react';
import { useMemo } from 'react';

import { getTxStatusColor } from '../../utils';

export type TxStatusAlertProps = {
  txStatus?: SimplifiedTransactionStatusNameEnum;
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
    if (txStatus === SimplifiedTransactionStatusNameEnum.submitted)
      return 'warning';
    if (txStatus === SimplifiedTransactionStatusNameEnum.success)
      return 'success';
    if (txStatus === SimplifiedTransactionStatusNameEnum.failure || error)
      return 'error';

    return 'info';
  }, [txStatus, error]);

  const txColor = error
    ? getTxStatusColor(SimplifiedTransactionStatusNameEnum.failure)
    : getTxStatusColor(txStatus);

  return (
    <Alert
      key={txStatus || error}
      direction="row"
      status={alertStatus}
      css={styles.root(txColor)}
    >
      <Alert.Description>
        {txStatus === SimplifiedTransactionStatusNameEnum.submitted &&
          'Your transaction is still pending, you can close this window if you want.'}
        {txStatus === SimplifiedTransactionStatusNameEnum.failure &&
          'Sorry, something wrong happened with your transaction.'}
        {error}
        {txId && (
          <Link
            aria-label="View Transaction on Block Explorer"
            isExternal
            css={{ ...styles.link, color: `$${txColor}` }}
            href={getBlockExplorerLink({
              path: `transaction/${txId}`,
              providerUrl,
            })}
          >
            Show on Fuel Explorer
          </Link>
        )}
      </Alert.Description>
    </Alert>
  );
};

const styles = {
  root: (color: string) => {
    const cssColor = color ? `$${color}` : undefined;
    return cssObj({
      '.fuel_Alert-icon': {
        alignSelf: 'flex-start',
        mt: '2px',
        color: cssColor,

        '& .fuel_Icon': {
          mt: '1px',
          color: cssColor,
        },
      },
      '& .fuel_Heading, & .fuel_Icon': {
        color: cssColor,
      },
      '& .fuel_Button': {
        p: 0,
        color: cssColor,
        fontWeight: '$normal',
      },
      '&:after': {
        background: cssColor,
      },
      '& .fuel_Alert-description': {
        display: 'flex',
        flexDirection: 'column',
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
