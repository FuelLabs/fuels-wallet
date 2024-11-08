import { Box, Button, Dialog, Focus, Icon } from '@fuel-ui/react';
import { styles } from '~/systems/Core';
import type { NetworkFormValues } from '~/systems/Network';
import { NetworkForm, useNetworkForm, useNetworks } from '~/systems/Network';
import { OverlayDialogTopbar } from '~/systems/Overlay';

export function UpdateNetwork() {
  const { editingNetwork, isLoading, handlers } = useNetworks();

  const form = useNetworkForm({
    defaultValues: editingNetwork,
  });

  function onSubmit(data: NetworkFormValues) {
    if (!data.chainId == null) return;

    handlers.updateNetwork({
      id: editingNetwork?.id as string,
      data: {
        ...data,
        chainId: Number(data.chainId),
      },
    });
  }

  return (
    <Box.Stack
      gap="$4"
      as="form"
      onSubmit={form.handleSubmit(onSubmit)}
      autoComplete="off"
    >
      <OverlayDialogTopbar onClose={handlers.closeDialog}>
        Update Network
      </OverlayDialogTopbar>
      <Dialog.Description as="div" css={styles.content}>
        <Focus.Scope autoFocus>
          <NetworkForm form={form} isEditing />
        </Focus.Scope>
      </Dialog.Description>
      <Dialog.Footer>
        <Button
          variant="ghost"
          onPress={handlers.openNetworks}
          aria-label="Cancel network update"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          intent="primary"
          isDisabled={!form.formState.isValid}
          isLoading={isLoading}
          leftIcon={Icon.is('Plus')}
          aria-label="Update network"
        >
          Update
        </Button>
      </Dialog.Footer>
    </Box.Stack>
  );
}
