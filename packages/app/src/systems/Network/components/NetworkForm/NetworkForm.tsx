import { cssObj } from '@fuel-ui/css';
import {
  Box,
  Button,
  Checkbox,
  Form,
  HelperIcon,
  Input,
  Tooltip,
} from '@fuel-ui/react';
import { motion } from 'framer-motion';
import { ControlledField, animations } from '~/systems/Core';
import { NetworkReviewCard } from '~/systems/Network';

import { useEffect, useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';
import type { UseNetworkFormReturn } from '../../hooks';

const MotionInput = motion(Input);
const MotionButton = motion(Button);

export type NetworkFormProps = {
  form: UseNetworkFormReturn;
  isEditing: boolean;
  isLoading?: boolean;
  onClickReview?: () => void;
  isValidUrl?: boolean;
  providerChainId?: number;
};

export function NetworkForm({
  form,
  isEditing,
  isLoading,
  onClickReview,
  isValidUrl,
  providerChainId,
}: NetworkFormProps) {
  const [isFirstShownTestConnectionBtn, setIsFirstShownTestConnectionBtn] =
    useState(false);
  const { control, formState, getValues, watch } = form;

  const name = getValues('name');
  const url = getValues('url');
  const acceptRisk = watch('acceptRisk');
  const chainId = getValues('chainId');
  const isValid = useMemo(
    () => formState.isValid && !Object.keys(formState.errors ?? {}).length,
    [formState.isValid, formState.errors]
  );
  const showReview = !isEditing && name && chainId != null && isValid;

  function onChangeUrl() {
    form.setValue('name', '', { shouldValidate: true });
    form.clearErrors();
  }

  async function onClickCheckNetwork() {
    onClickReview?.();
  }

  useEffect(() => {
    if (isValidUrl) {
      setIsFirstShownTestConnectionBtn(true);
    }
  }, [isValidUrl]);

  return (
    <Box.Stack css={{ width: '100%' }} gap="$4">
      {showReview && (
        <NetworkReviewCard
          headerText="You're adding this network"
          name={name}
          chainId={chainId != null ? chainId : providerChainId}
          onChangeUrl={onChangeUrl}
          url={url}
        />
      )}
      {!showReview && (
        <>
          <ControlledField
            control={control}
            name="url"
            css={styles.url}
            isDisabled={isEditing || isLoading}
            isRequired
            isInvalid={Boolean(formState.errors?.url)}
            label={
              <HelperIcon message="The provider URL of your network">
                URL
              </HelperIcon>
            }
            render={({ field }) => (
              <MotionInput {...animations.slideInTop()}>
                <Input.Field
                  aria-label="Network URL"
                  placeholder="https://node.fuel.network/graphql"
                  {...field}
                />
              </MotionInput>
            )}
          />

          <ControlledField
            control={control}
            name="chainId"
            css={styles.chainId}
            isDisabled={!!isEditing || !!isLoading || !!acceptRisk}
            isRequired={!acceptRisk}
            isInvalid={Boolean(formState.errors?.chainId)}
            label="Chain ID"
            tooltipContent="To enhance security of network identification, we ask you to inform the chainId manually."
            render={({ field }) => (
              <MotionInput {...animations.slideInTop()}>
                <Input.Field
                  {...field}
                  id="network-chain-id"
                  aria-label="Chain ID"
                  placeholder="Enter Chain ID"
                />
              </MotionInput>
            )}
          />
          {!acceptRisk && !!formState.errors?.chainId && (
            <Form.ErrorMessage aria-label="Error message">
              {formState.errors?.chainId?.message}
            </Form.ErrorMessage>
          )}

          {/* @TODO: Enable code bellow if users complain about not being able to use networks' chain id straight away.*/}
          {/* {!isEditing && (
            <Box css={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
              <Controller
                control={control}
                name="acceptRisk"
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    id="acceptRisk"
                    checked={!!value}
                    onCheckedChange={(checked) => onChange(checked as boolean)}
                    css={{
                      alignSelf: 'flex-start',
                      alignItems: 'flex-start',
                      display: 'flex',
                      marginTop: '$2',
                    }}
                  />
                )}
              />
              <Form.Label
                htmlFor="acceptRisk"
                css={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '$sm',
                }}
              >
                Accept risks and fetch Chain ID from the network URL
              </Form.Label>
            </Box>
          )} */}

          {!isEditing && isFirstShownTestConnectionBtn && (
            <MotionButton
              {...animations.slideInTop()}
              isDisabled={!isValidUrl || !isValid}
              onPress={onClickCheckNetwork}
              intent="primary"
              isLoading={isLoading}
              aria-label="Test connection"
            >
              Test connection
            </MotionButton>
          )}
        </>
      )}

      {isEditing && (
        <>
          <ControlledField
            control={control}
            name="name"
            label="Name"
            isRequired
            isInvalid={Boolean(formState.errors?.name)}
            render={({ field }) => (
              <Input>
                <Input.Field
                  {...field}
                  id="search-network-name"
                  aria-label="Network name"
                  placeholder="Name of your network..."
                />
              </Input>
            )}
          />
          <ControlledField
            control={control}
            name="explorerUrl"
            label="Explorer URL"
            isDisabled={isLoading}
            isInvalid={Boolean(formState.errors?.explorerUrl)}
            render={({ field }) => (
              <MotionInput {...animations.slideInTop()}>
                <Input.Field
                  {...field}
                  id="search-network-url"
                  aria-label="Explorer URL"
                  placeholder="https://explorer.fuel.network/graphql"
                />
              </MotionInput>
            )}
          />
        </>
      )}
    </Box.Stack>
  );
}

const styles = {
  url: cssObj({
    'input[aria-disabled="true"]': {
      opacity: 0.5,
    },
  }),
  chainId: cssObj({
    'input[aria-disabled="true"]': {
      opacity: 0.5,
    },
  }),
};
