import { Box, HelperIcon, Input } from '@fuel-ui/react';
import { ControlledField } from '~/systems/Core';

import type { UseImportAccountFormReturn } from '../../hooks/useImportAccountForm';

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
              autoComplete="new-password"
              id="search-private-key"
              type="password"
              aria-label="Private Key"
              placeholder="Enter your private key"
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
          <HelperIcon message="Choose a name for your new account">
            Account Name
          </HelperIcon>
        }
        render={({ field }) => (
          <Input isDisabled={isLoading}>
            <Input.Field
              {...field}
              id="search-account-name"
              aria-label="Account Name"
              placeholder="Enter account name"
            />
          </Input>
        )}
      />
    </Box.Stack>
  );
};
