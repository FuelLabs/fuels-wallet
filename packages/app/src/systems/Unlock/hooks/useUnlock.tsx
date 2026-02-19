import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const schema = yup
  .object({
    password: yup.string().required('Password is required'),
  })
  .required();

export type UseUnlockFormReturn = ReturnType<typeof useUnlockForm>;

export type UnlockFormValues = {
  password: string;
};

export type UnlockFormValuesErrors = Partial<Record<keyof UnlockFormValues, string>>;

export function useUnlockForm(formErrors?: UnlockFormValuesErrors) {
  const form = useForm<UnlockFormValues>({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: {
      password: '',
    },
  });

  useEffect(() => {
    if (formErrors) {
      Object.entries(formErrors).forEach(([key, message]) => {
        if (message) {
          form.setError(key as keyof UnlockFormValues, {
            type: 'manual',
            message,
          });
        }
      });
    }
  }, [formErrors, form.setError]);

  return form;
}
