import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const schema = yup
  .object({
    password: yup.string(),
  })
  .required();

export type UseUnlockFormReturn = ReturnType<typeof useUnlockForm>;

export type UnlockFormValues = {
  password?: string;
};

export type UnlockFormValuesErrors = Partial<UnlockFormValues>;

export function useUnlockForm(formErrors?: UnlockFormValuesErrors) {
  const form = useForm<UnlockFormValues>({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: {
      password: '',
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const errors = formErrors || {};
    // biome-ignore lint/complexity/noForEach: <explanation>
    Object.keys(errors).forEach((key) => {
      if (errors[key]) {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        form.setError(key as any, {
          type: 'manual',
          message: errors[key],
        });
      }
    });
  }, [formErrors]);

  return form;
}
