import { yupResolver } from '@hookform/resolvers/yup';
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

export function useUnlockForm() {
  return useForm<UnlockFormValues>({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: {
      password: '',
    },
  });
}
