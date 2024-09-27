import { cssObj } from '@fuel-ui/css';
import { Box, Button, HelperIcon, Input, Spinner } from '@fuel-ui/react';
import { motion } from 'framer-motion';
import { ControlledField, animations } from '~/systems/Core';
import { NetworkReviewCard } from '~/systems/Network';

import { useEffect, useState } from 'react';
import type { UseNetworkFormReturn } from '../../hooks';

const MotionInput = motion(Input);
const MotionButton = motion(Button);

export type NetworkFormProps = {
  form: UseNetworkFormReturn;
  isEditing: boolean;
  isLoading?: boolean;
  onClickReview?: () => void;
  isValidUrl?: boolean;
};

export function NetworkForm({
  form,
  isEditing,
  isLoading,
  onClickReview,
  isValidUrl,
}: NetworkFormProps) {
  const [isFirstClickedReview, setIsFirstClickedReview] = useState(false);
  const [isFirstShownTestConnectionBtn, setIsFirstShownTestConnectionBtn] =
    useState(false);
  const { control, formState, getValues } = form;

  const name = getValues('name');
  const url = getValues('url');
  const showReview = !isEditing && name;

  function onChangeUrl() {
    form.setValue('name', '', { shouldValidate: true });
  }

  function onClickCheckNetwork() {
    setIsFirstClickedReview(true);
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
            hideError={!isFirstClickedReview}
            render={({ field }) => (
              <MotionInput {...animations.slideInTop()}>
                <Input.Field
                  {...field}
                  id="search-network-url"
                  aria-label="Network URL"
                  placeholder="https://node.fuel.network/graphql"
                />
              </MotionInput>
            )}
          />
          {!isEditing && isFirstShownTestConnectionBtn && (
            <MotionButton
              {...animations.slideInTop()}
              isDisabled={!isValidUrl}
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
};
