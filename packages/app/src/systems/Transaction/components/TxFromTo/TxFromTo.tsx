import { cssObj } from '@fuel-ui/css';
import { Box, Flex, Icon, Spinner } from '@fuel-ui/react';

import type { TxRecipientAddress } from '../../types';
import { TxStatus } from '../../utils';
import { TxRecipientCard } from '../TxRecipientCard';

import type { Maybe } from '~/systems/Core';

type TxSpinnerProps = {
  status?: Maybe<TxStatus>;
  isLoading?: boolean;
};

function TxSpinner({ status, isLoading }: TxSpinnerProps) {
  const spinnerStatus = isLoading ? TxStatus.pending : status;

  let spinnerEl;
  switch (spinnerStatus) {
    case TxStatus.pending:
      spinnerEl = (
        <Spinner color="$amber3" size={18} aria-label="Loading Spinner" />
      );
      break;
    case TxStatus.success:
      spinnerEl = <Icon icon={Icon.is('Check')} size={18} />;
      break;
    case TxStatus.failure:
      spinnerEl = <Icon icon={Icon.is('X')} size={18} />;
      break;
    default:
      spinnerEl = <Icon icon={Icon.is('ArrowRight')} size={18} />;
      break;
  }

  return (
    <Box css={styles.spinner} data-status={status} data-loading={isLoading}>
      {spinnerEl}
    </Box>
  );
}

export type TxFromToProps = {
  status?: Maybe<TxStatus>;
  from?: TxRecipientAddress;
  to?: TxRecipientAddress;
  isLoading?: boolean;
};

export function TxFromTo({ from, to, status, isLoading }: TxFromToProps) {
  return (
    <Flex css={styles.root}>
      <TxSpinner status={status} isLoading={isLoading} />
      {isLoading ? (
        <TxRecipientCard.Loader />
      ) : (
        <TxRecipientCard recipient={from} />
      )}
      {isLoading ? (
        <TxRecipientCard.Loader />
      ) : (
        <TxRecipientCard recipient={to} isReceiver />
      )}
    </Flex>
  );
}

const styles = {
  root: cssObj({
    gap: '$4',
    position: 'relative',
    display: 'flex',
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
    border: '3px solid $bodyColor',
    borderRadius: '$md',
    background: '$gray1',
    color: '$gray8',

    [`&[data-status="${TxStatus.success}"]`]: {
      background: '$accent11',
      color: '$accent3',
    },
    [`&[data-status="${TxStatus.failure}"]`]: {
      background: '$red9',
      color: '$red3',
    },
    [`&[data-status="${TxStatus.pending}"],
      &[data-loading="true"]`]: {
      background: '$amber9',
      color: '$amber3',
    },
  }),
};
