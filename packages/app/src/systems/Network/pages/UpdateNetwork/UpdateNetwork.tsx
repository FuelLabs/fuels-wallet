import { Box, Button, Dialog, Focus, IconButton, Icon } from '@fuel-ui/react';

import type { NetworkFormValues } from '~/systems/Network';
import { NetworkForm, useNetworkForm, useNetworks } from '~/systems/Network';

export function UpdateNetwork() {
  const { network, isLoading, handlers } = useNetworks();

  const form = useNetworkForm({
    defaultValues: network,
  });

  function onSubmit(data: NetworkFormValues) {
    handlers.updateNetwork({ id: network?.id as string, data });
  }

  return (
    <Box as="form" onSubmit={form.handleSubmit(onSubmit)}>
      <Dialog.Heading>
        Update Network
        <IconButton
          data-action="closed"
          variant="link"
          icon={<Icon icon="X" color="intentsBase8" />}
          aria-label="Close update network"
          onPress={handlers.closeDialog}
        />
      </Dialog.Heading>
      <Dialog.Description as="div">
        <Focus.Scope contain autoFocus>
          <NetworkForm form={form} isEditing />
        </Focus.Scope>
      </Dialog.Description>
      <Dialog.Footer>
        <Button
          color="intentsBase"
          variant="ghost"
          onPress={handlers.openNetworks}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          color="accent"
          isDisabled={!form.formState.isValid}
          isLoading={isLoading}
          leftIcon={Icon.is('Plus')}
          aria-label="Update network"
        >
          Update
        </Button>
      </Dialog.Footer>
    </Box>
  );
}
