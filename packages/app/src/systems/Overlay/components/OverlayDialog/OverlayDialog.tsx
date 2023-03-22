import { cssObj } from '@fuel-ui/css';
import { Dialog } from '@fuel-ui/react';

import { WALLET_HEIGHT, WALLET_WIDTH } from '~/config';
import { AddAccount, EditAccount, Logout } from '~/systems/Account';
import { Accounts } from '~/systems/Account/pages/Accounts';
import { ImportAccount } from '~/systems/Account/pages/ImportAccount';
import { AddNetwork, Networks, UpdateNetwork } from '~/systems/Network/pages';
import { useOverlay } from '~/systems/Overlay';
import { TxApprove } from '~/systems/Transaction';

export function OverlayDialog() {
  const overlay = useOverlay();

  return (
    <Dialog isOpen={overlay.isDialogOpen}>
      <Dialog.Content css={styles.content}>
        {/* Accounts */}
        {overlay.is('accounts.list') && <Accounts />}
        {overlay.is('accounts.add') && <AddAccount />}
        {overlay.is('accounts.import') && <ImportAccount />}
        {overlay.is('accounts.edit') && <EditAccount />}
        {overlay.is('accounts.logout') && <Logout />}

        {/* Networks */}
        {overlay.is('networks.list') && <Networks />}
        {overlay.is('networks.add') && <AddNetwork />}
        {overlay.is('networks.update') && <UpdateNetwork />}

        {/* Transactions */}
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
    background: '$overlayBg',
    borderRadius: '$none',

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
