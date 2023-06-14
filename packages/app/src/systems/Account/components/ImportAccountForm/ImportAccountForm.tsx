import { Box, HelperIcon, Input } from '@fuel-ui/react';

import type { UseImportAccountFormReturn } from '../../hooks/useImportAccountForm';

import { ControlledField } from '~/systems/Core';

export type ImportAccountFormProps = {
  isLoading?: boolean;
  form: UseImportAccountFormReturn;
};

export const ImportAccountForm = ({
  form,
  isLoading,
}: ImportAccountFormProps) => {
  const { control, formState } = form;

  return (
    <Box.Stack css={{ width: '100%' }} gap="$4">
      <ControlledField
        control={control}
        name="privateKey"
        label="Private Key"
        isRequired
        isInvalid={Boolean(formState.errors?.privateKey)}
        render={({ field }) => (
          <Input isDisabled={isLoading}>
            <Input.Field
              {...field}
              aria-label="Private Key"
              placeholder="Enter the private key to import from"
            />
          </Input>
        )}
      />
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
          <Input isDisabled={isLoading}>
            <Input.Field
              {...field}
              aria-label="Account Name"
              placeholder="Type account name"
            />
          </Input>
        )}
      />
    </Box.Stack>
  );
};
