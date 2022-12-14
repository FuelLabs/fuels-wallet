import { cssObj } from '@fuel-ui/css';
import { Box, Flex, Icon, Spinner } from '@fuel-ui/react';

import type { TxRecipientAddress } from '../../types';
import { Status } from '../../utils';
import { TxRecipientCard } from '../TxRecipientCard';

type TxSpinnerProps = {
  status?: Status;
  isLoading?: boolean;
};

function TxSpinner({ status, isLoading }: TxSpinnerProps) {
  return (
    <Box css={styles.spinner({ status, isLoading })}>
      {status == null && !isLoading && (
        <Icon icon={Icon.is('ArrowRight')} size={18} />
      )}
      {(status === Status.pending || isLoading) && (
        <Spinner color="$amber3" size={18} aria-label="Loading Spinner" />
      )}
      {status === Status.success && <Icon icon={Icon.is('Check')} size={18} />}
      {status === Status.failure && <Icon icon={Icon.is('X')} size={18} />}
    </Box>
  );
}

export type TxFromToProps = {
  status?: Status;
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
  spinner: ({ status, isLoading }: { status?: Status; isLoading?: boolean }) =>
    cssObj({
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
      ...(status == null && {
        background: '$gray1',
        color: '$gray8',
      }),
      ...(status === Status.success && {
        background: '$accent11',
        color: '$accent3',
      }),
      ...(status === Status.failure && {
        background: '$red9',
        color: '$red3',
      }),
      ...((status === Status.pending || isLoading) && {
        background: '$amber9',
        color: '$amber3',
      }),
    }),
};
