import type { Account } from '@fuel-wallet/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { isB256 } from 'fuels';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import type { Maybe } from '~/systems/Core';

import { useAccountFormName } from './useAccountFormName';

export type ImportAccountFormValues = {
  privateKey: string;
  name: string;
};

const DEFAULT_VALUES = {
  privateKey: '',
  name: '',
};

export type UseImportAccountFormReturn = ReturnType<
  typeof useImportAccountForm
>;

export type UseImportAccountForm = {
  accounts?: Maybe<Account[]>;
};

export function useImportAccountForm(opts: UseImportAccountForm) {
  const nameSchemaObj = useAccountFormName(opts?.accounts || []);
  const schema = yup.object({
    name: nameSchemaObj,
    privateKey: yup
      .string()
      .test('is-key-valid', 'Private Key is not valid', (v) => isB256(v || ''))
      .required('Private Key is required'),
  });

  const defaultName = `Account ${(opts?.accounts?.length || 0) + 1}`;

  const form = useForm<ImportAccountFormValues>({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: {
      ...DEFAULT_VALUES,
      name: defaultName,
    },
  });

  return form;
}
