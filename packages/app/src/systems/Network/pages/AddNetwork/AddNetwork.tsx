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
  const isEditing = false;
  const { handlers, isLoading } = useNetworks();
  const {
    chainInfo,
    error: chainInfoError,
    isLoading: isLoadingChainInfo,
    handlers: chainInfoHandlers,
  } = useChainInfo();

  const context = useMemo(
    () => ({
      providerChainId: chainInfo?.consensusParameters?.chainId?.toNumber(),
    }),
    [chainInfo?.consensusParameters?.chainId]
  );

  const form = useNetworkForm({ context });
  const { isDirty, invalid } = form.getFieldState('url', form.formState);
  const isValidUrl = isDirty && !invalid;
  const formChainId = form.getValues('chainId');

  useEffect(() => {
    if (isValidUrl && !isLoadingChainInfo && chainInfo) {
      form.setValue('name', chainInfo.name, { shouldValidate: true });

      // @TODO: When form.getValues('acceptRisk') is implemented add it to the if statement
      if (formChainId != null) {
        form.setValue(
          'chainId',
          chainInfo.consensusParameters?.chainId.toNumber()
        );
        return;
      }

      if (formChainId !== chainInfo.consensusParameters?.chainId.toNumber()) {
        form.setError('chainId', {
          type: 'manual',
          message: 'Chain ID does not match the fetched value.',
        });
      }
    }
  }, [chainInfo, isLoadingChainInfo, isValidUrl, form, formChainId]);

  useEffect(() => {
    if (chainInfoError) {
      form.setError('url', {
        type: 'manual',
        message: 'Invalid network or Chain ID mismatch.',
      });
    }
  }, [chainInfoError, form]);

  function onSubmit(data: NetworkFormValues) {
    if (!data.name || data.chainId == null || !data.url) {
      throw new Error('Missing required fields');
    }

    handlers.addNetwork({
      data: {
        name: data.name,
        url: data.url,
        chainId: data.chainId,
      },
    });
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
            onClickReview={onClickReview}
            isValidUrl={isValidUrl}
            providerChainId={chainInfo?.consensusParameters?.chainId?.toNumber()}
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
          isDisabled={!form.formState.isValid || !chainInfo}
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
