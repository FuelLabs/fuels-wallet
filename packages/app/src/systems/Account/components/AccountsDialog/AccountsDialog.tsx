import { cssObj } from '@fuel-ui/css';
import { Dialog } from '@fuel-ui/react';

import { useAccounts } from '../../hooks';
import { AccountScreen } from '../../machines';
import { AddAccount, Logout } from '../../pages';
import { Accounts } from '../../pages/Accounts';

import { UnlockContent } from '~/systems/Core';

export function AccountsDialog() {
  const { status, handlers, ...ctx } = useAccounts();
  const isUnlocking = status('unlocking') || status('unlockingLoading');

  return (
    <Dialog isOpen={ctx.isOpened}>
      <Dialog.Content css={styles.content}>
        {isUnlocking && (
          <UnlockContent
            unlockText="Add Account"
            unlockError={ctx.unlockError}
            onUnlock={handlers.unlock}
            isLoading={status('unlockingLoading')}
            onClose={handlers.closeModal}
          />
        )}
        {!isUnlocking && ctx.screen === AccountScreen.list && <Accounts />}
        {!isUnlocking && ctx.screen === AccountScreen.add && <AddAccount />}
        {!isUnlocking && ctx.screen === AccountScreen.logout && <Logout />}
      </Dialog.Content>
    </Dialog>
  );
}

const styles = {
  content: cssObj({
    width: '330px',
    height: '580px',
    maxWidth: '330px',
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
