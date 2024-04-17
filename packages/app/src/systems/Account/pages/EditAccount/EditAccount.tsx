import { Box, Button, Dialog, Focus, Icon } from '@fuel-ui/react';
import { styles } from '~/systems/Core';
import { OverlayDialogTopbar } from '~/systems/Overlay';

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
    <Box.Stack
      gap="$4"
      as="form"
      onSubmit={form.handleSubmit(onSubmit)}
      autoComplete="off"
    >
      <OverlayDialogTopbar onClose={accountsHandlers.closeDialog}>
        Edit Account
      </OverlayDialogTopbar>
      <Dialog.Description as="div" css={styles.content}>
        <Focus.Scope autoFocus>
          <AccountForm form={form} isLoading={isLoading} />
        </Focus.Scope>
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
          leftIcon={Icon.is('Edit')}
          aria-label="Edit account"
        >
          Confirm
        </Button>
      </Dialog.Footer>
    </Box.Stack>
  );
};
