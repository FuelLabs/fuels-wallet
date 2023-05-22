import { Box, Button, Dialog, Icon, IconButton } from '@fuel-ui/react';

import { ImportAccountForm } from '../../components/ImportAccountForm';
import { useAccounts, useImportAccount } from '../../hooks';
import { useImportAccountForm } from '../../hooks/useImportAccountForm';
import type { ImportAccountFormValues } from '../../hooks/useImportAccountForm';

export const ImportAccount = () => {
  const { accounts, handlers: accountsHandlers } = useAccounts();
  const { handlers, isLoading } = useImportAccount();
  const form = useImportAccountForm({ accounts });

  function onSubmit(data: ImportAccountFormValues) {
    handlers.importAccount(data);
  }

  return (
    <Box.Stack gap="$6" as="form" onSubmit={form.handleSubmit(onSubmit)}>
      <Dialog.Heading>
        Import Account
        <IconButton
          data-action="closed"
          variant="link"
          icon={<Icon icon="X" color="intentsBase8" />}
          aria-label="Close unlock window"
          onPress={accountsHandlers.closeDialog}
        />
      </Dialog.Heading>
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
