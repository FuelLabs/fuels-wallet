import { Stack, Input, HelperIcon } from '@fuel-ui/react';

import type { UseNetworkFormReturn } from '../../hooks';

import { ControlledField } from '~/systems/Core';

export type NetworkFormProps = {
  form: UseNetworkFormReturn;
};

export function NetworkForm({ form }: NetworkFormProps) {
  const { control, formState } = form;
  return (
    <Stack css={{ width: '100%' }} gap="$4">
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
      <ControlledField
        control={control}
        name="url"
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
              placeholder="URL of your network..."
            />
          </Input>
        )}
      />
    </Stack>
  );
}
