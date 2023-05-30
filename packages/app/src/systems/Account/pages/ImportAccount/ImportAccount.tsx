import { Box, Button, Dialog, Icon } from '@fuel-ui/react';

import { ImportAccountForm } from '../../components/ImportAccountForm';
import { useAccounts, useImportAccount } from '../../hooks';
import { useImportAccountForm } from '../../hooks/useImportAccountForm';
import type { ImportAccountFormValues } from '../../hooks/useImportAccountForm';

import { OverlayDialogTopbar } from '~/systems/Overlay';

export const ImportAccount = () => {
  const { accounts, handlers: accountsHandlers } = useAccounts();
  const { handlers, isLoading } = useImportAccount();
  const form = useImportAccountForm({ accounts });

  function onSubmit(data: ImportAccountFormValues) {
    handlers.importAccount(data);
  }

  return (
    <Box.Stack gap="$4" as="form" onSubmit={form.handleSubmit(onSubmit)}>
      <OverlayDialogTopbar onClose={accountsHandlers.closeDialog}>
        Import Account
      </OverlayDialogTopbar>
      <Dialog.Description as="div">
        <ImportAccountForm form={form} isLoading={isLoading} />
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
          aria-label="Import"
        >
          Import
        </Button>
      </Dialog.Footer>
    </Box.Stack>
  );
};
