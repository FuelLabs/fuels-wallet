import { cssObj, Button, Dialog, Icon } from '@fuel-wallet/ui';
import { coreStyles } from '~/systems/Core/styles';
import { OverlayDialogTopbar } from '~/systems/Overlay';

import { AccountList } from '../../components';
import { useAccounts, useAddAccount } from '../../hooks';

export const Accounts = () => {
  const { accounts, canHideAccounts, hasHiddenAccounts, isLoading, handlers } =
    useAccounts();

  const { handlers: addAccountHandlers, isLoading: isAddingAccount } =
    useAddAccount();

  return (
    <>
      <OverlayDialogTopbar onClose={handlers.closeDialog}>
        Accounts
      </OverlayDialogTopbar>
      <Dialog.Description
        as="div"
        css={styles.description}
        data-has-scroll={Boolean((accounts || []).length >= 6)}
      >
        <AccountList
          isLoading={isLoading}
          accounts={accounts}
          canHideAccounts={canHideAccounts}
          hasHiddenAccounts={hasHiddenAccounts}
          onPress={handlers.setCurrentAccount}
          onExport={handlers.goToExport}
          onUpdate={handlers.goToEdit}
          onToggleHidden={handlers.toggleHideAccount}
        />
      </Dialog.Description>
      <Dialog.Footer css={styles.footer}>
        <Button
          aria-label="Import from private key"
          onPress={handlers.goToImport}
          leftIcon={Icon.is('LockOpen')}
          variant="ghost"
          iconSize={14}
        >
          Import from private key
        </Button>
        <Button
          intent="primary"
          aria-label="Add account"
          onPress={addAccountHandlers.addAccount}
          leftIcon={Icon.is('Plus')}
          iconSize={14}
          isLoading={isAddingAccount}
        >
          Add new account
        </Button>
      </Dialog.Footer>
    </>
  );
};

const styles = {
  description: cssObj({
    ...coreStyles.scrollable('$intentsBase3'),
    overflowY: 'scroll !important',
    /* The always-on 16px scrollbar gutter is the right inset, matching the left. */
    paddingLeft: '$4',
    paddingRight: '0 !important',
    flex: 1,
  }),
  footer: cssObj({
    flexDirection: 'column',
    gap: '$2',
  }),
};
