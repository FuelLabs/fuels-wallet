import { cssObj } from '@fuel-ui/css';
import { Dialog } from '@fuel-ui/react';
import { WALLET_HEIGHT, WALLET_WIDTH } from '~/config';
import { EditAccount, Logout } from '~/systems/Account';
import { Accounts } from '~/systems/Account/pages/Accounts';
import { ExportAccount } from '~/systems/Account/pages/ExportAccount';
import { ImportAccount } from '~/systems/Account/pages/ImportAccount';
import { AddNetwork, Networks, UpdateNetwork } from '~/systems/Network/pages';
import { useOverlay } from '~/systems/Overlay';
import { ViewSeedPhrase } from '~/systems/Settings/pages';
import { TxApprove } from '~/systems/Transaction';
import { ResetDialog } from '~/systems/Unlock/components/ResetDialog';

export function OverlayDialog() {
  const overlay = useOverlay();

  return (
    <Dialog isOpen={overlay.isDialogOpen} isBlocked={overlay.isDialogOpen}>
      <Dialog.Content css={styles.content}>
        {/* Accounts */}
        {overlay.is('accounts.list') && <Accounts />}
        {overlay.is('accounts.import') && <ImportAccount />}
        {overlay.is('accounts.export') && <ExportAccount />}
        {overlay.is('accounts.edit') && <EditAccount />}
        {overlay.is('accounts.logout') && <Logout />}
        {overlay.is('reset') && <ResetDialog />}

        {/* Networks */}
        {overlay.is('networks.list') && <Networks />}
        {overlay.is('networks.add') && <AddNetwork />}
        {overlay.is('networks.update') && <UpdateNetwork />}

        {/* Transactions */}
        {overlay.is('transactions.approve') && <TxApprove />}

        {/* Settings */}
        {overlay.is('settings.viewSeedPhrase') && <ViewSeedPhrase />}
      </Dialog.Content>
    </Dialog>
  );
}

const styles = {
  content: cssObj({
    padding: '$0',
    width: WALLET_WIDTH,
    height: WALLET_HEIGHT,
    maxWidth: WALLET_WIDTH,
    maxHeight: 'none',
    borderRadius: '$none',
    background: '$bodyColor',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '$4',

    '.fuel_Dialog-description': {
      flex: 1,
      overflowY: 'auto',
      height: '100%',
    },
    '.fuel_Dialog-heading': {
      padding: '$4',
      paddingBottom: '0 !important',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      textSize: 'lg',
      height: '$8',
    },
    '.fuel_Dialog-heading .fuel_IconButton[data-action="closed"]': {
      position: 'absolute',
      right: '$3',
      top: '24px',
    },
    '.fuel_Dialog-footer': {
      paddingTop: '0 !important',
      padding: '$4',
    },
    '.fuel_Dialog-footer button': {
      width: '100%',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    'button[data-action="closed"]': {
      px: '$1',
    },
  }),
};
