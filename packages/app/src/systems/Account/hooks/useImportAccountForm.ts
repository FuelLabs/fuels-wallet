import { yupResolver } from '@hookform/resolvers/yup';
import { isB256 } from 'fuels';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

export type ImportAccountFormValues = {
  privateKey: string;
};

const schema = yup
  .object({
    privateKey: yup
      .string()
      .test('is-key-valid', 'Private Key is not valid', (v) => isB256(v || ''))
      .required('Private Key is required'),
  })
  .required();

const DEFAULT_VALUES = {
  privateKey: '',
};

export type UseImportAccountFormReturn = ReturnType<
  typeof useImportAccountForm
>;

export function useImportAccountForm() {
  const form = useForm<ImportAccountFormValues>({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  });

  return form;
}
