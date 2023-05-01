import { cssObj } from '@fuel-ui/css';
import {
  Stack,
  Input,
  HelperIcon,
  Card,
  Text,
  Button,
  Spinner,
} from '@fuel-ui/react';

import type { UseNetworkFormReturn } from '../../hooks';

import { ControlledField } from '~/systems/Core';

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
    <Stack css={{ width: '100%' }} gap="$4">
      {showReview && (
        <Card>
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
        </Card>
      )}
      {!showReview && (
        <ControlledField
          control={control}
          name="url"
          isDisabled={isEditing || isLoading}
          isRequired
          isInvalid={Boolean(formState.errors?.url)}
          label={
            <HelperIcon message="The provider URL of your network">
              URL
            </HelperIcon>
          }
          render={({ field }) => (
            <Input>
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
            </Input>
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
    </Stack>
  );
}

const styles = {
  cardHeader: cssObj({
    px: '$3',
    py: '$2',
  }),
  cardHeaderText: cssObj({
    fontSize: '$sm',
    fontWeight: '$bold',
  }),
};
