import { Box, Button, Dialog, Focus, Icon } from '@fuel-ui/react';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { animations, styles } from '~/systems/Core';
import type { NetworkFormValues } from '~/systems/Network';
import {
  NetworkForm,
  useChainInfo,
  useNetworkForm,
  useNetworks,
} from '~/systems/Network';
import { OverlayDialogTopbar } from '~/systems/Overlay';

const MotionStack = motion(Box.Stack);

export function AddNetwork() {
  const { handlers, isLoading } = useNetworks();
  const {
    chainInfo,
    error: chainInfoError,
    isLoading: isLoadingChainInfo,
    handlers: chainInfoHandlers,
  } = useChainInfo();

  const step = chainInfo ? 2 : 1;

  const context = useMemo(
    () => ({
      providerChainId: chainInfo?.consensusParameters?.chainId?.toString(),
      step,
    }),
    [chainInfo, step]
  );

  const form = useNetworkForm({ context });
  const { isDirty, invalid } = form.getFieldState('url', form.formState);
  const isValidUrl = isDirty && !invalid;

  useEffect(() => {
    if (isValidUrl && !isLoadingChainInfo && chainInfo) {
      form.setValue('name', chainInfo.name, { shouldValidate: true });

      if (
        form.getValues('chainId') &&
        form.getValues('chainId') !==
          chainInfo.consensusParameters?.chainId.toString()
      ) {
        form.setError('chainId', {
          type: 'manual',
          message: 'Chain ID does not match the fetched value.',
        });
      }
    }
  }, [chainInfo, isLoadingChainInfo, isValidUrl, form]);

  useEffect(() => {
    if (chainInfoError) {
      form.setError('url', {
        type: 'manual',
        message: 'Invalid network or Chain ID mismatch.',
      });
    }
  }, [chainInfoError, form]);

  function onSubmit(data: NetworkFormValues) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    handlers.addNetwork({ data: data as any });
  }

  function onClickReview() {
    if (!isValidUrl) return;
    chainInfoHandlers.fetchChainInfo(form.getValues('url'));
  }

  return (
    <MotionStack
      {...animations.slideInTop()}
      as="form"
      gap="$4"
      onSubmit={form.handleSubmit(onSubmit)}
      autoComplete="off"
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
            onClickReview={onClickReview}
            isValidUrl={isValidUrl}
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
          isDisabled={!form.formState.isValid || step === 1}
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
