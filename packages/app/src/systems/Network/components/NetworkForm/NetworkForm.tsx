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

import { useEffect, useState } from 'react';
import { useWatch } from 'react-hook-form';
import type { UseNetworkFormReturn } from '../../hooks';

const MotionInput = motion(Input);
const MotionButton = motion(Button);

export type NetworkFormProps = {
  form: UseNetworkFormReturn;
  isEditing: boolean;
  isLoading?: boolean;
  onClickReview?: () => void;
  isValid?: boolean;
  providerChainId?: number;
  isReviewing?: boolean;
  chainName?: string;
};

export function NetworkForm({
  form,
  isEditing,
  isLoading,
  isValid,
  isReviewing,
  chainName,
}: NetworkFormProps) {
  const [isFirstShownTestConnectionBtn, setIsFirstShownTestConnectionBtn] =
    useState(false);
  const { control, formState, setValue } = form;

  const url = useWatch({ control, name: 'url' });
  const chainId = useWatch({ control, name: 'chainId' });
  const customName = useWatch({ control, name: 'name' });

  useEffect(() => {
    if (isReviewing && chainName) {
      setValue('name', chainName);
    }
  }, [isReviewing, chainName, setValue]);

  useEffect(() => {
    if (isValid && chainId) {
      setIsFirstShownTestConnectionBtn(true);
    }
  }, [isValid, chainId]);

  return (
    <Box.Stack css={{ width: '100%' }} gap="$4">
      {isReviewing && (
        <>
          <NetworkReviewCard
            headerText="You're adding this network"
            name={customName || chainName || ''}
            chainId={chainId}
            url={url}
          />
          <ControlledField
            control={control}
            name="name"
            label={
              <HelperIcon message="Customize the network name to avoid naming conflicts">
                Network Name
              </HelperIcon>
            }
            isRequired
            isInvalid={Boolean(formState.errors?.name)}
            render={({ field }) => (
              <MotionInput {...animations.slideInTop()}>
                <Input.Field
                  {...field}
                  id="network-name"
                  aria-label="Network name"
                  placeholder={chainName || 'Enter network name'}
                />
              </MotionInput>
            )}
          />
          {formState.errors?.name && (
            <Form.ErrorMessage>
              {formState.errors.name.message}
            </Form.ErrorMessage>
          )}
        </>
      )}
      {!isReviewing && (
        <>
          <ControlledField
            control={control}
            name="url"
            css={styles.url}
            isDisabled={isEditing || isLoading}
            isRequired
            isInvalid={Boolean(formState.errors?.url)}
            label={
              <HelperIcon message="Enter the provider URL for your network">
                URL
              </HelperIcon>
            }
            render={({ field }) => (
              <MotionInput {...animations.slideInTop()}>
                <Input.Field
                  aria-label="Network URL"
                  placeholder="Enter your network's provider URL"
                  {...field}
                />
              </MotionInput>
            )}
          />
          <ControlledField
            control={control}
            name="chainId"
            css={styles.chainId}
            isDisabled={!!isEditing || !!isLoading}
            isInvalid={Boolean(formState.errors?.chainId)}
            label={
              <HelperIcon message="For enhanced security, please enter the chain ID manually.">
                Chain ID
              </HelperIcon>
            }
            render={({ field }) => (
              <MotionInput {...animations.slideInTop()}>
                <Input.Field
                  {...field}
                  id="network-chain-id"
                  aria-label="Chain ID"
                  placeholder="Enter the network's chain ID"
                />
              </MotionInput>
            )}
          />
          {!!formState.errors?.chainId && (
            <Form.ErrorMessage aria-label="Error message">
              {formState.errors?.chainId?.message}
            </Form.ErrorMessage>
          )}
          {!isEditing && isFirstShownTestConnectionBtn && (
            <MotionButton
              {...animations.slideInTop()}
              isDisabled={!isValid}
              type="submit"
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
                  placeholder="Enter the name of the network"
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
                  placeholder="e.g., https://explorer.fuel.network/graphql"
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
    mb: '$2',
    'input[aria-disabled="true"]': {
      opacity: 0.5,
    },
  }),
};
