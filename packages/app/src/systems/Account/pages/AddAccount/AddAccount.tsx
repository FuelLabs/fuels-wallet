import { Box, Button, Dialog, Icon, IconButton } from '@fuel-ui/react';

import { AccountForm } from '../../components';
import { useAccounts } from '../../hooks';
import { useAccountForm } from '../../hooks/useAccountForm';
import type { AccountFormValues } from '../../hooks/useAccountForm';

export const AddAccount = () => {
  const { handlers, accounts, isLoading } = useAccounts();
  const form = useAccountForm({ accounts });

  function onSubmit(data: AccountFormValues) {
    handlers.addAccount(data.name);
  }

  return (
    <Box as="form" onSubmit={form.handleSubmit(onSubmit)}>
      <Dialog.Heading>
        Add Account
        <IconButton
          data-action="closed"
          variant="link"
          icon={<Icon icon="X" color="gray8" />}
          aria-label="Close unlock window"
          onPress={handlers.closeDialog}
        />
      </Dialog.Heading>
      <Dialog.Description as="div">
        <AccountForm form={form} />
      </Dialog.Description>
      <Dialog.Footer>
        <Button color="gray" variant="ghost" onPress={handlers.goToList}>
          Cancel
        </Button>
        <Button
          type="submit"
          color="accent"
          isDisabled={!form.formState.isValid}
          isLoading={isLoading}
          leftIcon={Icon.is('Plus')}
          aria-label="Create new account"
        >
          Create
        </Button>
      </Dialog.Footer>
    </Box>
  );
};
