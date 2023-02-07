import { cssObj } from '@fuel-ui/css';
import { Dialog } from '@fuel-ui/react';

import { WALLET_HEIGHT, WALLET_WIDTH } from '~/config';
import { useOverlay } from '~/systems/Overlay';
import { TxApprove } from '~/systems/Transaction';

export function TransactionDialog() {
  const overlay = useOverlay();

  return (
    <Dialog isOpen={overlay.is((val) => val.includes('transactions'))}>
      <Dialog.Content css={styles.content}>
        {overlay.is('transactions.approve') && <TxApprove />}
      </Dialog.Content>
    </Dialog>
  );
}

const styles = {
  content: cssObj({
    width: WALLET_WIDTH,
    height: WALLET_HEIGHT,
    maxWidth: WALLET_WIDTH,
    maxHeight: 'none',

    '.fuel_dialog--heading, .fuel_dialog--footer': {
      borderColor: '$gray2',
    },
    '.fuel_dialog--description': {
      flex: 1,
      overflowY: 'auto',
      height: '100%',
    },
    '.fuel_dialog--heading': cssObj({
      display: 'flex',
      justifyContent: 'space-between',
    }),
    '.fuel_dialog--footer': cssObj({
      button: {
        width: '100%',
      },
    }),
    form: cssObj({
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }),
    'button[data-action="closed"]': {
      px: '$1',
    },
  }),
};
