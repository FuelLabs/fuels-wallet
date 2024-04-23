import { cssObj } from '@fuel-ui/css';
import { Box, HelperIcon, Input, Spinner } from '@fuel-ui/react';
import { motion } from 'framer-motion';
import { ControlledField, animations } from '~/systems/Core';
import { NetworkReviewCard } from '~/systems/Network';

import type { UseNetworkFormReturn } from '../../hooks';

const MotionInput = motion(Input);

export type NetworkFormProps = {
  form: UseNetworkFormReturn;
  isEditing: boolean;
  isLoading?: boolean;
};

export function NetworkForm({ form, isEditing, isLoading }: NetworkFormProps) {
  const { control, formState, getValues } = form;

  const name = getValues('name');
  const url = getValues('url');
  const showReview = !isEditing && name;

  function onChangeUrl() {
    form.setValue('name', '', { shouldValidate: true });
  }

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
                {...field}
                id="search-network-url"
                aria-label="Network URL"
                placeholder="https://node.fuel.network/graphql"
              />
              {isLoading && (
                <Input.ElementRight>
                  <Spinner />
                </Input.ElementRight>
              )}
            </MotionInput>
          )}
        />
      )}
      {isEditing && (
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
