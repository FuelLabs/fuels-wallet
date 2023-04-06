import { cssObj } from '@fuel-ui/css';
import { Button, Dialog, Icon, IconButton } from '@fuel-ui/react';

import { AccountList } from '../../components';
import { useAccounts } from '../../hooks';

import { coreStyles } from '~/systems/Core/styles';

export const Accounts = () => {
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
          onPress={handlers.setCurrentAccount}
          onExport={handlers.goToExport}
          onUpdate={handlers.goToEdit}
          onToggleHidden={handlers.toggleHideAccount}
        />
      </Dialog.Description>
      <Dialog.Footer css={styles.footer}>
        <Button
          aria-label="Add account"
          onPress={handlers.goToAdd}
          leftIcon={Icon.is('Plus')}
          variant="ghost"
          size={'sm'}
          iconSize={14}
        >
          Add new account
        </Button>
        <Button
          aria-label="Import from private key"
          onPress={handlers.goToImport}
          leftIcon={Icon.is('LockLaminatedOpen')}
          variant="ghost"
          color="gray"
          size={'sm'}
          iconSize={14}
        >
          Add from private key
        </Button>
      </Dialog.Footer>
    </>
  );
};

const styles = {
  description: cssObj({
    ...coreStyles.scrollable('$gray3'),
    padding: '$4',
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
