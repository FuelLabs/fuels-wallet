import { cssObj } from '@fuel-ui/css';
import { Alert, Link } from '@fuel-ui/react';
import { TransactionStatus } from 'fuels';
import type { FC } from 'react';
import { useMemo } from 'react';

import { useExplorerLink } from '../../hooks/useExplorerLink';
import { getTxStatusColor } from '../../utils';

export type TxStatusAlertProps = {
  txStatus?: TransactionStatus;
  error?: string;
  txId?: string;
};

export const TxStatusAlert: FC<TxStatusAlertProps> = ({
  txStatus,
  error,
  txId,
}) => {
  const { href } = useExplorerLink(txId);
  const alertStatus = useMemo(() => {
    if (txStatus === TransactionStatus.submitted) return 'warning';
    if (txStatus === TransactionStatus.success) return 'success';
    if (txStatus === TransactionStatus.failure || error) return 'error';

    return 'info';
  }, [txStatus, error]);

  const txColor = error
    ? getTxStatusColor(TransactionStatus.failure)
    : getTxStatusColor(txStatus);

  return (
    <Alert
      key={txStatus || error}
      direction="row"
      status={alertStatus}
      css={styles.root(txColor)}
    >
      <Alert.Description>
        {txStatus === TransactionStatus.submitted &&
          'Your transaction is still pending, you can close this window if you want.'}
        {txStatus === TransactionStatus.failure &&
          'Sorry, something wrong happened with your transaction.'}
        {error}
        {txId && href && (
          <Link
            aria-label="View Transaction on Block Explorer"
            isExternal
            css={{ ...styles.link, color: `$${txColor}` }}
            href={href}
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
      marginBottom: '$4',
      '.fuel_Alert-icon': {
        alignItems: 'center',
        mt: '2px',
        color: cssColor,
        marginBottom: '$0',

        '& .fuel_Icon': {
          mt: '1px',
          color: cssColor,
        },
      },
      '& .fuel_Alert-content': {
        alignItems: 'center',
        marginBottom: '$0',
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
