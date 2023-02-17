import { Box, Button, Dialog, Focus, Icon, IconButton } from '@fuel-ui/react';

import type { NetworkFormValues } from '~/systems/Network';
import { NetworkForm, useNetworks, useNetworkForm } from '~/systems/Network';

export function AddNetwork() {
  const form = useNetworkForm();
  const { handlers, isLoading } = useNetworks();

  function onSubmit(data: NetworkFormValues) {
    handlers.addNetwork({ data });
  }

  return (
    <Box as="form" onSubmit={form.handleSubmit(onSubmit)}>
      <Dialog.Heading>
        Add Network
        <IconButton
          data-action="closed"
          variant="link"
          icon={<Icon icon="X" color="gray8" />}
          aria-label="Close add network"
          onPress={handlers.closeDialog}
        />
      </Dialog.Heading>
      <Dialog.Description as="div">
        <Focus.Scope contain autoFocus>
          <NetworkForm form={form} />
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
          leftIcon={Icon.is('Plus')}
          aria-label="Create new network"
        >
          Create
        </Button>
      </Dialog.Footer>
    </Box>
  );
}
