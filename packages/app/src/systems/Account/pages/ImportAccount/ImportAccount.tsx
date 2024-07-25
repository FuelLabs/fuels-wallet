import { Alert, Box, Button, Dialog, Icon } from '@fuel-ui/react';
import { styles } from '~/systems/Core';
import { OverlayDialogTopbar } from '~/systems/Overlay';

import { cssObj } from '@fuel-ui/css';
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
    <Box.Stack
      gap="$4"
      as="form"
      onSubmit={form.handleSubmit(onSubmit)}
      autoComplete="off"
    >
      <OverlayDialogTopbar onClose={accountsHandlers.closeDialog}>
        Import Account
      </OverlayDialogTopbar>
      <Dialog.Description as="div" css={styles.content}>
        <ImportAccountForm form={form} isLoading={isLoading} />
        <Alert
          status="warning"
          aria-label="Non-recoverable account warning"
          css={cssObj({ margin: '$2 0' })}
        >
          <Alert.Description>
            Imported accounts using a private key are not recoverable via your
            wallet's seed phrase.
          </Alert.Description>
        </Alert>
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
