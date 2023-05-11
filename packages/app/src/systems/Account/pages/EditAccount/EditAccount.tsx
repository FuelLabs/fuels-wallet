import { Box, Button, Dialog, Focus, Icon, IconButton } from '@fuel-ui/react';

import { AccountForm } from '../../components';
import { useAccounts, useEditAccount } from '../../hooks';
import { useAccountForm } from '../../hooks/useAccountForm';
import type { AccountFormValues } from '../../hooks/useAccountForm';

export const EditAccount = () => {
  const { accounts, handlers: accountsHandlers } = useAccounts();
  const { account, handlers, isLoading } = useEditAccount();
  const form = useAccountForm({
    accounts,
    defaultValues: {
      name: account?.name || '',
    },
  });

  function onSubmit(data: AccountFormValues) {
    if (!account) return;
    const { name } = data;
    handlers.updateAccountName({ address: account.address, data: { name } });
  }

  return (
    <Box as="form" onSubmit={form.handleSubmit(onSubmit)}>
      <Dialog.Heading>
        Edit Account
        <IconButton
          data-action="closed"
          variant="link"
          icon={<Icon icon="X" color="intentsBase8" />}
          aria-label="Close edit account"
          onPress={accountsHandlers.closeDialog}
        />
      </Dialog.Heading>
      <Dialog.Description as="div">
        <Focus.Scope contain autoFocus>
          <AccountForm form={form} isLoading={isLoading} />
        </Focus.Scope>
      </Dialog.Description>
      <Dialog.Footer>
        <Button
          color="intentsBase"
          variant="ghost"
          onPress={accountsHandlers.goToList}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          color="accent"
          isDisabled={!form.formState.isValid}
          isLoading={isLoading}
          leftIcon={Icon.is('Edit')}
          aria-label="Edit account"
        >
          Edit
        </Button>
      </Dialog.Footer>
    </Box>
  );
};
