import { Box, Button, Dialog, Focus, Icon, IconButton } from '@fuel-ui/react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

import { animations } from '~/systems/Core';
import type { NetworkFormValues } from '~/systems/Network';
import {
  NetworkForm,
  useNetworks,
  useNetworkForm,
  useChainInfo,
} from '~/systems/Network';

const MotionStack = motion(Box.Stack);

export function AddNetwork() {
  const form = useNetworkForm();
  const { isDirty, invalid } = form.getFieldState('url');
  const isValidUrl = isDirty && !invalid;
  const { handlers, isLoading } = useNetworks();
  const {
    chainInfo,
    error: chainInfoError,
    isLoading: isLoadingChainInfo,
  } = useChainInfo(isValidUrl ? form.getValues('url') : undefined);

  useEffect(() => {
    if (isValidUrl && !isLoadingChainInfo && chainInfo) {
      form.setValue('name', chainInfo.name, { shouldValidate: true });
    }
  }, [chainInfo, isLoadingChainInfo, isValidUrl]);

  useEffect(() => {
    if (chainInfoError) {
      form.setError('url', {
        type: 'manual',
        message: 'Invalid network',
      });
    }
  }, [chainInfoError]);

  function onSubmit(data: NetworkFormValues) {
    handlers.addNetwork({ data });
  }

  return (
    <MotionStack
      {...animations.slideInTop()}
      as="form"
      gap="$6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Dialog.Heading>
        Add Network
        <IconButton
          data-action="closed"
          variant="link"
          icon={<Icon icon="X" color="intentsBase8" />}
          aria-label="Close add network"
          onPress={handlers.closeDialog}
        />
      </Dialog.Heading>
      <Dialog.Description as="div">
        <Focus.Scope autoFocus>
          <NetworkForm
            form={form}
            isEditing={false}
            isLoading={isLoadingChainInfo}
          />
        </Focus.Scope>
      </Dialog.Description>
      <Dialog.Footer>
        <Button variant="ghost" onPress={handlers.openNetworks}>
          Cancel
        </Button>
        <Button
          type="submit"
          intent="primary"
          isDisabled={!form.formState.isValid}
          isLoading={isLoading}
          leftIcon={Icon.is('Plus')}
          aria-label="Add new network"
        >
          Add
        </Button>
      </Dialog.Footer>
    </MotionStack>
  );
}
