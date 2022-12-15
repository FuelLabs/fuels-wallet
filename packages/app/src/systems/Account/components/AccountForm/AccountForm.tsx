import { HelperIcon, Input, Stack } from '@fuel-ui/react';

import type { UseAccountFormReturn } from '../../hooks/useAccountForm';

import { ControlledField } from '~/systems/Core';

export type AccountFormProps = {
  form: UseAccountFormReturn;
};

export const AccountForm = ({ form }: AccountFormProps) => {
  const { control, formState } = form;

  return (
    <Stack css={{ width: '100%' }} gap="$4">
      <ControlledField
        control={control}
        name="name"
        isRequired
        isInvalid={Boolean(formState.errors?.name)}
        label={
          <HelperIcon message="The name for your new account">
            Account Name
          </HelperIcon>
        }
        render={({ field }) => (
          <Input>
            <Input.Field
              {...field}
              aria-label="Account Name"
              placeholder="Type account name"
            />
          </Input>
        )}
      />
    </Stack>
  );
};
