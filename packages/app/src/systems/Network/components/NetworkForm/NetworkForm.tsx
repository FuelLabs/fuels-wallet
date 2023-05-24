import { cssObj } from '@fuel-ui/css';
import {
  Input,
  HelperIcon,
  Card,
  Text,
  Button,
  Spinner,
  Box,
} from '@fuel-ui/react';
import { motion } from 'framer-motion';

import type { UseNetworkFormReturn } from '../../hooks';

import { animations, ControlledField } from '~/systems/Core';

const MotionCard = motion(Card);
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
        <MotionCard {...animations.slideInTop()}>
          <Card.Header css={styles.cardHeader} justify="space-between">
            <Text css={styles.cardHeaderText}>
              You&apos;re adding this network
            </Text>
            <Button size="xs" variant="link" onPress={onChangeUrl}>
              Change URL
            </Button>
          </Card.Header>
          <Card.Body css={{ p: '$3' }}>
            <Text as="h2">{name}</Text>
            <Text fontSize="sm">{url}</Text>
          </Card.Body>
        </MotionCard>
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
  cardHeader: cssObj({
    px: '$3',
    py: '$2',
  }),
  cardHeaderText: cssObj({
    fontSize: '$sm',
    fontWeight: '$normal',
  }),
  url: cssObj({
    'input[aria-disabled="true"]': {
      opacity: 0.5,
    },
  }),
};
