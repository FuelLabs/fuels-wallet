import { InputPassword } from '@fuel-ui/react';

import type { UseUnlockFormReturn } from '../../hooks/useUnlockForm';

import { ControlledField } from '~/systems/Core';

type UnlockFormProps = {
  form: UseUnlockFormReturn;
};

export function UnlockForm({ form }: UnlockFormProps) {
  const { control } = form;
  return (
    <ControlledField
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
