import { InputPassword } from '@fuel-ui/react';
import { ControlledField } from '~/systems/Core';

import type { UseUnlockFormReturn } from '../../hooks/useUnlockForm';

type UnlockFormProps = {
  form: UseUnlockFormReturn;
};

export function UnlockForm({ form }: UnlockFormProps) {
  const { control } = form;
  return (
    <ControlledField
      css={{ width: '90%' }}
      control={control}
      name="password"
      render={({ field }) => (
        <InputPassword
          {...field}
          autoComplete="current-password"
          placeholder="Type your password"
          aria-label="Your Password"
        />
      )}
    />
  );
}
