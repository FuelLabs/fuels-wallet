import { Box, Button, Dialog, Focus, Icon, IconButton } from '@fuel-ui/react';

import { AccountForm } from '../../components';
import { useAccounts } from '../../hooks';
import { useAccountForm } from '../../hooks/useAccountForm';
import type { AccountFormValues } from '../../hooks/useAccountForm';

export const EditAccount = () => {
  const { address, handlers, isLoading, status, ...ctx } = useAccounts();
  const selectedAccount = ctx.accounts?.find((a) => a.address === address);
  const form = useAccountForm({
    accounts: ctx.accounts,
    defaultValues: {
      name: selectedAccount?.name || '',
    },
  });

  function onSubmit(data: AccountFormValues) {
    if (!address) return;
    const { name } = data;
    handlers.updateAccountName({ data: { address, name } });
  }

  return (
    <Box as="form" onSubmit={form.handleSubmit(onSubmit)}>
      <Dialog.Heading>
        Edit Account
        <IconButton
          data-action="closed"
          variant="link"
          icon={<Icon icon="X" color="gray8" />}
          aria-label="Close edit account"
          onPress={handlers.closeDialog}
        />
      </Dialog.Heading>
      <Dialog.Description as="div">
        <Focus.Scope contain autoFocus>
          <AccountForm form={form} isLoading={status('loading')} />
        </Focus.Scope>
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
          leftIcon={Icon.is('Pencil')}
          aria-label="Edit account"
        >
          Edit
        </Button>
      </Dialog.Footer>
    </Box>
  );
};
