import { InputPassword, Stack } from '@fuel-ui/react';

import type { UseUnlockFormReturn } from '../../hooks/useUnlockForm';

import { ControlledField } from '~/systems/Core';

type UnlockFormProps = {
  form: UseUnlockFormReturn;
};

export function UnlockForm({ form }: UnlockFormProps) {
  const { control } = form;
  return (
    <Stack gap="$4">
      <ControlledField
        control={control}
        name="password"
        label="Password"
        render={({ field }) => (
          <InputPassword
            {...field}
            placeholder="Type your password"
            aria-label="Your Password"
          />
        )}
      />
    </Stack>
  );
}
