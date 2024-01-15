import { Box, Button, Dialog, Focus, Icon } from '@fuel-ui/react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { animations, styles } from '~/systems/Core';
import type { NetworkFormValues } from '~/systems/Network';
import {
  NetworkForm,
  useNetworks,
  useNetworkForm,
  useChainInfo,
} from '~/systems/Network';
import { OverlayDialogTopbar } from '~/systems/Overlay';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionStack = motion<any>(Box.Stack);

export function AddNetwork() {
  const form = useNetworkForm();
  const { isDirty, invalid } = form.getFieldState('url', form.formState);
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
      gap="$4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <OverlayDialogTopbar onClose={handlers.closeDialog}>
        Add Network
      </OverlayDialogTopbar>
      <Dialog.Description as="div" css={styles.content}>
        <Focus.Scope autoFocus>
          <NetworkForm
            form={form}
            isEditing={false}
            isLoading={isLoadingChainInfo}
          />
        </Focus.Scope>
      </Dialog.Description>
      <Dialog.Footer>
        <Button variant="ghost" onClick={handlers.openNetworks}>
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
