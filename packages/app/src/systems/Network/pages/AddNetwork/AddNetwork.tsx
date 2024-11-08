import { Box, Button, Dialog, Focus, Icon } from '@fuel-ui/react';
import { motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { animations, styles } from '~/systems/Core';
import type { NetworkFormValues } from '~/systems/Network';
import { NetworkForm, useNetworkForm, useNetworks } from '~/systems/Network';
import { OverlayDialogTopbar } from '~/systems/Overlay';

const MotionStack = motion(Box.Stack);

export function AddNetwork() {
  const isEditing = false;
  const {
    handlers,
    isLoading,
    isReviewingAddNetwork,
    chainInfoToAdd,
    isLoadingChainInfo,
    chainInfoError,
  } = useNetworks();

  const context = useMemo(
    () => ({
      providerChainId: chainInfoToAdd?.consensusParameters?.chainId?.toNumber(),
      chainInfoError,
    }),
    [chainInfoToAdd?.consensusParameters?.chainId, chainInfoError]
  );

  const form = useNetworkForm({ context });
  const url = useWatch({ control: form.control, name: 'url' });
  const chainId = useWatch({ control: form.control, name: 'chainId' });
  const isValid =
    form.formState.isDirty &&
    form.formState.isValid &&
    !Object.keys(form.formState.errors ?? {}).length;

  useEffect(() => {
    if (chainId != null && url) {
      handlers.clearChainInfo();
    }
  }, [url, chainId, handlers.clearChainInfo]);

  useEffect(() => {
    if (chainInfoError) {
      form.trigger('url');
      form.trigger('chainId');
    }
  }, [chainInfoError, form]);

  function onSubmit(data: NetworkFormValues) {
    if (data.chainId == null || !data.url) {
      throw new Error('Missing required fields');
    }

    if (!isValid) return;
    handlers.validateAddNetwork({
      url: data.url,
      chainId: data.chainId.toString(),
    });
  }

  function onAddNetwork() {
    const name = chainInfoToAdd?.name || '';
    handlers.addNetwork({
      data: {
        chainId: Number(chainId),
        name,
        url,
      },
    });
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
            isEditing={isEditing}
            isLoading={isLoadingChainInfo}
            isValid={isValid}
            isReviewing={isReviewingAddNetwork}
            chainName={chainInfoToAdd?.name}
          />
        </Focus.Scope>
      </Dialog.Description>
      <Dialog.Footer>
        <Button variant="ghost" onPress={handlers.openNetworks}>
          Cancel
        </Button>
        <Button
          onPress={onAddNetwork}
          intent="primary"
          isDisabled={!isReviewingAddNetwork}
          isLoading={isLoading}
          leftIcon={<Icon icon="Plus" />}
          aria-label="Add new network"
        >
          Add
        </Button>
      </Dialog.Footer>
    </MotionStack>
  );
}
