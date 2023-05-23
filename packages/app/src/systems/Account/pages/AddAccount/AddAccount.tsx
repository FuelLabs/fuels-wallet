import { Box, Button, Dialog, Icon, IconButton } from '@fuel-ui/react';

import { AccountForm } from '../../components';
import { useAccounts, useAddAccount } from '../../hooks';
import { useAccountForm } from '../../hooks/useAccountForm';
import type { AccountFormValues } from '../../hooks/useAccountForm';

export const AddAccount = () => {
  const { accounts, handlers: accountsHandlers } = useAccounts();
  const { accountName, handlers, isLoading } = useAddAccount();
  const form = useAccountForm({
    accounts,
    defaultValues: {
      name: accountName || '',
    },
  });

  function onSubmit(data: AccountFormValues) {
    handlers.addAccount(data.name);
  }

  return (
    <Box.Stack gap="$4" as="form" onSubmit={form.handleSubmit(onSubmit)}>
      <Dialog.Heading>
        Add Account
        <IconButton
          data-action="closed"
          variant="link"
          icon={<Icon icon="X" color="intentsBase8" />}
          aria-label="Close unlock window"
          onPress={accountsHandlers.closeDialog}
        />
      </Dialog.Heading>
      <Dialog.Description as="div">
        <AccountForm form={form} isLoading={isLoading} />
      </Dialog.Description>
      <Dialog.Footer>
        <Button variant="ghost" onPress={accountsHandlers.goToList}>
          Cancel
        </Button>
        <Button
          type="submit"
          intent="primary"
          isDisabled={!form.formState.isValid}
          isLoading={isLoading}
          leftIcon={Icon.is('Plus')}
          aria-label="Create new account"
        >
          Create
        </Button>
      </Dialog.Footer>
    </Box.Stack>
  );
};
