import { cssObj } from '@fuel-ui/css';
import { Dialog } from '@fuel-ui/react';

import { useAccounts } from '../../hooks';
import { AddAccount, Logout } from '../../pages';
import { Accounts } from '../../pages/Accounts';

import { WALLET_HEIGHT, WALLET_WIDTH } from '~/config';
import { UnlockContent } from '~/systems/Core';
import { useOverlay } from '~/systems/Overlay';

export function AccountsDialog() {
  const overlay = useOverlay();
  const { status, handlers, ...ctx } = useAccounts();
  const isUnlocking = status('unlocking') || status('unlockingLoading');

  return (
    <Dialog isOpen={overlay.is((val) => val.includes('accounts'))}>
      <Dialog.Content css={styles.content}>
        {isUnlocking && (
          <UnlockContent
            unlockText="Add Account"
            unlockError={ctx.unlockError}
            onUnlock={handlers.unlock}
            isLoading={status('unlockingLoading')}
            onClose={overlay.close}
          />
        )}
        {!isUnlocking && overlay.is('accounts.list') && <Accounts />}
        {!isUnlocking && overlay.is('accounts.add') && <AddAccount />}
        {!isUnlocking && overlay.is('accounts.logout') && <Logout />}
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
