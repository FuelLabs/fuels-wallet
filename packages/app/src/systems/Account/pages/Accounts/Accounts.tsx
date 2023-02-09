import { Button, Dialog, Icon, IconButton } from '@fuel-ui/react';

import { AccountList } from '../../components';
import { useAccounts } from '../../hooks';

import { useOverlay } from '~/systems/Overlay';

export const Accounts = () => {
  const overlay = useOverlay();
  const { accounts, isLoading, handlers } = useAccounts();
  return (
    <>
      <Dialog.Heading>
        Accounts
        <IconButton
          data-action="closed"
          variant="link"
          icon={<Icon icon="X" color="gray8" />}
          aria-label="Close unlock window"
          onPress={overlay.close}
        />
      </Dialog.Heading>
      <Dialog.Description as="div">
        <AccountList
          isLoading={isLoading}
          accounts={accounts}
          onPress={handlers.setCurrentAccount}
        />
      </Dialog.Description>
      <Dialog.Footer>
        <Button
          aria-label="Add account"
          onPress={handlers.goToAdd}
          leftIcon={Icon.is('Plus')}
          variant="ghost"
        >
          Add new account
        </Button>
      </Dialog.Footer>
    </>
  );
};
