import { cssObj } from '@fuel-ui/css';
import { Box, Flex, Icon, Spinner } from '@fuel-ui/react';

import type { TxRecipientAddress } from '../../types';
import { TxState } from '../../types';
import { TxRecipientCard } from '../TxRecipientCard';

type TxSpinnerProps = {
  state?: TxState;
};

function TxSpinner({ state = TxState.default }: TxSpinnerProps) {
  return (
    <Box css={styles.spinner(state)}>
      {state === TxState.default && (
        <Icon icon={Icon.is('ArrowRight')} size={18} />
      )}
      {state === TxState.pending && <Spinner color="$amber3" size={18} />}
      {state === TxState.success && <Icon icon={Icon.is('Check')} size={18} />}
      {state === TxState.failed && <Icon icon={Icon.is('X')} size={18} />}
    </Box>
  );
}

export type TxFromToProps = {
  state?: TxState;
  from: TxRecipientAddress;
  to: TxRecipientAddress;
};

export function TxFromTo({ from, to, state = TxState.default }: TxFromToProps) {
  const isLoading = state === TxState.pending;
  return (
    <Flex css={styles.root}>
      <TxSpinner state={state} />
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
    display: 'inline-flex',
  }),
  spinner: (state: TxState) =>
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
      ...(state === TxState.default && {
        background: '$gray1',
        color: '$gray8',
      }),
      ...(state === TxState.success && {
        background: '$accent11',
        color: '$accent3',
      }),
      ...(state === TxState.failed && {
        background: '$red9',
        color: '$red3',
      }),
      ...(state === TxState.pending && {
        background: '$amber9',
        color: '$amber3',
      }),
    }),
};
