import { cssObj } from '@fuel-ui/css';
import { Button, Dialog, Icon, IconButton } from '@fuel-ui/react';

import { AccountList } from '../../components';
import { useAccounts, useAddAccount } from '../../hooks';

import { coreStyles } from '~/systems/Core/styles';

export const Accounts = () => {
  const { accounts, canHideAccounts, hasHiddenAccounts, isLoading, handlers } =
    useAccounts();
  const { handlers: addAccountHandlers, isLoading: isAddingAccount } =
    useAddAccount();

  return (
    <>
      <Dialog.Heading>
        Accounts
        <IconButton
          data-action="closed"
          variant="link"
          icon={<Icon icon="X" color="intentsBase8" />}
          aria-label="Close unlock window"
          onPress={handlers.closeDialog}
        />
      </Dialog.Heading>
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
          Add from private key
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
    padding: '$0',
    flex: 1,

    '&[data-has-scroll="true"]': {
      padding: '$4 $2 $4 $4',
    },
  }),
  footer: cssObj({
    flexDirection: 'column',
    gap: '$2',
  }),
};
