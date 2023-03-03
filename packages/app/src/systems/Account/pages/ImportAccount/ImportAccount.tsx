import { Box, Button, Dialog, Icon, IconButton } from '@fuel-ui/react';

import { ImportAccountForm } from '../../components/ImportAccountForm';
import { useAccounts } from '../../hooks';
import { useImportAccountForm } from '../../hooks/useImportAccountForm';
import type { ImportAccountFormValues } from '../../hooks/useImportAccountForm';

export const ImportAccount = () => {
  const { handlers, isLoading, status } = useAccounts();
  const form = useImportAccountForm();

  function onSubmit(data: ImportAccountFormValues) {
    handlers.importAccount(data.privateKey);
  }

  return (
    <Box as="form" onSubmit={form.handleSubmit(onSubmit)}>
      <Dialog.Heading>
        Import Account
        <IconButton
          data-action="closed"
          variant="link"
          icon={<Icon icon="X" color="gray8" />}
          aria-label="Close unlock window"
          onPress={handlers.closeDialog}
        />
      </Dialog.Heading>
      <Dialog.Description as="div">
        <ImportAccountForm form={form} isLoading={status('loading')} />
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
          Import
        </Button>
      </Dialog.Footer>
    </Box>
  );
};
