import { cssObj } from '@fuel-ui/css';
import { Button, Dialog, Icon, IconButton } from '@fuel-ui/react';

import { AccountList } from '../../components';
import { useAccounts } from '../../hooks';

import { coreStyles } from '~/systems/Core';

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

const styles = {
  description: cssObj({
    ...coreStyles.scrollable('$gray3'),
    padding: '$4',
    flex: 1,

    '&[data-has-scroll="true"]': {
      padding: '$4 $2 $4 $4',
    },
  }),
};
