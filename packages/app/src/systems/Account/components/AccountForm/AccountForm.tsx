import { Box, HelperIcon, Input } from '@fuel-ui/react';
import { ControlledField } from '~/systems/Core';

import type { UseAccountFormReturn } from '../../hooks/useAccountForm';

export type AccountFormProps = {
  isLoading?: boolean;
  form: UseAccountFormReturn;
};

export const AccountForm = ({ form, isLoading }: AccountFormProps) => {
  const { control, formState } = form;

  return (
    <Box.Stack css={styles.root} gap="$4">
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
              id="search-account-name"
              aria-label="Account Name"
              placeholder="Type account name"
            />
          </Input>
        )}
      />
    </Box.Stack>
  );
};

const styles = {
  root: { width: '100%' },
};
