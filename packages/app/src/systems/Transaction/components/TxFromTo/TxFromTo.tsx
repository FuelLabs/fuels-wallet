import { cssObj } from '@fuel-ui/css';
import { Box, Icon, Spinner, Tooltip } from '@fuel-ui/react';
import { OperationName, SimplifiedTransactionStatusNameEnum } from 'fuels';

import type { TxRecipientAddress } from '../../types';
import { TxRecipientCard } from '../TxRecipientCard';

import type { Maybe } from '~/systems/Core';

type TxSpinnerProps = {
  status?: Maybe<SimplifiedTransactionStatusNameEnum>;
  isLoading?: boolean;
  operationName?: Maybe<OperationName>;
};

function TxSpinner({ status, isLoading, operationName }: TxSpinnerProps) {
  function getSpinnerData() {
    if (isLoading) {
      return {
        tooltip: 'Loading',
        iconEl: (
          <Spinner
            color="$intentsWarning3"
            size={18}
            aria-label="Loading Spinner"
          />
        ),
      };
    }
    switch (operationName) {
      case OperationName.contractCall:
        return {
          tooltip: 'Execute',
          iconEl: <Icon icon={Icon.is('PlayerPlay')} size={18} />,
        };

      default:
        return {
          tooltip: 'Transfer',
          iconEl: <Icon icon={Icon.is('ArrowRight')} size={18} />,
        };
    }
  }

  const spinnerData = getSpinnerData();

  return (
    <Box css={styles.spinner} data-status={status} data-loading={isLoading}>
      <Tooltip content={spinnerData.tooltip}>{spinnerData.iconEl}</Tooltip>
    </Box>
  );
}

export type TxFromToProps = {
  status?: Maybe<SimplifiedTransactionStatusNameEnum>;
  from?: TxRecipientAddress;
  to?: TxRecipientAddress;
  isLoading?: boolean;
  operationName?: Maybe<OperationName>;
};

export function TxFromTo({
  from,
  to,
  status,
  isLoading,
  operationName,
}: TxFromToProps) {
  return (
    <Box.Flex css={styles.root} className="TxFromTo">
      <TxSpinner
        status={status}
        isLoading={isLoading}
        operationName={operationName}
      />
      {isLoading && !from ? (
        <TxRecipientCard.Loader />
      ) : (
        <TxRecipientCard recipient={from} />
      )}
      {isLoading && !to ? (
        <TxRecipientCard.Loader />
      ) : (
        <TxRecipientCard recipient={to} isReceiver />
      )}
    </Box.Flex>
  );
}

const styles = {
  root: cssObj({
    position: 'relative',
    display: 'flex',

    '.TxRecipientCard:first-of-type': {
      borderRadius: '$default 0 0 0',
      borderRight: '1px solid $bodyBg',
    },
    '.TxRecipientCard:last-of-type': {
      borderRadius: '0 $default 0 0',
    },
  }),
  spinner: cssObj({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 40,
    height: 40,
    transform: 'translate(-50%, -50%)',
    border: '1px solid $bodyColor',
    borderRadius: '$md',
    background: '$intentsBase1',
    color: '$intentsBase8',

    [`&[data-status="${SimplifiedTransactionStatusNameEnum.success}"]`]: {
      background: '$accent11',
      color: '$accent3',
    },
    [`&[data-status="${SimplifiedTransactionStatusNameEnum.failure}"]`]: {
      background: '$intentsError9',
      color: '$intentsError3',
    },
    [`&[data-status="${SimplifiedTransactionStatusNameEnum.submitted}"], &[data-loading="true"]`]:
      {
        background: '$intentsWarning9',
        color: '$intentsWarning3',
      },
  }),
};
